import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { projectActions } from "../../store/ProjectInfo";
import { membersActions } from "../../store/Members";
import { API } from "../../config";
import Input from "../UI/Input";
import Button from "../UI/Button";

const ProjEditModal = (props) => {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.projectReducer);
  const members = useSelector((state) => state.membersReducer.memObjects);

  const [newPayMembers, setNewPayMembers] = useState(members);
  const [newTitle, setNewTitle] = useState(project.title);
  const [newMemberName, setNewMemberName] = useState("");

  const onAddMember = () => {
    const enteredNewMemberName = newMemberName;
    if (enteredNewMemberName.trim().length > 0) {
      const newMember = { username: newMemberName };
      setNewPayMembers([...newPayMembers, newMember]);
    }
    setNewMemberName("");
  };

  const onDeleteMember = (e) => {
    e.preventDefault();

    const idx = e.target.getAttribute("index");
    let member_li = [...newPayMembers];
    member_li.splice(idx, 1);

    setNewPayMembers(member_li);
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
      member_li: newPayMembers,
    };

    const edittedProjFormData = new FormData();
    for (let key in newProjState) {
      if (key !== "member_li")
        edittedProjFormData.append(key, newProjState[key]);
      else edittedProjFormData.append(key, JSON.stringify(newProjState[key]));
    }

    try {
      const newProjInfo = await axios.patch(
        `${API.PROJECT}/${project.project_id}`,
        edittedProjFormData
      );
      const getRes = await axios.get(`${API.MEMBERS}/${project.project_id}`);

      dispatch(projectActions.setProject(newProjInfo.data.project));
      dispatch(membersActions.loadMembers(getRes.data));
    } catch {
      alert("정산 수정에 실패하였습니다.");
    }

    props.setIsEditOpen(false);
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
        value={newMemberName}
        onChange={setNewMemberName}
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
            index={idx}
            className="min-w-fit mr-2 p-1.5 border-none rounded-lg bg-white text-center whitespace-nowrap overflow-hidden"
            onClick={onDeleteMember}
          >
            {member.username}
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
