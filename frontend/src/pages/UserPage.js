import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import ProjectList from "../components/ProjectList";
import UserProfile from "../components/UserProfile";
import { API } from "../config";

const UserPage = () => {
  const location = useLocation();
  const userObject = location.state.user;
  const userId = location.state.userId;

  const [user, setUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ owner_id: 1, title: "", event_dt: "", end_dt: "", name_li: [] });

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API.USERS}/${userId}`).then((res) => setUser(res.data));
  }, [userId]);

  const handleCreateProjectClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseIconClick = () => {
    setIsModalOpen(false);
  };

  const handleChangeNewProject = (e) => {
    setNewProject({
      ...newProject,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateClick = async (e) => {
    e.preventDefault();

    var form_data = new FormData();

    for ( var key in newProject ) {
        if(key=="name_li"){
          console.log(newProject[key]);
          console.log(JSON.stringify(newProject[key]));
          form_data.append(key, JSON.stringify(newProject[key]));
        }
        else{
          form_data.append(key, newProject[key]);
        }
    }

    axios.post(`${API.PROJECTS}`, form_data).then((res) => {

      if(res['status']==200){
            const projectId = res['data']['project']['project_id'];
            const projectObject = res['data']['project'];
            navigate("projectid", { state: { userObject: userObject, projectId: projectId, projectObject:projectObject  } });
      }
      else{
        alert('정산 제대로 생성 x');
      }
    });
    setNewProject({ owner_id: userId, title: "", event_dt: "", end_dt: "", name_li: [] });

    // alert("todo: 생성 후 해당 정산 페이지로 이동");
    setIsModalOpen(false);
  };

  return (
    <Fragment>
      <main className="mt-24">
        <div className="flex items-center mb-6">
          <UserProfile large={true} />
          <div className="ml-2">
            <span className="font-scoredream text-2xl font-semibold">{user.k_name}</span>
            <span className="font-scoredream text-2xl font-light">님</span>
            <br />
            <span className="font-scoredream text-2xl font-light">안녕하세요.</span>
          </div>
        </div>
        <button
          className="w-full h-12 mb-6 border-none rounded-md bg-lime font-scoredream text-base text-black"
          type="button"
          onClick={handleCreateProjectClick}
        >
          <span className="font-medium">새로운 정산</span>
          <span className="font-light">을 생성해보세요!</span>
        </button>
        <div className="mb-6">
          <div className="mb-1.5">
            현재 <span className="font-semibold text-green">진행중</span>인 정산이에요!
          </div>
          <ProjectList isComplete={false} />
        </div>
        <div className="mb-6">
          <div className="mb-1.5">
            이미 <span className="font-semibold text-red">완료</span>된 정산이에요!
          </div>
          <ProjectList isComplete={true} />
        </div>
      </main>
      {isModalOpen && (
        <div className="flex flex-col justify-center items-center fixed inset-0 z-20">
          <div className="absolute inset-0" style={{ background: "rgba(11, 19, 30, 0.37)" }} />
          <div className="flex flex-col w-11/12 p-4 rounded-md bg-white z-10" style={{ maxWidth: "360px", minHeight: "420px" }}>
            <div className="flex justify-end">
              <IoCloseOutline size="24" onClick={handleCloseIconClick} />
            </div>
            <div className="flex flex-col items-center">
              <h1 className="mb-5 text-2xl font-medim">정산 생성</h1>
              <form className="flex flex-col w-full mb-5">
                <div className="mb-4">
                  <label className="text-md tracking-tight">정산명</label>
                  <input
                    className="w-full h-12 mt-0.5 py-3.5 px-3 border border-width border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                    name="title"
                    type="text"
                    value={newProject.title}
                    onChange={handleChangeNewProject}
                  />
                </div>
                <div className="mb-4">
                  <label className="text-md tracking-tight">날짜</label>
                  <input
                    className="w-full h-12 mt-0.5 py-3.5 px-3 border border-width border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                    name="event_dt"
                    type="date"
                    value={newProject.event_dt}
                    onChange={handleChangeNewProject}
                  />
                </div>
                <div className="mb-2">
                  <label className="text-md tracking-tight">참여자</label>
                  <input
                    className="w-full h-12 mt-0.5 py-3.5 px-3 border border-width border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                    placeholder="todo: 참여자 입력"
                  />
                </div>
                <div className="flex items-center w-full h-14 mb-4 px-2 border border-width border-lightgray rounded-md bg-lightgray overflow-x-scroll">
                  <span className="mr-2 p-1.5 border-none rounded-lg bg-white text-center whitespace-nowrap overflow-hidden" style={{ minWidth: "60px" }}>
                    {user.k_name}
                  </span>
                </div>
                <div className="mb-4">
                  <label className="text-md tracking-tight">입력 마감 기한</label>
                  <input
                    className="w-full h-12 mt-0.5 py-3.5 px-3 border border-width border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                    name="end_dt"
                    type="date"
                    value={newProject.end_dt}
                    onChange={handleChangeNewProject}
                  />
                </div>
              </form>
              <button className="w-full h-12 mb-3 border-none rounded-md bg-lime font-notosans text-base text-white" type="submit" onClick={handleCreateClick}>
                생성하기
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default UserPage;
