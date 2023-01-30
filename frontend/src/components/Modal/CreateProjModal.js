import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

import Input from "../UI/Input";
import Button from "../UI/Button";
import { API } from "../../config";

const CreateProjModal = (props) => {
  const user = props.user;

  const [title, setTitle] = useState("");
  const [memberList, setMemberList] = useState([user.k_name]);
  const [newMember, setNewMember] = useState("");

  const navigate = useNavigate();

  const initProjState = {
    owner_id: user.id,
    title: moment().format("YYMMDD"),
    event_dt: moment().format("YYYY-MM-DD"),
    end_dt: moment().add("7", "days").format("YYYY-MM-DD"),
    name_li: [user.k_name],
  };
  let newProjState = { ...initProjState };

  const addMemberClickHandler = () => {
    const enteredNewMember = newMember;

    if (enteredNewMember.length > 0) {
      setMemberList([...memberList, enteredNewMember]);
    }

    setNewMember("");
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

    if (newProjState.end_dt === "") {
      alert("정산명과 입력 마감 날짜를 반드시 입력해주세요");
      return;
    }

    if (title === "") {
      const today = moment().format("YYMMDD").toString();
      setTitle(today);
    }

    newProjState = {
      owner_id: user.id,
      title: title,
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
        if (user.id === getResponse.data[member].user) {
          const memberId = getResponse.data[member].member_id;
          navigate(`${projectInfo.project_id}`, {
            state: {
              userInfo: user,
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
    setMemberList([user.k_name]);
    props.setIsModalOpen(false);
  };

  return (
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
        value={title}
        onChange={setTitle}
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
        value={newMember}
        onChange={setNewMember}
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
            {user.k_name === member ? null : (
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
  );
};

export { CreateProjModal };