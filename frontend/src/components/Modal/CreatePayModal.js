import { useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";

import { membersActions } from "../../store/Members";
import { paysActions } from "../../store/Pays";
import { API } from "../../config";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { resultsActions } from "../../store/Results";
import { IoMdRefresh } from "react-icons/io";

const CreatePayModal = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.userObj);
  const project = useSelector((state) => state.projectReducer);
  const members = useSelector((state) => state.membersReducer.memObjects);

  const [payer, setPayer] = useState(props.defaultpayer);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [payMembers, setPayMembers] = useState(members);

  const [Members, setMembers] = useState([...members]);

  const onRefreshClick = () => {
    console.log("HIhihi");
    setPayMembers(members);
  };

  const onAddMember = () => {
    const enteredNewMemberName = newMemberName;
    if (enteredNewMemberName.trim().length > 0) {
      const enteredNewMember = { username: enteredNewMemberName };
      setPayMembers([...payMembers, enteredNewMember]);
      setMembers([...Members, enteredNewMember]);
    }

    setNewMemberName("");
  };

  const onChangePrice = (e) => {
    // console.log(e);
    var regex = /[^0-9]/g;
    const input = e;
    let result;
    //숫자 아닌 것 제
    result = input.replace(regex,"");
    // if(result.length > 12){
    //   alert("100억 이상은 입력이 불가능합니다.");
    // }
    result = result.slice(0,10);
    // , 넣기
    result= result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setPrice(result);
  };

  const onDeleteMember = (e) => {
    e.preventDefault();

    let idx = e.target.getAttribute("index");
    let name_li = [...payMembers];
    name_li.splice(idx, 1);

    setPayMembers(name_li);
  };

  const onPayerSelect = (e) => {
    const username = payMembers[e.target.options.selectedIndex].username;

    let newPayer;

    if (isNaN(parseInt(e.target.value))) {
      newPayer = { username };
    } else {
      newPayer = { member_id: e.target.value };
    }
    console.log(newPayer);

    setPayer(newPayer);
  };

  const onPayGenerate = async () => {
    let newPay = {
      project: project.project_id,
      payer,
      title,
      money: price.replace(/[^0-9]/g,""),
      event_dt: moment().format("YYYY-MM-DD"),
      pay_member: payMembers,
    };

    if (newPay.money === "") {
      alert("금액을 입력해주세요");
      return;
    } else if (isNaN(newPay.money.replaceAll(",", ""))) {
      alert("금액은 숫자만 입력가능합니다.");
      return;
    }
    if (payMembers.length === 0) {
      alert("참여자가 1명 이상이어야합니다.");
      return;
    }

    if (newPay.title === "") {
      newPay.title = moment().lang("ko").format("내역 HHMM").toString();
    }

    const result = newPay.money.replaceAll(",", "");
    newPay.money = parseInt(result);

    const newPayFormData = new FormData();
    for (let key in newPay) {
      if (key === "pay_member" || key === "payer") {
        newPayFormData.append(key, JSON.stringify(newPay[key]));
      } else newPayFormData.append(key, newPay[key]);
    }

    try {
      const res = await axios.post(`${API.PAYS}`, newPayFormData);
      dispatch(membersActions.loadMembers(res.data.members));
      dispatch(paysActions.loadPays(res.data.pays));

      axios.get(`${API.RESULTS}/${project.project_id}`).then((res) => {
        dispatch(membersActions.loadMembers(res.data.members));
        dispatch(resultsActions.loadResults(res.data.project_result));
      });
    } catch {
      alert("페이 생성 실패");
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
            onChange={onPayerSelect}
            // lol={payer.member_id}
            defaultValue={payer ? payer.member_id : null}
          >
            {Members.map((member, idx) => (
              <option key={idx} value={member.member_id}>
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
          onChange={onChangePrice}
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
        <div className="flex items-center w-full h-14 mb-6 px-2 border border-lightgray rounded-md bg-lightgray overflow-x-auto">
          {/*<div className="flex justify-between items-center absolute top-0 right-0 z-50">*/}
          <div className="px-3" onClick={onRefreshClick}>
            <IoMdRefresh />
          </div>
          {payMembers.map((member, idx) => (
            <span
              key={idx}
              index={idx}
              member_id={member.member_id}
              username={member.username}
              className="min-w-content mr-2 p-1.5 px-2 border-none rounded-lg bg-white text-center whitespace-nowrap"
              // onClick={onDeleteMember}
              disabled={true}
            >
              {member.username}
              <span
                className="px-1"
                key={idx}
                index={idx}
                member={JSON.stringify(member)}
                onClick={onDeleteMember}
              >
                x
              </span>
            </span>
          ))}
        </div>
        <Button
          className="w-full h-12 border-none rounded-md bg-lime font-notosans text-white"
          type="button"
          onClick={onPayGenerate}
        >
          생성 완료
        </Button>
      </form>
    </Fragment>
  );
};

export default CreatePayModal;
