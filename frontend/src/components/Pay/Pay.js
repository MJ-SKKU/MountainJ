import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FiChevronDown, FiEdit, FiTrash } from "react-icons/fi";
import axios from "axios";

import { API } from "../../config";
import UserProfile from "../UI/UserProfile";
import PayEditModal from "../Modal/PayEditModal";
import Modal from "../Modal/Modal";
import Price from "../UI/Price";
import { paysActions } from "../../store/Pays";

const Pay = (props) => {
  const dispatch = useDispatch();

  const pay = props.pay;

  // const project=project;

  const [isAccordionFolded, setIsAccordionFolded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [payer, setPayer] = useState({});
  const [payMembers, setPayMembers] = useState([]);

  const [project, setProject] = useState({});

  useEffect(() => {
    axios.get(`${API.PROJECT}/${pay.project}`).then((res) => {
      setProject(res.data);
      console.log("project");
    });
  }, [pay]);

  useEffect(() => {
    const paymembersGetCall = async () => {
      try {
        const res = await axios.get(`${API.PAYMEMBERS}/${pay.pay_id}`); // const data = res.data;
        setPayMembers(res.data);
      } catch {}
    };
    const payerGetCall = async () => {
      try {
        const res = await axios.get(`${API.MEMBER}/${pay.payer}`); // const data = res.data;
        setPayer(res.data);
      } catch {}
    };
    paymembersGetCall();
    payerGetCall();
  }, [pay]);

  const onAccordionIconClick = () => {
    setIsAccordionFolded((prevState) => {
      return !prevState;
    });
  };

  const onPayDelete = async (e) => {
    const title = e.currentTarget.title;
    if (window.confirm(`"${title}"을 삭제하시겠습니까?`)) {
      const res = await axios.delete(`${API.PAY}/${pay.pay_id}`);
      if (res.status === 200) {
        console.log("결제내역 삭제 성공");
        dispatch(paysActions.needUpdate());
      } else {
        console.log("결제내역 삭제 실패");
      }
    }
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
        <UserProfile user_id={payer.user} username={payer.username} />
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
          project.status === 0 && props.userMember !== null
            ? isAccordionFolded
              ? "h-0"
              : "h-32"
            : isAccordionFolded
            ? "h-0"
            : null
        } transition-all duration-300 overflow-y-hidden`}
      >
        <div className="flex flex-col justify-center mx-auto -mt-1 w-11/12 bg-white shadow rounded-md">
          <div className="gap-3 flex justify-evenly w-full mx-auto items-center mt-5 px-5 pb-1 overflow-x-auto scrollbar-hide">
            {payMembers.map((member, idx) => {
              return (
                <UserProfile
                  key={idx}
                  user_id={member.user}
                  username={member.username}
                />
              );
            })}
          </div>
          {project.status === 0 && props.userMember != null && (
            <div>
              <hr />
              <div className="flex justify-between px-4 py-2">
                <button onClick={onModalClick}>
                  <FiEdit size="16" />
                </button>
                <button onClick={onPayDelete} title={props.pay.title}>
                  <FiTrash size="16" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <Modal title="결제 내역 수정" onClose={onModalClick}>
          <PayEditModal
            pay={props.pay}
            payer={payer}
            payMembers={payMembers}
            setIsModalOpen={setIsModalOpen}
          />
        </Modal>
      )}
    </div>
  );
};

export default Pay;
