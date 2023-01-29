import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash } from "react-icons/fi";
import axios from "axios";
import moment from "moment";

import UserProfile from "./UserProfile";
import { API } from "../config";

const Project = ({ userInfo, projectInfo }) => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    axios
      .get(`${API.MEMBERS}/${projectInfo.project_id}`)
      .then((res) => setMembers(res.data));
  }, [projectInfo.project_id]);

  const handleProjectClick = () => {
    axios.get(`${API.MEMBERS}/${projectInfo.project_id}`).then((res) => {
      for (let member of res.data) {
        if (userInfo.id === member.user) {
          navigate(`${projectInfo.project_id}`, {
            state: {
              userInfo: userInfo,
              memberId: member.member_id,
              member: member,
              projectInfo: projectInfo,
            },
          });
        }
      }
    });
  };

  const ProjectDeleteClick = () => {
    axios.delete(`${API.PROJECT}/${projectInfo.project_id}`).then((res) => {
      if (res.status === 200) {
        window.location.reload();
      }
    });

    // if(alert(title+"을 삭제하시겠습니까?")){
    //   console.log('api call');
    // }
  };

  let member_disp = "";
  let etc_cnt = 0;
  for (let i in members) {
    if (member_disp.length < 10) {
      if (member_disp.length !== 0) {
        member_disp += ", ";
      }
      member_disp += `${members[i].username}`;
    } else {
      etc_cnt += 1;
    }
  }
  if (etc_cnt > 0) {
    member_disp += ` 외 ${etc_cnt}명`;
  }

  const statusSticker = projectInfo.status ? (
    <div className="absolute right-3 flex justify-center items-center h-6 px-1 rounded border-2 border-green text-green">
      완료
    </div>
  ) : (
    <div className="absolute right-3 flex justify-center items-center h-6 px-1 rounded border-2 border-red text-red">
      진행중
    </div>
  );

  const title =
    projectInfo.title.trim().length > 7
      ? projectInfo.title.substring(0, 6) + "⋯"
      : projectInfo.title;

  return (
    <div
      className="relative min-w-[90%] w-11/12 mx-2 py-3 px-4 rounded-md bg-white shadow cursor-pointer"
      onClick={handleProjectClick}
    >
      {statusSticker}
      <div>
        <h1 className="mt-2 mb-3 font-scoredream text-[28px] font-medium whitespace-nowrap overflow-hidden">
          {title}
        </h1>
        <div className="flex items-center">
          <UserProfile />
          <span className="ml-2 text-sm">{member_disp}</span>
        </div>
      </div>
      <hr className="w-full my-2 border border-solid border-gray" />
      <div className="flex justify-start text-xs text-darkgray">
        날짜: {moment(projectInfo.event_dt).format("YYYY-MM-DD")}
      </div>
      <button
        className="absolute right-5 bottom-3"
        onClick={ProjectDeleteClick}
      >
        <FiTrash size="12" color="red" />
      </button>
      {/*<div className="flex justify-end text-xs text-darkgray">*/}
      {/*  정산 마감 기한: {moment(projectInfo.end_dt).format("YYYY-MM-DD")}*/}
      {/*</div>*/}
    </div>
  );
};

export default Project;
