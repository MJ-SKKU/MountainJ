import React, { Fragment, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import moment from "moment";

import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import ProjectList from "../components/ProjectList";
import UserProfile from "../components/UserProfile";
import { API } from "../config";

const UserPage = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const initProjState = {
    owner_id: userInfo.id,
    title: moment().format("YYMMDD"),
    event_dt: moment().format("YYYY-MM-DD"),
    end_dt: moment().add("7", "days").format("YYYY-MM-DD"),
    name_li: [userInfo.k_name],
  };
  let newProjState = { ...initProjState };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberList, setMemberList] = useState([userInfo.k_name]);

  const titleInputRef = useRef();
  const memberInputRef = useRef();

  const navigate = useNavigate();

  const createProjectClickHandler = () => {
    setMemberList([userInfo.k_name]);
    setIsModalOpen(true);
  };

  const closeIconClickHandler = () => {
    newProjState = { ...initProjState };
    setIsModalOpen(false);
  };

  const addMemberClickHandler = () => {
    const enteredNewMember = memberInputRef.current.value;

    if (enteredNewMember.trim().length > 0) {
      setMemberList([...memberList, enteredNewMember]);
    }

    memberInputRef.current.value = "";
  };

  const deleteMemberClickHandler = (e) => {
    e.preventDefault();

    const idx = e.target.getAttribute("index");
    let name_li = [...memberList];
    name_li.splice(idx, 1);

    setMemberList(name_li);
  };

  const createProjClickHandler = async (e) => {
    e.preventDefault();

    if (newProjState.title === "" || newProjState.end_dt === "") {
      alert("정산명과 입력 마감 날짜를 반드시 입력해주세요");
      return;
    }

    const enteredTitle = titleInputRef.current.value;
    newProjState = {
      owner_id: userInfo.id,
      title: enteredTitle,
      event_dt: initProjState.event_dt,
      end_dt: initProjState.end_dt,
      name_li: memberList,
    };

    const newProjectFormData = new FormData();
    for (let key in newProjState) {
      if (key !== "name_li") newProjectFormData.append(key, newProjState[key]);
      else newProjectFormData.append(key, JSON.stringify(newProjState[key]));
    }

    try {
      const postResponse = await axios.post(
        `${API.PROJECTS}`,
        newProjectFormData
      );
      const projectInfo = postResponse.data.project;
      const getResponse = await axios.get(
        `${API.MEMBERS}/${projectInfo.project_id}`
      );

      for (let member in getResponse.data) {
        if (userInfo.id === getResponse.data[member].user) {
          const memberId = getResponse.data[member].member_id;
          navigate(`${projectInfo.project_id}`, {
            state: {
              userInfo,
              memberId,
              projectInfo,
            },
          });
        }
      }
    } catch {
      alert("잘못된 접근입니다");
    }

    newProjState = { ...initProjState };
    setMemberList([userInfo.k_name]);
    setIsModalOpen(false);
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
          <div className="relative max-w-[360px] min-h-[420px] flex flex-col w-11/12 p-4 rounded-md bg-white z-10">
            <IoCloseOutline
              className="absolute right-4"
              size="24"
              onClick={closeIconClickHandler}
            />
            <div className="flex flex-col items-center mt-6">
              <h1 className="mb-5 text-3xl font-medim">정산 생성</h1>
              <form
                className="flex flex-col w-full mb-5"
                onSubmit={createProjClickHandler}
              >
                <Input
                  title="정산명*"
                  divClass="mb-4"
                  labelClass="text-md tracking-tight"
                  inputClass="w-full h-12 mt-0.5 mb-1 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                  htmlFor="title"
                  default={initProjState.title}
                  ref={titleInputRef}
                />
                {/* <div className="mb-4">
                 <label className="text-md tracking-tight">날짜</label>
                 <input
                   className="w-full h-12 mt-0.5 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                   name="event_dt"
                   type="date"
                 />
                </div> */}
                <Input
                  title="참여자"
                  divClass="mb-1.5"
                  labelClass="text-md tracking-tight"
                  inputClass="w-full h-12 mt-0.5 mb-1 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                  htmlFor="member"
                  default={null}
                  ref={memberInputRef}
                />
                <Button
                  btnTitle="추가하기"
                  className="w-full h-10 mb-1 rounded bg-lime text-white"
                  type="button"
                  onClick={addMemberClickHandler}
                />
                <div className="mb-1.5 flex items-center w-full h-14 mb-4 px-2 border border-lightgray rounded-md bg-lightgray overflow-x-auto">
                  {memberList.map((member, idx) => (
                    <span
                      key={idx}
                      className="mr-2 p-1.5 min-w-[60px] border-none rounded-lg bg-white text-center whitespace-nowrap overflow-hidden"
                    >
                      {member}
                      {userInfo.k_name === member ? null : (
                        <button
                          className="ml-1"
                          index={idx}
                          onClick={deleteMemberClickHandler}
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
                 />
                </div> */}
                <Button
                  btnTitle="생성하기"
                  className="w-full h-12 mt-3 border-none rounded-md bg-lime font-notosans text-lg text-white"
                  type="submit"
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default UserPage;
