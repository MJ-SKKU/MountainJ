import { FiArrowRight } from "react-icons/fi";

import UserProfile from "../UI/UserProfile";
import Price from "../UI/Price";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../config";

const Result = (props) => {
  // console.log(props)

  const [sender, setSender] = useState({});
  const [receiver, setReceiver] = useState({});

  useEffect(() => {
    // console.log(props.sender_id);
    // console.log(props.receiver_id);
    axios.get(`${API.MEMBER}/${props.sender_id}`).then((res) => {
      setSender(res.data);
    }); // const data = res.data;
    axios.get(`${API.MEMBER}/${props.receiver_id}`).then((res) => {
      setReceiver(res.data);
    });
  }, []);

  return (
    <div className="flex justify-between items-center w-11/12 mx-auto mb-3 pt-3 px-2 pb-2.5 border-none rounded-md bg-white shadow">
      <div
        style={{
          border: ``,
          minWidth: `80px`,
          maxWidth: `80px`,
          overflow: `scroll`,
        }}
      >
        <UserProfile
          is_me={props.myName && props.myName == sender.username}
          username={sender.username}
          p={"jkjk"}
          user_id={sender.user}
        />
      </div>
      <div className="flex flex-col justify-evenly items-center">
        <FiArrowRight />
        <Price price={props.money} />
      </div>
      <div
        style={{
          border: ``,
          minWidth: `80px`,
          maxWidth: `80px`,
          overflow: `scroll`,
        }}
      >
        <UserProfile
          is_me={props.myName && props.myName == receiver.username}
          username={receiver.username}
          p={"jkjk"}
          // username={props.payer}
          user_id={receiver.user}
        />
      </div>
    </div>
  );
};

export default Result;
