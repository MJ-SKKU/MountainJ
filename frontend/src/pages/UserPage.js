import axios from "axios";
import React, { Fragment, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import ProjectList from "../components/ProjectList";
import UserProfile from "../components/UserProfile";
import { API } from "../config";
import moment from 'moment';

const UserPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = location.state.userInfo;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState(
    {
      owner_id: userInfo.id, 
      title: moment().format('YYMMDD.') + '정산', 
      event_dt: moment().format('YYYY-MM-DD'), 
      end_dt: moment().add('7', 'days').format('YYYY-MM-DD'), 
      name_li: [] 
    });
  const [newMember, setNewMember] = useState("");
  const InitMemberList = [`${userInfo.k_name}`]
  const [memberList, setMemberList] = useState(InitMemberList);

  let curr = new Date();
  curr.setDate(curr.getDate() + 3);
  let date = curr.toISOString().substring(0,10);

  const handleCreateProjectClick = () => {
    setMemberList([...InitMemberList]);
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

  const handleChangeNewMember = (e) => {
    setNewMember(e.target.value);
  };
  
  const handleKeyDownMember = (e) => {
    if(e.key === 'Enter' && e.target.value != ''){
      e.preventDefault();
      handleAddMemberClick();
    }
  }

  const handleAddMemberClick = () => {
    console.log('Test1', memberList)
    memberList.push(newMember);
    console.log('Test2', memberList)
    setNewMember("");
  };

  const handleDeleteMemberClick = (e) => {
    e.preventDefault();
    console.log('handleDeleteMemberClick')
    let index = e.target.getAttribute("index");
    memberList.splice(index, 1);
    setMemberList([...memberList]);
    let eve = {"target":{"name":"name_li","value":memberList}};
    handleChangeNewProject(eve);
  }

  const handleCreateClick = async (e) => {
    e.preventDefault();

    if (newProject.title === "" || newProject.end_dt === "") {
      alert("정산명과 입력 마감 날짜를 입력해주세요");
      return 0;
    }

    newProject.name_li = memberList; // 참여자 입력 받은 memberList 배열  newProject.name_li 에 넣기
    const newProjectFormData = new FormData();
    for (let key in newProject) {
      if (key === "name_li") newProjectFormData.append(key, JSON.stringify(newProject[key]));
      else newProjectFormData.append(key, newProject[key]);
    }

    axios.post(`${API.PROJECTS}`, newProjectFormData).then((res) => {
      if (res.status === 200) {
        const projectInfo = res.data.project;
        axios.get(`${API.MEMBERS}/${projectInfo.project_id}`).then((res) => {
          for (let member in res.data) {
            if (userInfo.id === res.data[member].user) {
              const memberId = res.data[member].member_id;
              navigate(`${projectInfo.project_id}`, { state: { userInfo: userInfo, memberId: memberId, projectInfo: projectInfo } });
            }
          }
        });
      } else {
        alert("정산 생성 실패");
      }
    });
    setNewProject({ owner_id: userInfo.id, title: "", event_dt: "", end_dt: "", name_li: [] });
    setMemberList([`${userInfo.k_name}`]);

    setIsModalOpen(false);
  };

  return (
    <Fragment>
      <main className="mt-24">
        <div className="flex items-center mb-6">
          <UserProfile large={true} />
          <div className="ml-2">
            <span className="font-scoredream text-2xl font-semibold">{userInfo.k_name}</span>
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
          <ProjectList userInfo={userInfo} isComplete={false} />
        </div>
        <div className="mb-6">
          <div className="mb-1.5">
            이미 <span className="font-semibold text-red">완료</span>된 정산이에요!
          </div>
          <ProjectList userInfo={userInfo} isComplete={true} />
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
                  <label className="text-md tracking-tight">
                    정산명<span className="pl-0.5 text-red">*</span>
                  </label>
                  <input
                    className="w-full h-12 mt-0.5 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                    name="title"
                    type="text"
                    value={newProject.title}
                    onChange={handleChangeNewProject}
                  />
                </div>
                <div className="mb-4">
                  <label className="text-md tracking-tight">날짜</label>
                  <input
                    className="w-full h-12 mt-0.5 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                    name="event_dt"
                    type="date"
                    value={newProject.event_dt}
                    defaultValue={date}
                    onChange={handleChangeNewProject}
                  />
                </div>
                <div className="mb-1.5">
                  <label className="text-md tracking-tight">참여자</label>
                  <input
                    className="w-full h-12 mt-0.5 mb-1 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                    name="member"
                    type="text"
                    value={newMember}
                    onChange={handleChangeNewMember}
                    onKeyDown={handleKeyDownMember}
                  />
                  <button className="w-full h-10 mb-1 rounded bg-lime text-white" type="button" onClick={handleAddMemberClick}>
                    추가하기
                  </button>
                  <div className="flex items-center w-full h-14 mb-4 px-2 border border-lightgray rounded-md bg-lightgray overflow-x-auto">
                    {memberList.map((member, index) => (
                      <span
                        key={index}
                        className="mr-2 p-1.5 border-none rounded-lg bg-white text-center whitespace-nowrap overflow-hidden"
                        style={{ minWidth: "60px" }}
                      >
                        {member}
                        <button className="ml-1 text-danger" index={index} onClick={handleDeleteMemberClick}>x</button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-md tracking-tight">
                    입력 마감 기한<span className="pl-0.5 text-red">*</span>
                  </label>
                  <input
                    className="w-full h-12 mt-0.5 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
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
