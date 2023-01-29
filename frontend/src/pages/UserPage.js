import React, { Fragment, useEffect, useState, useRef } from "react";
import { /*useLocation,*/ useNavigate } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import moment from "moment";

import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import ProjectList from "../components/ProjectList";
import UserProfile from "../components/UserProfile";
import ProjectModal from "../components/UI/ProjectModal";
import { API } from "../config";

const UserPage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [InitMemberList, setInitMemberList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({});
  const [memberList, setMemberList] = useState([]);

  const titleInputRef = useRef();
  const memberInputRef = useRef();

  const navigate = useNavigate();

  if (JSON.stringify(userInfo) === JSON.stringify({})) {
    setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
  }

  useEffect(() => {
    if (userInfo !== null && JSON.stringify(userInfo) !== JSON.stringify({})) {
      console.log("Init . . .");
      setNewProject({
        owner_id: userInfo.id,
        title: moment().format("YYMMDD"),
        event_dt: moment().format("YYYY-MM-DD"),
        end_dt: moment().add("7", "days").format("YYYY-MM-DD"),
        name_li: [],
      });
      setMemberList([`${userInfo.k_name}`]);
      setInitMemberList([`${userInfo.k_name}`]);
    } else {
      console.log("..");
    }
  }, [userInfo]);

  const createProjectClickHandler = () => {
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

  const addMemberClickHandler = (e) => {
    const enteredNewMember = memberInputRef.current.value;

    if (enteredNewMember.trim().length > 0) {
      setMemberList((prevMemberList) => {
        return [...prevMemberList, enteredNewMember];
      });
    }

    console.log(memberList);
    memberInputRef.current.value = "";
  };

  const handleDeleteMemberClick = (e) => {
    e.preventDefault();

    const index = e.target.getAttribute("index");
    let memList = [...memberList];
    memList.splice(index, 1);
    setMemberList(memList);

    let eve = { target: { name: "name_li", value: memberList } };
    handleChangeNewProject(eve);
  };

  const createClickHandler = async () => {
    if (newProject.title === "" || newProject.end_dt === "") {
      alert("정산명과 입력 마감 날짜를 입력해주세요");
      return 0;
    }

    newProject.name_li = memberList; // 참여자 입력 받은 memberList 배열  newProject.name_li 에 넣기
    const newProjectFormData = new FormData();
    for (let key in newProject) {
      if (key === "name_li")
        newProjectFormData.append(key, JSON.stringify(newProject[key]));
      else newProjectFormData.append(key, newProject[key]);
    }

    axios.post(`${API.PROJECTS}`, newProjectFormData).then((res) => {
      if (res?.status === 200) {
        const projectInfo = res.data.project;
        axios.get(`${API.MEMBERS}/${projectInfo.project_id}`).then((res) => {
          for (let member in res.data) {
            if (userInfo.id === res.data[member].user) {
              const memberId = res.data[member].member_id;
              navigate(`${projectInfo.project_id}`, {
                state: {
                  userInfo: userInfo,
                  memberId: memberId,
                  projectInfo: projectInfo,
                },
              });
            }
          }
        });
      } else {
        alert("정산 생성 실패");
      }
    });

    setNewProject({
      owner_id: userInfo.id,
      title: "",
      event_dt: "",
      end_dt: "",
      name_li: [],
    });
    setMemberList([`${userInfo.k_name}`]);
    setIsModalOpen((prevState) => {
      return !prevState;
    });
  };

  return (
    <Fragment>
      <main className="mt-24">
        <div className="flex items-center mb-6">
          <UserProfile large={true} />
          <div className="font-scoredream text-2xl ml-3">
            <span className="font-semibold">{userInfo.k_name}</span>
            님<br />
            안녕하세요.
          </div>
        </div>
        <Button
          btnTitle="새로운 정산을 생성해보세요!"
          className="w-full h-12 mb-10 border-none rounded-md bg-lime font-scoredream text-base text-black"
          type="button"
          onClick={createProjectClickHandler}
        />
        <ProjectList userInfo={userInfo} isComplete={false} />
        <ProjectList userInfo={userInfo} isComplete={true} />
      </main>

      {isModalOpen && (
        <div className="flex flex-col justify-center items-center fixed inset-0 z-20">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(11, 19, 30, 0.37)" }}
          />
          <div
            className="flex flex-col w-11/12 p-4 rounded-md bg-white z-10"
            style={{ maxWidth: "360px", minHeight: "420px" }}
          >
            <div className="flex justify-end">
              <IoCloseOutline size="24" onClick={handleCloseIconClick} />
            </div>
            <div className="flex flex-col items-center">
              <h1 className="mb-5 text-2xl font-medim">정산 생성</h1>
              <form className="flex flex-col w-full mb-5">
                <Input
                  title="정산명*"
                  divClass="mb-4"
                  labelClass="text-md tracking-tight"
                  inputClass="w-full h-12 mt-0.5 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                  htmlFor="title"
                  type="text"
                  reference={titleInputRef}
                />
                {/* <div className="mb-4">
                 <label className="text-md tracking-tight">날짜</label>
                 <input
                   className="w-full h-12 mt-0.5 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                   name="event_dt"
                   type="date"
                   value={newProject.event_dt}
                   defaultValue={date}
                   onChange={handleChangeNewProject}
                 />
                </div> */}
                <Input
                  title="참여자"
                  divClass="mb-1.5"
                  labelClass="text-md tracking-tight"
                  inputClass="w-full h-12 mt-0.5 mb-1 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                  htmlFor="member"
                  type="text"
                  reference={memberInputRef}
                />
                <Button
                  btnTitle="추가하기"
                  className="w-full h-10 mb-1 rounded bg-lime text-white"
                  type="button"
                  onClick={addMemberClickHandler}
                />
                <div className="mb-1.5 flex items-center w-full h-14 mb-4 px-2 border border-lightgray rounded-md bg-lightgray overflow-x-auto">
                  {memberList.map((member, index) => (
                    <span
                      key={index}
                      className="mr-2 p-1.5 border-none rounded-lg bg-white text-center whitespace-nowrap overflow-hidden"
                      style={{ minWidth: "60px" }}
                    >
                      {member}
                      {userInfo.k_name === member ? (
                        <button
                          className="ml-1 text-danger"
                          index={index}
                          onClick={handleDeleteMemberClick}
                        ></button>
                      ) : (
                        <button
                          className="ml-1 text-danger"
                          index={index}
                          onClick={handleDeleteMemberClick}
                        >
                          x
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {/* <div className="mb-4">
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
                </div> */}
              </form>
              <Button
                btnTitle="생성하기"
                className="w-full h-12 mb-3 border-none rounded-md bg-lime font-notosans text-base text-white"
                type="submit"
                onClick={createClickHandler}
              />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default UserPage;
