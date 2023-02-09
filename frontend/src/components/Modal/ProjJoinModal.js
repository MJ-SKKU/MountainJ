import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { projectActions } from "../../store/ProjectInfo";
import { membersActions } from "../../store/Members";
import { API } from "../../config";
import Input from "../UI/Input";
import Button from "../UI/Button";
import {paysActions} from "../../store/Pays";
import moment from "moment";

const ProjJoinModal = (props) => {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.projectReducer);
  const members = useSelector((state) => state.membersReducer.memObjects);

  const [newPayMembers, setNewPayMembers] = useState(members);
  const [newTitle, setNewTitle] = useState(project.title);
  const [newMemberName, setNewMemberName] = useState("");

  const user = useSelector((state) => state.userReducer.userObj);


  let member_id="";
  const onSelectMember = (e) => {
    member_id = e.target.value;
  };

  // const onNoJoinClick = async () => {
  //     props.setIsJoinOpen(false);
  // }

  const onJoinComplete = async () => {


    const joinProjFormData = new FormData();
    if(member_id!="") {
        joinProjFormData.append("member_id", member_id);
    }
    joinProjFormData.append("user_id", user.id);


    try {
      const res = await axios.patch(
        `${API.MEMBER_JOIN}/${project.project_id}`,
        joinProjFormData
      );
      dispatch(membersActions.loadMembers(res.data));
      console.log("정산 참여에 성공.");
    } catch {
      console.log("정산 참여에 실패");
    }

    props.setIsJoinOpen(false);
  };



  return (
    <form className="flex flex-col w-full mb-5">
        <div className="border rounded-md px-2">
            <div className="w-full text-center mb-2 pt-3 font-medium">
            {project.title}
            </div>
            <div className="w-full rounded-md bg-lightgray">
                <div className="flex items-center w-full h-14 mb-2 px-2 rounded-md bg-lightgray overflow-x-auto">
                    {newPayMembers.map((member, idx) => (
                      <button
                        key={idx}
                        index={idx}
                        member={JSON.stringify(member)}
                        className="min-w-fit mr-2 p-1.5 border-none rounded-lg bg-white text-center whitespace-nowrap overflow-hidden"
                        // onClick={onDeleteMember}
                      >
                        {member.username}
                      </button>
                    ))}
                </div>
            </div>
        </div>
        <br/>
        <div className="mb-4">
          <label htmlFor="payer" className="text-md tracking-tight small-font-size">
            기존 입력된 참여자 중 본인이 있나요?
              <br/>
            있다면, 아래에서 본인을 선택해주세요.
          </label>
          <select
            id="payer"
            className="w-full h-12 mt-0.5 px-2 border border-gray rounded font-notosans text-base tracking-tight focus:outline-1 focus:outline-lime"
            onChange={onSelectMember}
            defaultValue=""
          >
              <option value="">없습니다. ({user.k_name})으로 새롭게 참여</option>
            {members.map((member, idx) => (
              <option data-idx={idx} value={member.member_id}>
                {member.username}
              </option>
            ))}
          </select>
        </div>

      <Button
        className="w-full h-12 mb-3 border-none rounded-md bg-lime font-notosans text-base text-white"
        type="button"
        onClick={onJoinComplete}
      >
        참여 완료
      </Button>
      {/*  <Button*/}
      {/*  className="w-full h-12 mb-3 border rounded-md  font-notosans text-base "*/}
      {/*  type="button"*/}
      {/*  onClick={onNoJoinClick}*/}
      {/*>*/}
      {/*  참여하지 않을래요.*/}
      {/*</Button>*/}
    </form>
  );
};

export default ProjJoinModal;
