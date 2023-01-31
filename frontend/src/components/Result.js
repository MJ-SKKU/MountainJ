import { FiArrowRight } from "react-icons/fi";

import UserProfile from "./UserProfile";

const Result = (props) => {
  const moneyScaled = props.money.toLocaleString("en-US");

  return (
    <div className="flex justify-between items-center w-11/12 mx-auto mb-3 pt-3 px-5 pb-2.5 border-none rounded-md bg-white shadow">
      <UserProfile username={props.username} />
      <div className="flex flex-col justify-evenly items-center">
        <FiArrowRight />
        <span className="text-lg font-semibold">{moneyScaled}원</span>
      </div>
      <UserProfile username={props.payer} />
    </div>
  );
};

export default Result;
