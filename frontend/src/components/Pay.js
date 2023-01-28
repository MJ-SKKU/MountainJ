import React, { useEffect, useState } from "react";
import { FiChevronDown, FiEdit, FiTrash } from "react-icons/fi";
import UserProfile from "./UserProfile";
import axios from "axios";
import { API } from "../config";
import {IoCloseOutline} from "react-icons/io5";
import {useLocation} from "react-router-dom";

const Pay = ({ members, payer_id, money, title, pay_id }) => {


  const location = useLocation();
  const project_id = location.pathname.split("/").slice(-1)[0];


  const [paymembers, setPayMembers] = useState([]);
  const [accordionFolded, setAccordion] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newMemberName, setNewMemberName] = useState("");

  const handleChangeNewMemberName = (e) => {
    setNewMemberName(e.target.value);
  };
  const handleAddPayMemberClick = () => {
    if (newMemberName === "") {
      alert("이름을 입력해주세요.");
    } else {
      let newMember = {
        project: project_id,
        username: newMemberName,
      };
      // paymembers.push(newMember);
      setPayMembers([...paymembers, newMember])
      setNewMemberName("");
    }
    let e = { target: { name: "pay_member", value: paymembers } };
    handleChangeTempPay(e);
  };



  const handleEditClick = async (e) => {

    e.preventDefault();

    console.log('수정 완료하기');
    console.log(paymembers);

    // if (tempPayInfo.title === "" || tempProjectInfo.end_dt === "") {
    if (tempPayInfo.title === "") {
      alert("내역명을 입력해주세요");
      return 0;
    }

    // tempProjectInfo.name_li = projectMemberList; // 참여자 입력 받은 memberList 배열  newProject.name_li 에 넣기
    const newPayFormData = new FormData();
    for (let key in tempPayInfo) {
      // if (key === "paymembers")
      //   newPayFormData.append(key, JSON.stringify(tempPayInfo[key]));
      // else newPayFormData.append(key, tempPayInfo[key]);
      newPayFormData.append(key, tempPayInfo[key]);
    }
    newPayFormData.append("paymembers", JSON.stringify(paymembers));


    axios.patch(`${API.PAY}/${pay_id}`, newPayFormData).then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        console.log('set 하세요.');
        // const projectInfo = res.data.project;
        // setProjectInfo(res.data.project);
        // setMembers(res.data.members);

        // axios
        // .get(`${API.PAYS}/${projectInfo.project_id}`)
        // .then((res) => setPays(res.data));

      } else {
        alert("결제내역 수정 실패");
      }
    });
    setIsModalOpen(false);
  };



  const [payer, setPayer] = useState({});

  const [tempPayInfo, setTempPayInfo] = useState({});
  const [tempPaymembers, setTempPayMembers] = useState([]);


  const handleChangeTempPay = (e) => {
    setTempPayInfo({
      ...tempPayInfo,
      [e.target.name]: e.target.value,
    });
  };

