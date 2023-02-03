import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { projectActions } from "../../store/ProjectInfo";
import { membersActions } from "../../store/Members";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { API } from "../../config";

const ProjEditModal = (props) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.userObj);
  const project = useSelector((state) => state.projectReducer);
  const members = useSelector((state) => state.membersReducer.memObjects);

  let memberNames = [];
  for (let member of members) {
    memberNames.push(member.username);
  }

  const [newPayMembers, setNewPayMembers] = useState(memberNames);
  const [newTitle, setNewTitle] = useState(project.title);
  const [newMember, setNewMember] = useState("");

  const onAddMember = () => {
    const enteredNewMember = newMember;
    if (enteredNewMember.trim().length > 0) {
      setNewPayMembers([...newPayMembers, enteredNewMember]);
    }
    setNewMember("");
  };

  const onDeleteMember = (e) => {
    e.preventDefault();

    const idx = e.target.getAttribute("index");
    let name_li = [...newPayMembers];
    name_li.splice(idx, 1);

    setNewPayMembers(name_li);
  };

  const onEditComplete = async () => {
    const initProjectState = { ...project };
    let newProjState = { ...initProjectState };

    if (project.title === "" || project.end_dt === "") {
      alert("정산명과 입력 마감 날짜를 입력해주세요");
      return;
    }

    newProjState = {
      owner_id: project.owner,
      title: newTitle,
      event_dt: project.event_dt,
      end_dt: project.end_dt,
      name_li: newPayMembers,
    };

    const edittedProjFormData = new FormData();
    for (let key in newProjState) {
      if (key !== "name_li") edittedProjFormData.append(key, newProjState[key]);
      else edittedProjFormData.append(key, JSON.stringify(newProjState[key]));
    }

    try {
      const newProjInfo = await axios.patch(
        `${API.PROJECT}/${project.project_id}`,
        edittedProjFormData
      );
      console.log(newProjInfo);

      const res = axios.get(`${API.MEMBERS}/${project.project_id}`);
      console.log(res.data);
      dispatch(membersActions.loadMembers(res.data));

      navigate(`${project.project_id}`);
    } catch {
      alert("정산 수정에 실패하였습니다.");
    }
  };

  return (
    <form className="flex flex-col w-full mb-5">
      <Input
        title="정산명*"
        isEditMode={true}
        divClass="mb-4"
        labelClass="text-md tracking-tight"
        inputClass="w-full h-12 mt-0.5 mb-1 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
        htmlFor="title"
        value={newTitle}
        onChange={setNewTitle}
      />

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
        className="w-full h-10 mb-1 rounded bg-lime text-white"
        type="button"
        onClick={onAddMember}
      >
        추가하기
      </Button>
      <div className="flex items-center w-full h-14 mb-4 px-2 rounded-md bg-lightgray overflow-x-auto">
        {newPayMembers.map((member, idx) => (
          <span
            key={idx}
            className="min-w-fit mr-2 p-1.5 border-none rounded-lg bg-white text-center whitespace-nowrap overflow-hidden"
            onClick={onDeleteMember}
          >
            {member}
          </span>
        ))}
      </div>
      {/* <Input
        title="입력 마감 기한*"
        divClass="mb-1.5"
        labelClass="text-md tracking-tight"
        inputClass="w-full h-12 mt-0.5 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
        htmlFor="member"
        value={project.end_dt}
        onChange={endDateChangeHandler}
      /> */}
      <Button
        className="w-full h-12 mb-3 border-none rounded-md bg-lime font-notosans text-base text-white"
        type="button"
        onClick={onEditComplete}
      >
        수정 완료
      </Button>
    </form>
  );
};

export default ProjEditModal;
