import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import axios from "axios";

import { API } from "../../config";
import UserProfile from "../UI/UserProfile";
import Price from "../UI/Price";

const Result = (props) => {
  const [sender, setSender] = useState({});
  const [receiver, setReceiver] = useState({});

  useEffect(() => {
    axios.get(`${API.MEMBER}/${props.sender_id}`).then((res) => {
      setSender(res.data);
    }); // const data = res.data;
    axios.get(`${API.MEMBER}/${props.receiver_id}`).then((res) => {
      setReceiver(res.data);
    });
  }, [props]);

  return (
    <div className="flex justify-between items-center w-11/12 mx-auto mb-3 pt-3 px-2 pb-2.5 border-none rounded-md bg-white shadow">
      <div className="min-w-[80px] max-w-[80px] overflow-scroll border-0">
        <UserProfile
          is_me={props.myName && props.myName === sender.username}
          username={sender.username}
          p={"jkjk"}
          user_id={sender.user}
        />
      </div>
      <div className="flex flex-col justify-evenly items-center">
        <FiArrowRight />
        <Price price={props.money} />
      </div>
      <div className="min-w-[80px] max-w-[80px] overflow-scroll border-0">
        <UserProfile
          is_me={props.myName && props.myName === receiver.username}
          username={receiver.username}
          p={"jkjk"}
          user_id={receiver.user}
        />
      </div>
    </div>
  );
};

export default Result;
