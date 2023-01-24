import React from "react";
import UserProfile from "./UserProfile";
import { FiArrowRight } from "react-icons/fi";

const Result = ({ username, money, payer }) => {
  return (
    <div className="flex justify-between items-center w-11/12 mx-auto mb-3 pt-3 px-5 pb-2.5 border-none rounded-md bg-white shadow">
      <UserProfile username={username} />
      <div className="flex flex-col justify-evenly items-center">
        <FiArrowRight></FiArrowRight>
        <span className="text-lg font-semibold">{money}원</span>
      </div>
      <UserProfile username={payer} />
    </div>
  );
};

export default Result;
