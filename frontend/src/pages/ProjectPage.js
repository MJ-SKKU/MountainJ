import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiShare, FiEdit } from "react-icons/fi";
import axios from "axios";

import { paysActions } from "../store/Pays";
import { payActions } from "../store/PayInfo";
import { resultsActions } from "../store/Results";
import { membersActions } from "../store/Members";
import Tab from "../components/UI/Tab";
import UserProfile from "../components/UI/UserProfile";
import ResultList from "../components/Result/ResultList";
import ProjEditModal from "../components/Modal/ProjEditModal";
import PayList from "../components/Pay/PayList";
import Modal from "../components/Modal/Modal";
import CreatePayModal from "../components/Modal/CreatePayModal";
import { API } from "../config";
import {useLocation} from "react-router-dom";
import {projectActions} from "../store/ProjectInfo";

const ProjectPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.userObj);
  const isAuth = useSelector((state) => state.userReducer.isAuthenticated);


  const project = useSelector((state) => state.projectReducer);
  const pays = useSelector((state) => state.paysReducer.pays);
  const results = useSelector((state) => state.resultsReducer.results);
  const payMembers = useSelector((state) => state.membersReducer.memObjects);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPayMode, setIsPayMode] = useState(true);

  const location = useLocation();
  let projectId;
  if(project.project_id==null){
      projectId = location.pathname.split("/").slice(-1)[0];
  }
  else{
      projectId = project.project_id;
  }

  let payMemberNames = [];
  let payMemberIds = [];
  for (let obj in payMembers) {
    payMemberNames.push(payMembers[obj].username);
    payMemberIds.push(payMembers[obj].member_id);
  }


  useEffect(() => {
    dispatch(payActions.unsetPay());
    axios.get(`${API.RESULTS}/${projectId}`).then((res) => {
      dispatch(membersActions.loadMembers(res.data.members));
      dispatch(resultsActions.loadResults(res.data.project_result));
    });
    axios.get(`${API.PAYS}/${projectId}`).then((res) => {
      dispatch(paysActions.loadPays(res.data));
    });
    axios.get(`${API.PROJECT}/${projectId}`).then((res) => {
      dispatch(projectActions.setProject(res.data));
    });
  }, [projectId, dispatch]);

  const share = () => {
    if (window.Kakao) {
      const kakao = window.Kakao;

      if (!kakao.isInitialized()) {
        kakao.init(API.JS_KEY);
      }

      kakao.Share.sendCustom({
        templateId: 88996,
        templateArgs: {
          MessageTitle: `${project.title}`,
          MessageDescription: `${user.k_name}님이 정산을 요청했어요!`,
          ProjectTitle: `정산하러 가기`,
          project_id: projectId,
        },
      });
    }
  };

  const onPayClick = () => {
    setIsPayMode(true);
  };

  const onResultClick = () => {
    setIsPayMode(false);
  };

  const onAddPayClick = () => {
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
    setIsEditOpen(false);
  };

  const onEdit = () => {
    setIsEditOpen(true);
  };

  return (
    <Fragment>
      <main className="mt-16">
        <div className="flex flex-col items-center">
          <div className="flex justify-between w-full items-end mt-2 px-4">
            <span className="text-sm font-lignt">2023.1.17</span>
            {isAuth ? (
              <div className="flex gap-3">
                <FiShare className="cursor-pointer" size="24" onClick={share} />
                <FiEdit className="cursor-pointer" size="24" onClick={onEdit} />
              </div>
            ) : null}
          </div>
          <h1 className="font-scoredream my-4 text-3xl font-medium whitespace-nowrap overflow-clip">
            {project?.title}
          </h1>
        </div>
        <div className="flex w-full h-20 mb-6 py-2.5 px-4 border-none rounded-md bg-lightgray overflow-x-scroll">
          {payMemberNames.map((memberName, idx) => (
            <div key={idx} className="flex ml-2.5 mr-2.5">
              <UserProfile username={memberName} />
            </div>
          ))}
        </div>
        <div className="mb-2">
          <Tab title="결제내역" mode={isPayMode} onTabClick={onPayClick} />
          <Tab title="정산결과" mode={!isPayMode} onTabClick={onResultClick} />
        </div>
        {isPayMode ? (
          <PayList
            isAuth={isAuth}
            isComplete={project.status}
            originalMemberNames={payMemberNames}
            pays={pays}
            onClick={onAddPayClick}
          />
        ) : (
          <ResultList
            project={project}
            payMemberNames={payMemberNames}
            payMemberIds={payMemberIds}
            results={results}
            isAuth={isAuth}
            isComplete={project.status}
          />
        )}
      </main>

      {isEditOpen && (
        <Modal title="정산 수정" onClose={onClose}>
          <ProjEditModal setIsEditOpen={setIsEditOpen} />
        </Modal>
      )}

      {isModalOpen && (
        <Modal title="결제 내역 생성" onClose={onClose}>
          <CreatePayModal
            payMemberNames={payMemberNames}
            setIsModalOpen={setIsModalOpen}
          />
        </Modal>
      )}
    </Fragment>
  );
};

export default ProjectPage;
