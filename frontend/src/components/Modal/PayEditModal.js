import { useState, Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { paysActions } from "../../store/Pays";
import { payActions } from "../../store/PayInfo";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { API } from "../../config";

const PayEditModal = (props) => {
  const originalPayInfo = props.pay;
  const originalPayMembers = props.payMembers;
  const originalPayer = props.payer;

  const dispatch = useDispatch();
  dispatch(payActions.setPay(originalPayInfo));

  const project = useSelector((state) => state.projectReducer);
  const members = useSelector((state) => state.membersReducer.memObjects); // 이때 members는 해당 프로젝트 전체 인원

  const [title, setTitle] = useState(originalPayInfo.title);
  const [price, setPrice] = useState(originalPayInfo.money);

  const [newMemberName, setNewMemberName] = useState("");
  const [payMembers, setPayMembers] = useState(originalPayMembers);
  const [Members, setMembers] = useState([...members]);


  let payer = {member_id: originalPayInfo.payer};
  const onSelectPayer = (e) => {
    payer = originalPayer;
    if (isNaN(parseInt(e.target.value))) {
      payer = { username: e.target.value };
    }
    else {
      payer = {member_id: e.target.value}
    }
  };

  const onAddMember = () => {
    if (newMemberName.trim().length > 0) {
      const enteredNewMember = { username: newMemberName };
      setPayMembers([...payMembers, enteredNewMember]);
      setMembers([...Members, enteredNewMember]);
    }
    setNewMemberName("");
  };

  const onDeleteMember = (e) => {
    e.preventDefault();

    let idx = e.target.getAttribute("index");
    let name_li = [...payMembers];
    name_li.splice(idx, 1);

    setPayMembers(name_li);
  };

  const onPayEdit = async () => {
    if (title === "" || price === "") {
      alert("내역명을 반드시 입력해주세요");
      return;
    }

    let newPayState = {
      payer,
      title,
      money: price,
      event_dt: project.event_dt,
      paymembers: payMembers,
    };

    const edittedPayFormData = new FormData();
    for (let key in newPayState) {
      if (key !== "paymembers" && key !== "payer")
        edittedPayFormData.append(key, newPayState[key]);
      else edittedPayFormData.append(key, JSON.stringify(newPayState[key]));
    }

    try {
      await axios.patch(`${API.PAY}/${props.pay.pay_id}`, edittedPayFormData);
      const paysRes = await axios.get(`${API.PAYS}/${project.project_id}`);
      console.log(paysRes);
      dispatch(paysActions.loadPays(paysRes.data));
      const membersRes = await axios.get(`${API.MEMBERS}/${project.project_id}`);
      console.log(membersRes);
      setMembers([...membersRes]);

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
            onChange={onSelectPayer}
            defaultValue={originalPayer.member_id}
          >
            {Members.map((member, idx) => (
              <option data-idx={idx} value={member.member_id}>
                {member.username}
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
          value={newMemberName}
          onChange={setNewMemberName}
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
              {member.username}
            </span>
          ))}
        </div>
        <Button
          className="w-full h-12 border-none rounded-md bg-lime font-notosans text-base"
          type="button"
          onClick={onPayEdit}
        >
          수정 완료
        </Button>
      </form>
    </Fragment>
  );
};

export default PayEditModal;
