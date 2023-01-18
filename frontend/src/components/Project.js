import React from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "./UserProfile";

const Project = ({ userName, projectId, date, isComplete, title, ownername, memberCount, endDate }) => {
  const navigate = useNavigate();

  const handleProjectClick = () => {
    navigate("projectid", { state: { userName: userName, projectId: projectId } });
  };

  return (
    <div className="w-11/12 mx-2 py-3 px-4 rounded-md bg-white shadow" style={{ minWidth: "90%" }} onClick={handleProjectClick}>
      <div className="flex justify-between">
        <span className="ml-0.5 text-sm">{date}</span>
        {isComplete ? (
          <div className="flex justify-center items-center h-6 px-1 rounded border-2 border-red text-red">완료</div>
        ) : (
          <div className="flex justify-center items-center h-6 px-1 rounded border-2 border-green text-green">진행중</div>
        )}
      </div>
      <h1 className="mb-3 font-scoredream text-3xl font-medium whitespace-nowrap overflow-hidden">{title}</h1>
      <div className="flex items-end">
        {/* @@todo 이미지 src 정산 생성자(owner) 카카오톡 프로필 이미지로 변경 */}
        <UserProfile />
        <span className="ml-1 text-sm">
          {ownername} 외 {memberCount}명
        </span>
      </div>
      <hr className="w-full my-1 border border-solid border-gray" />
      <div className="flex justify-end">
        <span className="text-xs text-darkgray">입력 마감 기한: {endDate}</span>
      </div>
    </div>
  );
};

export default Project;
