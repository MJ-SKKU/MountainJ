import React, { Fragment, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiShare } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import UserProfile from "../components/UserProfile";
import TabMenu from "../components/TabMenu";
import { API } from "../config";

const ProjectPage = () => {
  // const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state.userName;
  const projectId = location.state.projectId;
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPay, setNewPay] = useState({ payer: 0, title: "", money: "", event_dt: "", pay_member: JSON.stringify([]) });
  const [clickedTabId, setClickedTabId] = useState("0");

  useEffect(() => {
    axios.get(`${API.MEMBERS}/${projectId}`).then((res) => setMembers(res.data));
  }, [projectId]);

  const handleShareIconClick = () => {
    alert("todo: 카카오 공유 API");
  };

  const handleAddPayClick = () => {
    setIsModalOpen(true);
  };

  const handlePayListTabClick = () => {
    setClickedTabId("0");
    navigate("", { state: { projectId: projectId } });
  };

  const handleResultListTabClick = () => {
    setClickedTabId("1");
    navigate("result", { state: { projectId: projectId } });
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

    axios.post(`${API.PAYS}`, newPay).then((res) => {});
    setNewPay({ payer: 0, title: "", money: "", event_dt: "", pay_member: [] });

    alert("todo: 결제 내역 추가");
    setIsModalOpen(false);
  };

  return (
    <Fragment>
      <main className="mt-24">
        <div className="flex justify-between mb-5">
          <div className="flex items-end">
            <span className="mr-0.5 font-scoredream text-4xl font-medium whitespace-nowrap overflow-clip">정산명</span>
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
        <button className="w-full h-12 mb-3 border-none rounded-md bg-lime font-scoredream text-base text-black" type="button" onClick={handleAddPayClick}>
          <span className="font-medium">결제내역</span>
          <span className="font-light">을 추가해주세요!</span>
        </button>
        <div className="mb-1.5">
          <TabMenu id="0" clickedTabId={clickedTabId} content="결제내역" onClick={handlePayListTabClick} />
          <TabMenu id="1" clickedTabId={clickedTabId} content="정산결과" onClick={handleResultListTabClick} />
        </div>
        <Outlet />
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
                  <label className="text-md tracking-tight">내역명</label>
                  <input
                    className="w-full h-12 mt-0.5 py-3.5 px-3 border border-width border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                    name="title"
                    type="text"
                    value={newPay.title}
                    onChange={handleChangeNewPay}
                  />
                </div>
                <div className="mb-4">
                  <label className="text-md tracking-tight">금액</label>
                  <input
                    className="w-full h-12 mt-0.5 py-3.5 px-3 border border-width border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
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
                    className="w-full h-12 mt-0.5 py-3.5 px-3 border border-width border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                    placeholder="todo: 참여자 입력"
                  />
                </div>
                <div className="flex items-center w-full h-14 mb-4 px-2 border border-width border-lightgray rounded-md bg-lightgray overflow-x-scroll">
                  <span className="mr-2 p-1.5 border-none rounded-lg bg-white text-center whitespace-nowrap overflow-hidden" style={{ minWidth: "60px" }}>
                    {userName}
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
