import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";

import { projectActions } from "../../store/ProjectInfo";
import { projectsActions } from "../../store/Projects";
import { membersActions } from "../../store/Members";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { API } from "../../config";

const CreateProjModal = (props) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.userObj);

  const [title, setTitle] = useState("");
  const [memberList, setMemberList] = useState([user.k_name]);
  const [newMember, setNewMember] = useState("");


  const initProjState = {
    owner_id: user.id,
    title: "",
    event_dt: moment().format("YYYY-MM-DD"),
    end_dt: moment().add("7", "days").format("YYYY-MM-DD"),
    name_li: [user.k_name],
  };
  let newProjState = { ...initProjState };

  const onAddMember = () => {
    const enteredNewMember = newMember;
    if (enteredNewMember.trim().length > 0) {
      setMemberList([...memberList, enteredNewMember]);
    }
    setNewMember("");
  };

  const onDeleteMember = (e) => {
    e.preventDefault();

    const idx = e.target.getAttribute("index");
    let name_li = [...memberList];
    name_li.splice(idx, 1);

    setMemberList(name_li);
  };

  const onCreateNewProject = async (e) => {
    e.preventDefault();

    if (newProjState.end_dt === "") {
      alert("마감 날짜를 반드시 입력해주세요");
      return;
    }

    newProjState = {
      owner_id: user.id,
      title,
      event_dt: initProjState.event_dt,
      end_dt: initProjState.end_dt, // 마감날짜 입력 기능 추가하면 바꿀 것
      name_li: memberList,
      status: 0,
    };

    // 타이틀 미입력 시 입력 순간 일자 자동 입력 (place holder로)
    console.log(title);
    if (title === "") {
      const today = moment().lang("ko").format("정산 MMDDHHMM").toString();
      newProjState.title = today
    }

    const newProjectFormData = new FormData();
    for (let key in newProjState) {
      if (key !== "name_li") newProjectFormData.append(key, newProjState[key]);
      else newProjectFormData.append(key, JSON.stringify(newProjState[key]));
    }

    try {
      const res = await axios.post(`${API.PROJECTS}`, newProjectFormData); // 추가한 프로젝트 관련 정보 {members, project}
      if(res.status==200){
        const projectInfo = res.data.project;
        dispatch(projectActions.setProject(projectInfo));
        dispatch(membersActions.loadMembers(res.data.members));
        dispatch(projectsActions.needUpdate());
        navigate(`/projects/${projectInfo.project_id}`);

      }
    } catch {
      alert("정산 생성에 실패하였습니다.");
    }

    newProjState = { ...initProjState };
    setMemberList([user.k_name]);
    props.setIsModalOpen(false);
  };

  return (
    <form className="flex flex-col w-full mb-5" onSubmit={onCreateNewProject}>
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
        className="w-full h-10 mb-1 rounded-md bg-lime text-white"
        type="button"
        onClick={onAddMember}
      >
        참여자 추가
      </Button>
      <div className="mb-1.5 flex items-center w-full h-14 mb-4 px-2 rounded-md bg-lightgray overflow-x-auto">
        {memberList.map((member, idx) => (
          <span
            key={idx}
            index={idx}
            className="mr-2 p-1.5 min-w-[60px] border-none rounded-lg bg-white text-center whitespace-nowrap overflow-hidden"
            onClick={onDeleteMember}
          >
            {member}
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
        className="w-full h-12 mt-3 border-none rounded-md bg-lime font-notosans text-lg text-white"
        type="submit"
      >
        생성 완료
      </Button>
    </form>
  );
};

export { CreateProjModal };
