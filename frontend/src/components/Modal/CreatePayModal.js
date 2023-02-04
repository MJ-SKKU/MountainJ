import { useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";

import { paysActions } from "../../store/Pays";
import { API } from "../../config";
import Input from "../UI/Input";
import Button from "../UI/Button";

const CreatePayModal = (props) => {
  const payMemberNames = props.payMemberNames;

  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.userObj);
  const project = useSelector((state) => state.projectReducer);
  const members = useSelector((state) => state.membersReducer.memObjects);

  const [payer, setPayer] = useState(user.k_name);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [payMembers, setPayMembers] = useState(members);

  const onAddMember = () => {
    const enteredNewMemberName = newMemberName;
    if (enteredNewMemberName.trim().length > 0) {
      const newMember = { username: enteredNewMemberName };
      setPayMembers([...payMembers, newMember]);
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

  const onPayGenerate = async () => {
    let newPay = {
      project: project.project_id,
      payer: { username: payer },
      title,
      money: price,
      event_dt: moment().format("YYYY-MM-DD"),
      pay_member: payMembers,
    };

    if (newPay.title === "" || newPay.money === "") {
      alert("결제 내역명과 금액을 입력해주세요");
      return;
    } else if (isNaN(newPay.money.replaceAll(",", ""))) {
      alert("금액은 숫자만 입력가능합니다.");
      return;
    }

    const result = newPay.money.replaceAll(",", "");
    newPay.money = parseInt(result);

    const newPayFormData = new FormData();
    for (let key in newPay) {
      console.log(key);
      console.log(newPay[key], typeof newPay[key]);
      if (key === "pay_member" || key === "payer") {
        newPayFormData.append(key, JSON.stringify(newPay[key]));
      } else newPayFormData.append(key, newPay[key]);
    }

    try {
      const res = await axios.post(`${API.PAYS}`, newPayFormData);
      dispatch(paysActions.loadPays(res.data));
    } catch {
      alert("페이 생성 실패");
    }

    // props.setIsModalOpen(false);
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
            value={payer}
            onChange={setPayer}
          >
            {payMembers.map((member, idx) => (
              <option key={idx} value={member}>
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
          onClick={onPayGenerate}
        >
          추가
        </Button>
      </form>
    </Fragment>
  );
};

export default CreatePayModal;
