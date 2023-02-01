import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Input from "../UI/Input";
import Button from "../UI/Button";
import { API } from "../../config";

const ProjEditModal = (props) => {
  const navigate = useNavigate();

  const projectInfo = props.project;
  const originalPayMembers = props.payMembers;

  const [newPayMembers, setNewPayMembers] = useState(originalPayMembers);
  const [newTitle, setNewTitle] = useState(projectInfo.title);
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

  const onEditComplete = async (e) => {
    e.preventDefault();

    if (projectInfo.title === "" || projectInfo.end_dt === "") {
      alert("정산명과 입력 마감 날짜를 입력해주세요");
      return;
    }

    const edittedProFormData = new FormData();
    for (let key in projectInfo) {
      if (key !== "name_li")
        edittedProFormData.append(key, JSON.stringify(projectInfo.key));
      else edittedProFormData.append(key, newPayMembers);
    }

    try {
      const newProjInfo = await axios.patch(
        `${API.PROJECT}/${projectInfo.project_id}`,
        edittedProFormData
      );
      console.log(newProjInfo);

      //   const getRes = await axios.get(`${API.PAYS}/${projectInfo.project_id}`);
      //   props.setPays(getRes.data);

      console.log("navigate . . .");
      navigate(`${projectInfo.project_id}`, {
        state: {
          userInfo: props.user,
          projectInfo: newProjInfo,
          members: newPayMembers,
        },
      });
      console.log("navigate done");
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
        value={projectInfo.end_dt}
        onChange={endDateChangeHandler}
      /> */}
      <Button
        className="w-full h-12 mb-3 border-none rounded-md bg-lime font-notosans text-base text-white"
        type="submit"
        onClick={onEditComplete}
      >
        수정 완료
      </Button>
    </form>
  );
};

export default ProjEditModal;