const handleDeletePayMemberClick = (e) => {
    e.preventDefault();
    let index = e.target.getAttribute("index");
    console.log(paymembers[index]);
    console.log(payer.member_id);
    console.log(paymembers[index].member_id);
    if (paymembers[index].member_id === payer.member_id) {
      alert("결제자는 삭제할 수 없습니다.");
      return;
    }
    paymembers.splice(index, 1);
    setPayMembers(paymembers);
    let eve = { target: { name: "pay_member", value: paymembers } };
    handleChangeTempPay(eve);
  };



  useEffect(() => {
    axios
      .get(`${API.PAYMEMBERS}/${pay_id}`)
      .then((res) => setPayMembers([...res.data]));
  }, [pay_id]);

  useEffect(() => {

    axios
      .get(`${API.PAYMEMBERS}/${pay_id}`)
      .then((res) => setPayMembers([...res.data]));
  }, [members]);

  useEffect(() => {
    console.log(tempPaymembers);
  }, [tempPaymembers]);


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
    setTempPayInfo({
      "title": title,
      "payer":payer_id,
      "money":money
    });
    // console.log(payer)
    axios.get(`${API.MEMBER}/${payer_id}`).then((res) => {
        console.log("log");
        console.log(res.data);
        setPayer(res.data);
        setTempPayMembers([...paymembers]);
      setIsModalOpen(true);
    });

  };



  let username;

  for (let member of members) {
    if (member.member_id === payer_id) {
      username = member.username;
    }
  }

  const handleCloseIconClick = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col mb-3">
      <div className="flex justify-between mx-auto items-center w-11/12 pt-3 px-5 pb-2.5 border-none rounded-md bg-white shadow z-10">
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
            {/*<FiEdit size="12" onClick={PayEditClick} />*/}
            <FiTrash size="12" onClick={PayDeleteClick} />
          </div>
        </div>
      </div>



      {isModalOpen && (
        <div className="flex flex-col justify-center items-center fixed inset-0 z-40">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(11, 19, 30, 0.37)" }}
          />
          <div
            className="flex flex-col w-11/12 p-4 rounded-md bg-white z-10"
            style={{ maxWidth: "360px", minHeight: "420px" }}
          >
            <div className="flex justify-end">
              <IoCloseOutline size="24" onClick={handleCloseIconClick} />
            </div>
            <div className="flex flex-col items-center">
              <h1 className="mb-5 text-2xl font-medim">결제내역 추가</h1>
              <form className="flex flex-col w-full mb-5">
                <div className="mb-4">
                  <label className="text-md tracking-tight">
                    결제자<span className="pl-0.5 text-red">*</span>
                  </label>
                  <select
                    className="w-full h-12 mt-0.5 pb-1 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                    name="payer"
                    onChange={handleChangeTempPay}
                    defaultValue={JSON.stringify(payer)}
                  >
                    {tempPaymembers.map((pm, index) => {
                      // console.log(pm);
                      return (
                        <option
                          value={JSON.stringify(pm)}
                        >
                          {pm.username}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="text-md tracking-tight">
                    내역명<span className="pl-0.5 text-red">*</span>
                  </label>
                  <input
                    className="w-full h-12 mt-0.5 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                    name="title"
                    type="text"
                    value={tempPayInfo.title}
                    onChange={handleChangeTempPay}
                  />
                </div>
                <div className="mb-4">
                  <label className="text-md tracking-tight">
                    금액<span className="pl-0.5 text-red">*</span>
                  </label>
                  <input
                    className="w-full h-12 mt-0.5 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                    name="money"
                    type="int"
                    value={tempPayInfo.money}
                    onChange={handleChangeTempPay}
                  />
                </div>
                <div className="mb-2">
                  <label className="text-md tracking-tight">참여자</label>
                  <input
                    className="w-full h-12 mt-0.5 mb-1 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                    name="member"
                    type="text"
                    value={newMemberName}
                    onChange={handleChangeNewMemberName}
                  />
                  <button
                    className="w-full h-10 mb-1 rounded bg-lime text-white기 mt-1"
                    type="button"
                    onClick={handleAddPayMemberClick}
                  >
                    참여자 추가
                  </button>
                </div>

                <div className="flex items-center w-full h-14 mb-4 px-2 border border-lightgray rounded-md bg-lightgray overflow-x-auto">
                  {paymembers.map((member, index) => (
                    <span
                      key={index}
                      className="mr-2 p-1.5 border-none rounded-lg bg-white text-center whitespace-nowrap overflow-hidden"
                      style={{ minWidth: "60px" }}
                    >
                      {member.username}
                      <button
                        className="ml-1 text-danger"
                        index={index}
                        onClick={handleDeletePayMemberClick}
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              </form>
              <button
                className="w-full h-12 mb-3 border-none rounded-md bg-lime font-notosans text-base text-white"
                type="submit"
                onClick={handleEditClick}
              >
                수정 완료 하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>



  );
};

export default Pay;
