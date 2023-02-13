import {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { projectActions } from "../../store/ProjectInfo";
import { membersActions } from "../../store/Members";
import { API } from "../../config";
import Input from "../UI/Input";
import Button from "../UI/Button";
import {paysActions} from "../../store/Pays";
import moment from "moment";
import {payActions} from "../../store/PayInfo";
import {resultsActions} from "../../store/Results";
import {FiEdit, FiCheck} from "react-icons/fi";

const ProjJoinModal = (props) => {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.projectReducer);
  const members = useSelector((state) => state.membersReducer.memObjects);

  const [newPayMembers, setNewPayMembers] = useState(members);

  const user = useSelector((state) => state.userReducer.userObj);

  const [newMemberName,setNewMemberName] = useState(user.k_name ? user.k_name :  "");
  const [selectedMember,setSelectedMember] = useState({username:newMemberName});

  useEffect(() => {

  }
    , []);


  let member_id="";
  const onSelectMember = (e) => {
      console.log("ggggggg");
      const member = JSON.parse(e.target.getAttribute("member"));
      console.log(member);
      // console.log(member.member_id)
      if(member && member.hasOwnProperty("member_id")){
          // console.log(member.member_id)
          setSelectedMember(member);
      }else{
          // console.log("hi");
         setSelectedMember({username:newMemberName});
      }
  };

  // const onNoJoinClick = async () => {
  //     props.setIsJoinOpen(false);
  // }
    useEffect(() => {
        let name = newMemberName;
        setNewMemberName(name.trim());
    dispatch(payActions.unsetPay());
        setSelectedMember({username:newMemberName});
      }, [newMemberName]);

  const onJoinComplete = async () => {


      const check = false;
      if(!selectedMember.member_id) {
          for (const member of newPayMembers) {
              console.log(selectedMember.username);
              console.log(member.username);
              if(member.username===selectedMember.username){
                  alert(`"${member.username}"이/가 이미 있습니다.\n기존 참여자 중 본인을 선택하거나 다른 이름을 입력해주세요.`);
                  return;
              }
          }
      }

    const joinProjFormData = new FormData();


    joinProjFormData.append("user_id", user.id);
    joinProjFormData.append("selected_member", JSON.stringify(selectedMember));


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
        <div className="border rounded-md px-2 pb-2">
            <div
                className="w-full text-center pt-3 font-medium rounded-md"
                style={{fontSize:`24px`}}
            >
            {project.title}
            </div>
            <div
                className="w-full text-center mb-2"
                style={{fontSize:`13px`}}
            >
            본인을 선택 후 참여해주세요.
            </div>
            <div>
                <div
                    style={{fontSize:`13px`,
                        // fontWeight:"lighter"
                    }}
                >
                    기존 참여자 중 선택
                </div>
                <div
                    className="px-1 pt-1.5 border rounded-md"
                    style={{maxHeight:"200px",overflowY:"scroll"}}
                >
                    {newPayMembers.map((member, idx) => (
                      <div
                        key={idx}
                        index={idx}
                        member={JSON.stringify(member)}
                        className="flex justify-between min-w-fit  p-1.5 mb-2 border-none rounded-lg bg-white whitespace-nowrap overflow-hidden"
                        style={
                            member.user ?
                            {backgroundColor:"lightgrey",} :
                            selectedMember.member_id && selectedMember.member_id === member.member_id ?
                                {backgroundColor:"#D0DA59", border:"1px solid lightgrey"} :
                                {backgroundColor:"white", border:"1px solid lightgrey"}
                        }
                          onClick={onSelectMember}
                      >
                         <div>{member.username}</div>
                          {
                              member.user ?
                                  <div className="font-normal text-white pr-3">참여완료</div> :
                                  <div>
                                          <FiCheck
                                    className="text-white pr-3"
                                    size="26"
                                    // onClick={onEdit}
                                    />

                                  </div>


                          }

                      </div>
                    ))}
                </div>
                <div
                    className="pt-1"
                    style={{fontSize:`13px`,
                        // fontWeight:"lighter"
                    }}
                >
                    새로운 참여자로 선택
                </div>
                <div className="px-1 pt-1.5 border rounded-md">
                <div
                    // key={idx}
                    // index={idx}
                    member={JSON.stringify({username:newMemberName})}
                    className="flex justify-between min-w-fit h-full p-1.5 mb-2 border rounded-lg bg-white whitespace-nowrap overflow-hidden"
                    style={
                        selectedMember.member_id ?
                        {backgroundColor:"white", border:"1px solid lightgrey"} :
                        {backgroundColor:"#D0DA59", border:"1px solid lightgrey"}
                    }
                    onClick={onSelectMember}
                >
                    <div>
                        <Input
                        title=""
                        labelClass="text-md tracking-tight"
                        inputClass=" bg-nonefont-notosans text-base text-black  placeholder:lightgray"
                        htmlFor="member"
                        styleClass={{background:"none",border:"none",textDecoration:"underline"}}
                        member_id={""}
                        value={user.k_name}
                        onChange={setNewMemberName}
                        />
                    </div>
                    <div>
                    <FiCheck
                    className="text-white pr-3"
                    size="26"
                    // onClick={onEdit}
                    />
                    </div>
                  </div>
                </div>
            </div>
        </div>
        <br/>

      <Button
        className="w-full h-12 mb-3 border-none rounded-md bg-lime font-notosans text-base text-white"
        type="button"
        onClick={onJoinComplete}
      >
          <span className="text-black">{selectedMember.username}</span> 으로 참여
      </Button>
      {/*  <Button*/}

    </form>
  );
};

export default ProjJoinModal;
