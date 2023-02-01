import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiShare, FiEdit } from "react-icons/fi";
import axios from "axios";

import Tab from "../components/UI/Tab";
import UserProfile from "../components/UI/UserProfile";
import ResultList from "../components/Result/ResultList";
import ProjEditModal from "../components/Modal/ProjEditModal";
import PayList from "../components/Pay/PayList";
import Modal from "../components/Modal/Modal";
import CreatePayModal from "../components/Modal/CreatePayModal";
import { API } from "../config";

const ProjectPage = () => {
  const location = useLocation();

  // let userInfo, project, originMembers, originMemberIds;
  // if (location.state) {
  //   userInfo = location.state.userInfo;
  //   project = location.state.projectInfo;
  //   originMembers = location.state.members;
  //   originMemberIds = location.state.memberIds;
  // }
  const userInfo = location.state.userInfo;
  const project = location.state.projectInfo;
  const originMembers = location.state.members;
  const originMemberIds = location.state.memberIds;

  const [payMembers, setPayMembers] = useState(originMembers);
  const [pays, setPays] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPayMode, setIsPayMode] = useState(true);
  const [results, setResults] = useState([]);

  const isLoggedIn = userInfo !== null;
  const isComplete = project.status;
  const initNewPay = {
    pay_id: 0,
    project: project.project_id,
    payer: userInfo,
    pay_members: originMembers,
    title: "",
    money: 0,
  };
  let newPay = { ...initNewPay };

  useEffect(() => {
    axios.get(`${API.RESULTS}/${project.project_id}`).then((res) => {
      setResults(res.data.project_result);
    });
    axios
      .get(`${API.PAYS}/${project.project_id}`)
      .then((res) => setPays(res.data));
  }, [project.project_id]);

  const handleShareIconClick = () => {
    if (window.Kakao) {
      const kakao = window.Kakao;

      if (!kakao.isInitialized()) {
        kakao.init(API.JS_KEY);
      }

      kakao.Share.sendCustom({
        templateId: 88996,
        templateArgs: {
          MessageTitle: `${project.title}`,
          MessageDescription: `${userInfo.k_name}님이 정산을 요청했어요!`,
          ProjectTitle: `정산하러 가기`,
          project_id: project.project_id,
        },
      });
    }
  };

  const onPayAdd = () => {
    newPay = { ...initNewPay };
    setPayMembers(originMembers);
    setIsModalOpen(true);
  };

  const onPayTabClick = () => {
    setIsPayMode(true);
  };

  const onResultTabClick = () => {
    setIsPayMode(false);
  };

  const handleCloseIconClick = () => {
    setIsModalOpen(false);
    setIsEditOpen(false);
  };

  const handleChangeNewPay = (e) => {
    let key, value;
    key = e.target.name;
    value = e.target.value;

    if (e.target.name === "payer") {
      value = JSON.parse(e.target.value);
    }

    let obj = {
      ...newPay,
      [key]: value,
    };

    newPay = { ...obj };

    if (e.target.name === "payer") {
      console.dir(e.target.options.selectedIndex);
      let k = e.target.options.selectedIndex;
      // 에러나는데 되서 그냥 씀
      e.target.options.selectedIndex(k);
    }
  };

  const handleAddClick = async (e) => {
    e.preventDefault();

    if (newPay.title === "" || newPay.money === "") {
      alert("결제 내역명과 금액을 입력해주세요");
      return 0;
    } else if (!isNaN(newPay.money.replace((",", "")))) {
      alert("금액은 숫자만 입력가능합니다.");
      return 0;
    }

    const newPayFormData = new FormData();
    for (let key in newPay) {
      if (key === "pay_members" || key === "payer") {
        newPayFormData.append(key, JSON.stringify(newPay[key]));
      } else newPayFormData.append(key, newPay[key]);
    }
    newPayFormData.append("project", project.project_id);
    axios.post(`${API.PAYS}`, newPayFormData).then((res) => {
      if (res.status === 200) {
        setPays(res["data"]["pays"]);
      } else {
        alert("페이 생성 실패");
      }
    });

    newPay = { ...initNewPay };
    setIsModalOpen(false);
  };

  const handleEditIconClick = () => {
    setIsEditOpen(true);
  };

  const iconOpts = isLoggedIn ? (
    <div className="flex gap-3">
      <FiShare
        className="cursor-pointer"
        size="24"
        onClick={handleShareIconClick}
      />
      <FiEdit
        className="cursor-pointer"
        size="24"
        onClick={handleEditIconClick}
      />
    </div>
  ) : (
    <div className="flex gap-3">
      <FiShare
        className="cursor-pointer"
        size="24"
        onClick={() => alert("공유하기는 로그인 후 이용가능합니다.")}
      />
    </div>
  );

  return (
    <Fragment>
      <main className="mt-16">
        <div className="flex flex-col items-center">
          <div className="flex justify-between w-full items-end mt-2 px-4">
            <span className="text-sm font-lignt">2023.1.17</span>
            {iconOpts}
          </div>
          <h1 className="font-scoredream my-4 text-3xl font-medium whitespace-nowrap overflow-clip">
            {project.title}
          </h1>
        </div>
        <div className="flex w-full h-20 mb-6 py-2.5 px-4 border-none rounded-md bg-lightgray overflow-x-scroll">
          {payMembers.map((member, idx) => (
            <div key={idx} className="flex mr-5">
              <UserProfile username={member} />
            </div>
          ))}
        </div>
        <div className="mb-2">
          <Tab title="결제내역" mode={isPayMode} onTabClick={onPayTabClick} />
          <Tab
            title="정산결과"
            mode={!isPayMode}
            onTabClick={onResultTabClick}
          />
        </div>
        {isPayMode ? (
          <PayList
            isLoggedIn={isLoggedIn}
            isComplete={isComplete}
            payMembers={payMembers}
            originMemberIds={originMemberIds}
            pays={pays}
            onClick={onPayAdd}
            projectId={project.project_id}
          />
        ) : (
          <ResultList
            project={project}
            user={userInfo}
            payMembers={payMembers}
            results={results}
            isLoggedIn={isLoggedIn}
            isComplete={isComplete}
          />
        )}
      </main>

      {isEditOpen && (
        <Modal title="정산 수정" onClose={handleCloseIconClick}>
          <ProjEditModal
            user={userInfo}
            project={project}
            payMembers={payMembers}
          />
        </Modal>
      )}

      {isModalOpen && (
        <Modal title="결제 내역 추가" onClose={handleCloseIconClick}>
          <CreatePayModal
            payMembers={originMembers}
            setIsModalOpen={setIsModalOpen}
          />
        </Modal>
      )}
    </Fragment>
  );
};

export default ProjectPage;
