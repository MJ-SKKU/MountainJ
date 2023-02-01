import { useEffect, useState } from "react";
import { FiChevronDown, FiEdit, FiTrash } from "react-icons/fi";
import axios from "axios";

import UserProfile from "../UI/UserProfile";
import PayEditModal from "../Modal/PayEditModal";
import Modal from "../Modal/Modal";
import Price from "../UI/Price";
import { API } from "../../config";

const Pay = (props) => {
  const originalPayMembers = props.payMembers;
  const originalPayMemberIds = props.payMemberIds;
  const payerId = props.payer_id;
  const payId = props.pay.pay_id;

  const [payMembers, setPayMembers] = useState(originalPayMembers);
  const [isAccordionFolded, setIsAccordionFolded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  let payerName = "";
  for (let id of originalPayMemberIds) {
    if (id === payerId) {
      payerName = originalPayMembers[id - originalPayMemberIds[0]];
      break;
    }
  }

  useEffect(() => {
    axios.get(`${API.PAYMEMBERS}/${payId}`).then((res) => {
      let memberList = [];
      for (let member of res.data) {
        memberList.push(member.username);
      }
      setPayMembers(memberList);
    });
  }, [payId]);

  const onClickAccordionIcon = () => {
    setIsAccordionFolded((prevState) => {
      return !prevState;
    });
  };

  const PayDeleteClick = () => {
    axios.delete(`${API.PAY}/${payId}`).then((res) => {
      window.location.reload();
    });
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
        onClick={onClickAccordionIcon}
      >
        <UserProfile username={payerName} />
        <div className="flex flex-col justify-evenly items-center">
          <Price price={props.price} />
          <span>{props.title}</span>
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
            {payMembers.map((member, idx) => {
              return <UserProfile key={idx} username={member} />;
            })}
          </div>
          <hr />
          <div className="flex justify-between px-4 py-2">
            <FiEdit size="16" onClick={onModalClick} />
            <FiTrash size="16" onClick={PayDeleteClick} />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal title="결제 내역 추가" onClose={onModalClick}>
          <PayEditModal
            pay={props.pay}
            payMembers={originalPayMembers}
            setIsModalOpen={setIsModalOpen}
            originalPayMemberIds={originalPayMemberIds}
            projectId={props.projectId}
          />
        </Modal>
      )}
    </div>
  );
};

export default Pay;