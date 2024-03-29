import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { projectActions } from "../../store/ProjectInfo";
import { membersActions } from "../../store/Members";
import { paysActions } from "../../store/Pays";
import { API } from "../../config";
import Input from "../UI/Input";
import Button from "../UI/Button";
import moment from "moment";

const ProjEditModal = (props) => {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.projectReducer);
  const members = useSelector((state) => state.membersReducer.memObjects);

  const [newPayMembers, setNewPayMembers] = useState(members);
  const [newTitle, setNewTitle] = useState(project.title);
  const [newMemberName, setNewMemberName] = useState("");

  const onAddMember = () => {
    for (const member of newPayMembers) {
      if (member.username === newMemberName.trim()) {
        alert(
          `"${member.username}"이/가 이미 있습니다. 다른 이름을 입력해주세요.`
        );
        return;
      }
    }

    if (newMemberName.trim().length > 0) {
      const newMember = { username: newMemberName };
      setNewPayMembers([...newPayMembers, newMember]);
    }
    setNewMemberName("");
  };

  const onDeleteMember = async (e) => {
    e.preventDefault();

    const member = JSON.parse(e.target.getAttribute("member"));
    if (!member.member_id) {
      const idx = e.target.getAttribute("index");
      let member_li = [...newPayMembers];
      member_li.splice(idx, 1);
      setNewPayMembers(member_li);
      return;
    }
    if (member.user === null) {
      console.log(member.member_id);
      if (
        window.confirm(
          " 참여자를 삭제하시겠습니까? \n 삭제할 경우 " +
            member.username +
            "님이 기존에 입력된 결제내역에서 제외됩니다."
        )
      ) {
        const idx = e.target.getAttribute("index");
        let member_li = [...newPayMembers];
        member_li.splice(idx, 1);

        setNewPayMembers(member_li);
      }
    } else {
      alert("해당 참여자는 회원이므로 삭제할 수 없습니다.");
    }
  };

  const handleOnKeyPress = async (e) => {
    console.log("hih");
    if (e.key === "Enter") {
      onAddMember(); // Enter 입력이 되면 클릭 이벤트 실행
    }
  };

  const onEditComplete = async () => {
    // if (project.title === "" || project.end_dt === "") {
    //   alert("정산명과 입력 마감 날짜를 입력해주세요");
    //   return;
    // }

    let newProjState = {
      owner_id: project.owner,
      title: newTitle,
      event_dt: project.event_dt,
      end_dt: project.end_dt,
      member_li: newPayMembers,
    };

    if (project.title === "") {
      newProjState.title = moment().lang("ko").format("정산 MMDD").toString();
    }

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
      dispatch(projectActions.setProject(newProjInfo.data.project));
      const membersRes = await axios.get(
        `${API.MEMBERS}/${project.project_id}`
      );
      dispatch(membersActions.loadMembers(membersRes.data));
      const paysRes = await axios.get(`${API.PAYS}/${project.project_id}`);
      dispatch(paysActions.loadPays(paysRes.data));
    } catch {
      console.log("정산 수정에 실패");
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
        onKeyDown={handleOnKeyPress}
      />
      <Button
        className="w-full h-10 mb-1 rounded bg-lime text-white"
        type="button"
        onClick={onAddMember}
        가
      >
        참여자 추가
      </Button>
      <div className="flex items-center w-full h-14 mb-4 px-2 rounded-md bg-lightgray overflow-x-auto">
        {newPayMembers.map((member, idx) => (
          <button
            key={idx}
            index={idx}
            member={JSON.stringify(member)}
            className="min-w-fit mr-2 p-1.5 border-none rounded-lg bg-white text-center whitespace-nowrap overflow-hidden"
            // onClick={onDeleteMember}
            disabled={true}
          >
            {member.username}
            {project.owner !== member.user && (
              <span
                className="px-1"
                key={idx}
                index={idx}
                member={JSON.stringify(member)}
                onClick={onDeleteMember}
              >
                x
              </span>
            )}
          </button>
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
