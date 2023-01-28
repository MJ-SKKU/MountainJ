import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import UserProfile from "./UserProfile";
import { API } from "../config";
import {FiTrash} from "react-icons/fi";

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

  const ProjectDeleteClick = (e) => {
      console.log(projectInfo.project_id);

    axios.delete(`${API.PROJECT}/${projectInfo.project_id}`).then((res) => {
      if(res.status==200){
        window.location.reload();
      }
    });

    // if(alert(title+"을 삭제하시겠습니까?")){
    //   console.log('api call');
    // }
  };

  var member_disp = "";
  var etc_cnt = 0;
  for (var i in members) {
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

  return (
    <div
      className="w-11/12 mx-2 py-3 px-4 rounded-md bg-white shadow cursor-pointer"
      style={{ minWidth: "90%" }}
      // onClick={handleProjectClick}
    >
      <div onClick={handleProjectClick}>
        <div className="flex justify-between">
          <span className="ml-0.5 text-sm">{projectInfo.date}</span>
          {projectInfo.status ? (
            <div className="flex justify-center items-center h-6 px-1 rounded border-2 border-red text-red">
              완료
            </div>
          ) : (
            <div className="flex justify-center items-center h-6 px-1 rounded border-2 border-green text-green">
              진행중
            </div>
          )}
        </div>
        <h1 className="mb-3 font-scoredream text-3xl font-medium whitespace-nowrap overflow-hidden">
          {projectInfo.title}
        </h1>
        <div className="flex items-end" >
          <UserProfile />
          <span className="ml-1 text-sm">{member_disp}</span>
        </div>
      </div>

      <hr className="w-full my-1 border border-solid border-gray" />
      <div className="flex justify-end text-xs text-darkgray">
       날짜: {moment(projectInfo.event_dt).format("YYYY-MM-DD")}
       <div className="flex gap-2 ml-auto mr-2">
          {/*<FiEdit size="12" onClick={PayEditClick} />*/}
          <button title={projectInfo.title} project_id={projectInfo.project_id} onClick={ProjectDeleteClick}>
            <FiTrash size="12" />
          </button>
        </div>
      </div>
      {/*<div className="flex justify-end text-xs text-darkgray">*/}
      {/*  정산 마감 기한: {moment(projectInfo.end_dt).format("YYYY-MM-DD")}*/}
      {/*</div>*/}
    </div>
  );
};

export default Project;
