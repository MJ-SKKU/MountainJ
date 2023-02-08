import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiTrash } from "react-icons/fi";
import axios from "axios";
import moment from "moment";

import UserProfile from "../UI/UserProfile";
import { projectActions } from "../../store/ProjectInfo";
import { API } from "../../config";

const Project = (props) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const project_id = props.projectInfo.project_id;

  const [members, setMembers] = useState([]);

  useEffect(() => {
    console.log("project_id");
    console.log(project_id);
    const memberGetCall = async () => {
      try {
        const res = await axios.get(`${API.MEMBERS}/${project_id}`);
        const data = res.data;

        let memList = [];
        for (let idx in data) {
          memList.push(data[idx].username);
        }
        setMembers(memList);
      } catch {
        // alert("Project.js: 초기화 실패 . . .");
      }
    };
    memberGetCall();
  }, [project_id]);

  const onClick = () => {
    dispatch(projectActions.setProject(props.projectInfo));
    navigate(`${project_id}`);
  };

  const ProjectDeleteClick = async () => {
    try {
      await axios.delete(`${API.PROJECT}/${project_id}`);
      window.location.reload();
    } catch {
      alert("프로젝트 삭제에 실패하였습니다.");
    }
  };

  let member_disp = "";
  let etcCount = 0;
  for (let idx in members) {
    if (member_disp.length < 10) {
      if (member_disp.length !== 0) {
        member_disp += ", ";
      }
      member_disp += `${members[idx]}`;
    } else {
      etcCount += 1;
    }
  }
  if (etcCount > 0) {
    member_disp += ` 외 ${etcCount}명`;
  }

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
          <UserProfile />
          <span className="ml-2 text-sm">{member_disp}</span>
        </div>
        <hr className="w-full my-1.5 border border-solid border-gray" />
        <div className="flex justify-start mt-2.5 text-xs text-darkgray">
          정산 마감 기한:{" "}
          {moment(props.projectInfo.end_dt).format("YYYY-MM-DD")}
        </div>
      </div>
      <button
        className="absolute right-5 bottom-4 text-red"
        onClick={ProjectDeleteClick}
      >
        <FiTrash size="12" />
      </button>
    </div>
  );
};

export default Project;
