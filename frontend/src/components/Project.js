import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "./UserProfile";
import { API } from "../config";

const Project = ({ userInfo, projectInfo }) => {
  const navigate = useNavigate();

  const handleProjectClick = () => {
    axios.get(`${API.MEMBERS}/${projectInfo.project_id}`).then((res) => {
        for (let member of res.data) {
        if (userInfo.id === member.user) {
          navigate(`${projectInfo.project_id}`, { state: { userInfo: userInfo, memberId: member.member_id, member: member, projectInfo: projectInfo } });
        }
      }
    });
  };

  return (
    <div className="w-11/12 mx-2 py-3 px-4 rounded-md bg-white shadow" style={{ minWidth: "90%" }} onClick={handleProjectClick}>
      <div className="flex justify-between">
        <span className="ml-0.5 text-sm">{projectInfo.date}</span>
        {projectInfo.status ? (
          <div className="flex justify-center items-center h-6 px-1 rounded border-2 border-red text-red">완료</div>
        ) : (
          <div className="flex justify-center items-center h-6 px-1 rounded border-2 border-green text-green">진행중</div>
        )}
      </div>
      <h1 className="mb-3 font-scoredream text-3xl font-medium whitespace-nowrap overflow-hidden">{projectInfo.title}</h1>
      <div className="flex items-end">
        <UserProfile />
        <span className="ml-1 text-sm">{projectInfo.owner} 외 몇 명</span>
      </div>
      <hr className="w-full my-1 border border-solid border-gray" />
      <div className="flex justify-end">
        <span className="text-xs text-darkgray">입력 마감 기한: {projectInfo.enddate}</span>
      </div>
    </div>
  );
};

export default Project;
