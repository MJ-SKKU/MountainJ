import { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Input from "../UI/Input";
import Button from "../UI/Button";
import { API } from "../../config";

const PayEditModal = (props) => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const originalPayInfo = props.pay;
  const originalPayMemberIds = props.originalPayMemberIds;
  const project_id = props.projectId;

  const [title, setTitle] = useState(originalPayInfo.title);
  const [price, setPrice] = useState(originalPayInfo.money);
  const [newMember, setNewMember] = useState("");
  const [payMembers, setPayMembers] = useState(props.payMembers);

  let newPayState = { ...originalPayInfo };
  let payerName = "";
  for (let idx in payMembers) {
    if (originalPayMemberIds[0] + idx === originalPayInfo.payer) {
      payerName = payMembers[idx];
    }
  }

  const onSelectPayer = (e) => {
    payerName = e.target.value;
  };

  const onAddMember = () => {
    const enteredNewMember = newMember;
    if (enteredNewMember.trim().length > 0) {
      setPayMembers([...payMembers, enteredNewMember]);
    }
    setNewMember("");

    try {
      let payMemberIds = [...originalPayMemberIds];

      const edittedPayFormData = new FormData();
      edittedPayFormData.append("pay_id", originalPayInfo.pay_id);
      edittedPayFormData.append("member_id", originalPayMemberIds);
      // const res = axios.patch(`${API.PAYMEMBERS}/${originalPayInfo.pay_id}`);
    } catch {
      alert("참여자 추가에 실패하였습니다.");
    }
  };

  const onDeleteMember = (e) => {
    e.preventDefault();

    let idx = e.target.getAttribute("index");
    let name_li = [...payMembers];
    name_li.splice(idx, 1);

    setPayMembers(name_li);
  };

  // const handleChangePay = (e) => {
  //   let key, value;
  //   key = e.target.name;
  //   value = e.target.value;

  //   if (e.target.name === "payer") {
  //     value = JSON.parse(e.target.value);
  //   }

  //   let obj = {
  //     ...newPay,
  //     [key]: value,
  //   };

  //   newPay = { ...obj };

  //   if (e.target.name === "payer") {
  //     console.dir(e.target.options.selectedIndex);
  //     let k = e.target.options.selectedIndex;
  //     // 에러나는데 되서 그냥 씀
  //     e.target.options.selectedIndex(k);
  //   }
  // };
  const onPayEdit = async (e) => {
    e.preventDefault();

    if (title === "") {
      alert("내역명을 반드시 입력해주세요");
      return;
    }

    newPayState = {
      money: price,
      pay_id: originalPayInfo.pay_id,
      payer: originalPayInfo.payer,
      project: originalPayInfo.project,
      title,
      payMembers,
    };

    const newPayFormData = new FormData();
    for (let key in newPayState) {
      if (key !== "payMembers") newPayFormData.append(key, newPayState[key]);
      else newPayFormData.append(key, JSON.stringify(newPayState[key]));
    }

    try {
      const res = await axios.patch(
        `${API.PAY}/${props.pay.pay_id}`,
        newPayFormData
      );
      // `${project_id}`
      // navigate("/", {
      //   state: {
      //     userInfo,
      //     // projectInfo,
      //     members: payMembers,
      //     memberIds: originalPayMemberIds,
      //   },
      // });
      navigate(-1);

      // const projectInfo = res.data.project;
      // setProjectInfo(res.data.project);
      // setMembers(res.data.members);
      // axios
      // .get(`${API.PAYS}/${projectInfo.project_id}`)
      // .then((res) => setPays(res.data));
    } catch {
      alert("결제내역 수정 실패");
    }

    props.setIsModalOpen(false);
  };

  return (
    <Fragment>
      <form className="flex flex-col w-full mb-5">
        <div className="mb-4">
          <label htmlFor="payer" className="text-md tracking-tight">
            결제자<span className="pl-0.5 text-red">*</span>
          </label>
          <select
            id="payer"
            className="w-full h-12 mt-0.5 px-2 border border-gray rounded font-notosans text-base tracking-tight focus:outline-1 focus:outline-lime"
            defaultValue={payerName}
            onChange={onSelectPayer}
          >
            {payMembers.map((member, idx) => (
              <option key={idx} value={member}>
                {member}
              </option>
            ))}
          </select>
        </div>
        <Input
          title="내역명*"
          divClass="mb-4"
          labelClass="text-md tracking-tight"
          inputClass="w-full h-12 mt-0.5 px-3 border border-gray rounded font-notosans text-base tracking-tight focus:outline-1 focus:outline-lime"
          htmlFor="title"
          value={title}
          onChange={setTitle}
        />
        <Input
          title="금액*"
          divClass="mb-4"
          labelClass="text-md tracking-tight"
          inputClass="w-full h-12 mt-0.5 px-3 border border-gray rounded font-notosans text-base tracking-tight focus:outline-1 focus:outline-lime"
          htmlFor="money"
          value={price}
          onChange={setPrice}
        />
        <Input
          title="참여자"
          divClass="mb-2"
          labelClass="text-md tracking-tight"
          inputClass="w-full h-12 px-3 border border-gray rounded font-notosans text-base tracking-tight focus:outline-1 focus:outline-lime"
          htmlFor="member"
          value={newMember}
          onChange={setNewMember}
        />
        <Button
          className="w-full h-10 mb-2 rounded bg-lime text-white"
          type="button"
          onClick={onAddMember}
        >
          참여자 추가
        </Button>
        <div className="flex items-center w-full h-14 mb-6 px-2 border border-lightgray rounded-md bg-lightgray overflow-x-scroll">
          {payMembers.map((member, idx) => (
            <span
              key={idx}
              index={idx}
              className="min-w-content mr-2 p-1.5 px-2 border-none rounded-lg bg-white text-center whitespace-nowrap"
              onClick={onDeleteMember}
            >
              {member}
            </span>
          ))}
        </div>
        <Button
          className="w-full h-12 border-none rounded-md bg-lime font-notosans text-base"
          type="submit"
          onClick={onPayEdit}
        >
          수정 완료
        </Button>
      </form>
    </Fragment>
  );
};

export default PayEditModal;
