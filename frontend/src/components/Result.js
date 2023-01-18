import React from "react";
import UserProfile from "./UserProfile";

const Result = ({ username, money, title, payer }) => {
  return (
    <div className="flex justify-between items-center w-11/12 mx-auto mb-3 pt-3 px-5 pb-2.5 border-none rounded-md bg-white shadow">
      {/* @@todo 결제자 이름 */}
      <UserProfile username={username} />
      <div className="flex flex-col justify-evenly items-center">
        <span className="text-lg font-semibold">{money}원</span>
        <span>{title}</span>
      </div>
      {/* @@todo 결제내역 참여자 드롭다운 */}
      <UserProfile username={payer} />
    </div>
  );
};

export default Result;
