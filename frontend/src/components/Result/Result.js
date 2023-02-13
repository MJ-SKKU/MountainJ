import { FiArrowRight } from "react-icons/fi";

import UserProfile from "../UI/UserProfile";
import Price from "../UI/Price";

const Result = (props) => {
  return (
    <div className="flex justify-between items-center w-11/12 mx-auto mb-3 pt-3 px-5 pb-2.5 border-none rounded-md bg-white shadow">
      <UserProfile  username={props.username} />
      <div className="flex flex-col justify-evenly items-center">
        <FiArrowRight />
        <Price price={props.money} />
      </div>
      <UserProfile username={props.payer} />
    </div>
  );
};

export default Result;
