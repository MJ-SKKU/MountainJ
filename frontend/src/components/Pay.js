import React, { useEffect, useState } from "react";
import { FiChevronDown, FiEdit, FiTrash } from "react-icons/fi";
import UserProfile from "./UserProfile";
import axios from "axios";
import { API } from "../config";

const Pay = ({ members, payer_id, money, title, pay_id }) => {
  const [paymembers, setPayMembers] = useState([]);
  const [accordionFolded, setAccordion] = useState(true);

  useEffect(() => {
    axios
      .get(`${API.PAYMEMBERS}/${pay_id}`)
      .then((res) => setPayMembers([...res.data]));
  }, [pay_id]);

  const PayListAccordionIconClick = () => {
    setAccordion(!accordionFolded);
  };

  const PayDeleteClick = () => {
    axios.delete(`${API.PAY}/${pay_id}`).then((res) => {
      window.location.reload();
    });
  };

  const PayEditClick = () => {
    console.log("Pay Edit Clicked");
    console.log(pay_id);
  };

  let username;

  for (let member of members) {
    if (member.member_id === payer_id) {
      username = member.username;
    }
  }

  return (
    <div className="flex flex-col mb-3 z-index-n1">
      <div className="z-index-n1 flex justify-between mx-auto items-center w-11/12 pt-3 px-5 pb-2.5 border-none rounded-md bg-white shadow">
        <UserProfile username={username} />
        <div className="flex flex-col justify-evenly items-center">
          <span className="text-lg font-semibold">{money}원</span>
          <span>{title}</span>
        </div>
        <FiChevronDown
          size="24"
          onClick={PayListAccordionIconClick}
          className={`transition-transform transform duration-300 ${
            accordionFolded ? "rotate-180" : ""
          }`}
        />
      </div>
      <div
          className={`${
            accordionFolded ? "h-0" : "h-32"
          } transition-all duration-300 overflow-y-hidden`}
        >
        <div className="flex flex-col mx-auto -mt-1 w-11/12 border bg-white shadow">
          <div className="flex justify-between mx-auto items-center w-full -m-1 pt-4 pl-5 pb-2.5 pr-3 overflow-x-auto">
            <div className="flex pr-3">참여자</div>
            {paymembers.map((member) => {
              return (
                <div key={member.member_id} className="flex">
                  <UserProfile username={member.username} />
                  <div className="mr-5" />
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 ml-auto mr-2 my-2">
            <FiEdit size="12" onClick={PayEditClick} />
            <FiTrash size="12" onClick={PayDeleteClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pay;
