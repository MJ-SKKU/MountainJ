import { useState } from "react";
import { useSelector } from "react-redux";
import { FiChevronDown, FiEdit, FiTrash } from "react-icons/fi";
import axios from "axios";

import { API } from "../../config";
import UserProfile from "../UI/UserProfile";
import PayEditModal from "../Modal/PayEditModal";
import Modal from "../Modal/Modal";
import Price from "../UI/Price";

const Pay = (props) => {
  const members = useSelector((state) => state.membersReducer.memObjects);

  const pay = props.pay;

  const [isAccordionFolded, setIsAccordionFolded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  let memberNames = [];
  let memberIds = [];
  for (let member of members) {
    memberNames.push(member.username);
    memberIds.push(member.member_id);
  }

  let payerName = "";
  for (let idx in memberIds) {
    if (memberIds[idx] === pay.payer) {
      payerName = memberNames[idx];
      break;
    }
  }

  const onAccordionIconClick = () => {
    setIsAccordionFolded((prevState) => {
      return !prevState;
    });
  };

  const onPayDelete = async () => {
    await axios.delete(`${API.PAY}/${pay.pay_id}`);
    window.location.reload();
  };

  const onModalClick = () => {
    setIsModalOpen((prevState) => {
      return !prevState;
    });
  };

  return (
    <div className="flex flex-col mb-3">
      <div
        className="flex justify-between mx-auto items-center w-11/12 pt-3 px-5 pb-2.5 border-none rounded-md bg-white shadow z-10"
        onClick={onAccordionIconClick}
      >
        <UserProfile username={payerName} />
        <div className="flex flex-col justify-evenly items-center">
          <Price price={props.pay.money} />
          <span>{props.pay.title}</span>
        </div>
        <FiChevronDown
          size="24"
          className={`transition-transform transform duration-300 ${
            isAccordionFolded ? "" : "-rotate-180"
          }`}
        />
      </div>
      <div
        className={`${
          isAccordionFolded ? "h-0" : "h-32"
        } transition-all duration-300 overflow-y-hidden`}
      >
        <div className="flex flex-col justify-center mx-auto -mt-1 w-11/12 bg-white shadow rounded-md">
          <div className="gap-3 flex justify-evenly w-full mx-auto items-center mt-5 px-5 pb-2.5 overflow-x-scroll scrollbar-hide">
            {memberNames.map((member, idx) => {
              return <UserProfile key={idx} username={member} />;
            })}
          </div>
          <hr />
          <div className="flex justify-between px-4 py-2">
            <FiEdit size="16" onClick={onModalClick} />
            <FiTrash size="16" onClick={onPayDelete} />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal title="결제 내역 수정" onClose={onModalClick}>
          <PayEditModal
            pay={props.pay}
            payMemberNames={memberNames}
            setIsModalOpen={setIsModalOpen}
          />
        </Modal>
      )}
    </div>
  );
};

export default Pay;
