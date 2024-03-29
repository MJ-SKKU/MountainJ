import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiTrash } from "react-icons/fi";
import axios from "axios";
import moment from "moment";

import { projectActions } from "../../store/ProjectInfo";
import { projectsActions } from "../../store/Projects";
import { API } from "../../config";
import UserProfile from "../UI/UserProfile";

const Project = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const project_id = props.projectInfo.project_id;
  const projectInfo = props.projectInfo;
  const user = props.user;

  const [memberDisplay, setMemberDisplay] = useState("");

  useEffect(() => {
    const memberGetCall = async () => {
      // try {
      const res = await axios.get(`${API.MEMBERS}/${project_id}`);
      const data = res.data;
      let memList = [];
      for (let idx in data) {
        memList.push(data[idx].username);
      }
      let member_disp = "";
      let etcCount = 0;
      for (let idx in memList) {
        if (member_disp.length < 10) {
          if (member_disp.length !== 0) {
            member_disp += ", ";
          }
          member_disp += `${memList[idx]}`;
        } else {
          etcCount += 1;
        }
      }
      if (etcCount > 0) {
        member_disp += ` 외 ${etcCount}명`;
      }
      setMemberDisplay(member_disp);
      //console.log(member_disp)
      // } catch {
      //console.log('hih')
      // alert("Project.js: 초기화 실패 . . .");
      // }
    };
    memberGetCall();
  }, [project_id]);

  const onClick = () => {
    dispatch(projectActions.setProject(props.projectInfo));
    navigate(`${project_id}`);
  };

  const ProjectDeleteClick = async (e) => {
    const title = e.currentTarget.title;
    if (projectInfo.owner !== user.id) {
      alert("정산을 생성한 유저만 삭제가능합니다.");
      return;
    }
    if (window.confirm(`"${title}"을 삭제하시겠습니까?`)) {
      const res = await axios.delete(`${API.PROJECT}/${project_id}`);
      if (res.status === 200) {
        dispatch(projectsActions.needUpdate());
        console.log("정산 삭제 성공.");
      } else {
        console.log("정산 삭제에 실패");
      }
    }
  };

  const statusSticker = props.projectInfo.status ? (
    <div className="absolute right-2 top-2 flex justify-center items-center h-6 px-1 rounded border-2 border-green text-green">
      완료
    </div>
  ) : (
    <div className="absolute right-2 top-2 flex justify-center items-center h-6 px-1 rounded border-2 border-red text-red">
      진행중
    </div>
  );

  const title =
    props.projectInfo.title.trim().length > 7
      ? props.projectInfo.title.substring(0, 6) + " ⋯"
      : props.projectInfo.title;

  return (
    <div className="relative min-w-[90%] w-11/12 mx-2 py-3 px-4 rounded-md bg-white shadow cursor-pointer">
      {statusSticker}
      <div onClick={onClick}>
        <h1 className="mt-1.5 mb-3 font-scoredream text-[28px] font-medium whitespace-nowrap overflow-hidden">
          {title}
        </h1>
        <div className="flex items-center">
          <UserProfile user_id={projectInfo.owner} />
          <span className="ml-2 text-sm">{memberDisplay}</span>
        </div>
        <hr className="w-full my-1.5 border border-solid border-gray" />
        <div className="flex justify-start mt-2.5 text-xs text-darkgray">
          {/*:{" "}*/}
          {moment(props.projectInfo.event_dt).format("YYYY-MM-DD")}
        </div>
      </div>
      <button
        className="absolute right-5 bottom-4 "
        title={props.projectInfo.title}
        onClick={ProjectDeleteClick}
      >
        <FiTrash size="12" />
      </button>
    </div>
  );
};

export default Project;
