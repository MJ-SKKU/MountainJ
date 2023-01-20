import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiShare } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import UserProfile from "../components/UserProfile";
import Pay from "../components/Pay";
import Result from "../components/Result";
import { API } from "../config";

const ProjectPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = location.state.userInfo;
  const projectInfo = location.state.projectInfo;

  const [members, setMembers] = useState([]);
  const [newPay, setNewPay] = useState({ payer: userInfo.id, title: "", money: "", event_dt: "", pay_member: [3, 77, 78] });
  const [pays, setPays] = useState([]);
  const [results, setResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedTabId, setClickedTabId] = useState("0");

  useEffect(() => {
    axios.get(`${API.MEMBERS}/${projectInfo.project_id}`).then((res) => setMembers(res.data));
  }, [projectInfo.project_id]);

  useEffect(() => {
    axios.get(`${API.PAYS}/${projectInfo.project_id}`).then((res) => setPays(res.data));
  }, [projectInfo.project_id]);

  const handleShareIconClick = () => {
    alert("todo: 카카오 공유 API");
  };

  const handleAddPayClick = () => {
    setIsModalOpen(true);
  };

  const handlePayListTabClick = () => {
    setClickedTabId("0");
  };

  const handleResultListTabClick = () => {
    axios.get(`${API.RESULTS}/${projectInfo.project_id}`).then((res) => {});
    setClickedTabId("1");
  };

  const handleCloseIconClick = () => {
    setIsModalOpen(false);
  };

  const handleChangeNewPay = (e) => {
    setNewPay({
      ...newPay,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddClick = async (e) => {
    e.preventDefault();

    if (newPay.title === "" || newPay.money === "") {
      alert("결제 내역명과 금액을 입력해주세요");
      return 0;
    }

    const newPayFormData = new FormData();
    for (let key in newPay) {
      if (key === "pay_member") newPayFormData.append(key, JSON.stringify(newPay[key]));
      else newPayFormData.append(key, newPay[key]);
    }
    newPayFormData.append("project", projectInfo.project_id);

    axios.post(`${API.PAYS}`, newPayFormData).then((res) => {
      if (res.status === 200) {
        axios.get(`${API.PAYS}/${projectInfo.project_id}`).then((res) => setPays(res.data));
      } else {
        alert("페이 생성 실패");
      }
    });

    setNewPay({ payer: userInfo.id, title: "", money: "", event_dt: "", pay_member: [3, 77, 78] });

    setIsModalOpen(false);
  };

  const Tab = {
    0: (
      <div>
        <button className="w-full h-12 mb-2 border-none rounded-md bg-lime font-scoredream text-base text-black" type="button" onClick={handleAddPayClick}>
          <span className="font-medium">결제내역</span>
          <span className="font-light">을 추가해주세요!</span>
        </button>
        <div className="w-full pt-4 border-none rounded-md bg-lightgray overflow-y-scroll" style={{ minHeight: "96px", maxHeight: "55vh" }}>
          {pays.map((pay) => (
            <Pay key={pay.pay_id} username={pay.payer} money={pay.money} title={pay.title} />
          ))}
        </div>
      </div>
    ),
    1: (
      <div>
        <div className="w-full mb-2 pt-2 border-none rounded-md bg-lightgray overflow-y-scroll" style={{ minHeight: "96px", maxHeight: "55vh" }}>
          <div className="flex justify-end">
            <span className="text-sm mr-2">{projectInfo.end_dt}까지 송금을 완료해주세요!</span>
          </div>
          {results.map((result) => (
            <Result key={result.id} username={result.usename} money={result.money} title={result.payer} />
          ))}
        </div>
        <button className="w-full h-12 mb-3 border-none rounded-md bg-lime font-scoredream text-base text-black" type="button" onClick={handleEndProjectClick}>
          <span className="font-medium">정산 종료하기</span>
        </button>
      </div>
    ),
  };

  return (
    <Fragment>
      <main className="mt-24">
        <div className="flex justify-between mb-5">
          <div className="flex items-end">
            <span className="mr-0.5 font-scoredream text-4xl font-medium whitespace-nowrap overflow-clip">{projectInfo.title}</span>
            <span className="text-sm font-lignt">2023.1.17</span>
          </div>
          <FiShare size="30" onClick={handleShareIconClick} />
        </div>
        <div className="flex w-full h-20 mb-5 py-2.5 px-4 border-none rounded-md bg-lightgray overflow-x-scroll">
          {members.map((member) => (
            <div key={member.member_id} className="flex">
              <UserProfile username={member.username} />
              <div className="mr-5" />
            </div>
          ))}
        </div>
        <div className="mb-2">
          <span
            className={
              "inline-block relative mr-2.5 leading-loose before:absolute before:bottom-0.5 before:left-0 before:w-full before:h-1 before:rounded before:bg-lime before:origin-left before:ease-in-out" +
              (clickedTabId === "0" ? " font-bold before:opacity-1 before:scale-x-1" : " before:opacity-0 before:scale-x-0")
            }
            onClick={handlePayListTabClick}
          >
            결제내역
          </span>
          <span
            className={
              "inline-block relative mr-2.5 leading-loose before:absolute before:bottom-0.5 before:left-0 before:w-full before:h-1 before:rounded before:bg-lime before:origin-left before:ease-in-out" +
              (clickedTabId === "1" ? " font-bold before:opacity-1 before:scale-x-1" : " before:opacity-0 before:scale-x-0")
            }
            onClick={handleResultListTabClick}
          >
            정산결과
          </span>
        </div>
        {Tab[clickedTabId]}
      </main>
      {isModalOpen && (
        <div className="flex flex-col justify-center items-center fixed inset-0 z-20">
          <div className="absolute inset-0" style={{ background: "rgba(11, 19, 30, 0.37)" }} />
          <div className="flex flex-col w-11/12 p-4 rounded-md bg-white z-10" style={{ maxWidth: "360px", minHeight: "420px" }}>
            <div className="flex justify-end">
              <IoCloseOutline size="24" onClick={handleCloseIconClick} />
            </div>
            <div className="flex flex-col items-center">
              <h1 className="mb-5 text-2xl font-medim">결제내역 추가</h1>
              <form className="flex flex-col w-full mb-5">
                <div className="mb-4">
                  <label className="text-md tracking-tight">
                    내역명<span className="pl-0.5 text-red">*</span>
                  </label>
                  <input
                    className="w-full h-12 mt-0.5 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                    name="title"
                    type="text"
                    value={newPay.title}
                    onChange={handleChangeNewPay}
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
                    value={newPay.money}
                    onChange={handleChangeNewPay}
                  />
                </div>
                <div className="mb-2">
                  <label className="text-md tracking-tight">참여자</label>
                  <input
                    type="text"
                    className="w-full h-12 mt-0.5 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                    placeholder="todo: 참여자 입력"
                  />
                </div>
                <div className="flex items-center w-full h-14 mb-4 px-2 border border-lightgray rounded-md bg-lightgray overflow-x-scroll">
                  <span className="mr-2 p-1.5 border-none rounded-lg bg-white text-center whitespace-nowrap overflow-hidden" style={{ minWidth: "60px" }}>
                    {userInfo.k_name}
                  </span>
                </div>
              </form>
              <button className="w-full h-12 mb-3 border-none rounded-md bg-lime font-notosans text-base text-white" type="submit" onClick={handleAddClick}>
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ProjectPage;
