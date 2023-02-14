import { FiArrowRight } from "react-icons/fi";

import UserProfile from "../UI/UserProfile";
import Price from "../UI/Price";

const Result = (props) => {
  return (
    <div className="flex justify-between items-center w-11/12 mx-auto mb-3 pt-3 px-5 pb-2.5 border-none rounded-md bg-white shadow">
      <div style={{border:``,minWidth:`80px`,maxWidth:`80px`,overflow:`scroll`}}>
        <UserProfile
          is_me={props.myName && props.myName == props.username}
          username={props.username}
          user_id={props.Sender.user}
        />
      </div>
      <div className="flex flex-col justify-evenly items-center">
        <FiArrowRight />
        <Price price={props.money} />
      </div>
        <div style={{border:``,minWidth:`80px`,maxWidth:`80px`,overflow:`scroll`}}>

      <UserProfile
        is_me={props.myName && props.myName == props.payer}
        username={props.payer}
        user_id={props.Sender.user}
      />
      </div>
    </div>
  );
};

export default Result;
