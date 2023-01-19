import React from "react";
import { FiChevronDown } from "react-icons/fi";
import UserProfile from "./UserProfile";

const Pay = ({ username, money, title, paymember }) => {
  const MemberListDropDownIconClick = () => {
    alert("todo: 결제 내역 참여자 드롭다운");
  };

  return (
    <div className="flex justify-between items-center w-11/12 mx-auto mb-3 pt-3 px-5 pb-2.5 border-none rounded-md bg-white shadow">
      <UserProfile username="todo결제자" />
      <div className="flex flex-col justify-evenly items-center">
        <span className="text-lg font-semibold">{money}원</span>
        <span>{title}</span>
      </div>
      <FiChevronDown size="24" onClick={MemberListDropDownIconClick} />
    </div>
  );
};

export default Pay;
