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
import ProjJoinModal from "../components/Modal/ProjJoinModal";
import PayList from "../components/Pay/PayList";
import Modal from "../components/Modal/Modal";
import CreatePayModal from "../components/Modal/CreatePayModal";
import { API } from "../config";
import {useLocation} from "react-router-dom";
import {projectActions} from "../store/ProjectInfo";
import Button from "../components/UI/Button";

const ProjectPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.userObj);
  const isAuth = useSelector((state) => state.userReducer.isAuthenticated);

  const [userMember, setUserMember] = useState(null);

  const project = useSelector((state) => state.projectReducer);
  const projectUpdate = useSelector((state) => state.projectReducer.needUpdate);
  const pays = useSelector((state) => state.paysReducer.pays);
  const paysUpdate = useSelector((state) => state.paysReducer.needUpdate);

  const results = useSelector((state) => state.resultsReducer.results);
  //todo: payemem mem 구분
  const payMembers = useSelector((state) => state.membersReducer.memObjects);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPayMode, setIsPayMode] = useState(true);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  const location = useLocation();
  // let projectId;
  // if(project.project_id==null){
  const projectId = location.pathname.split("/").slice(-1)[0];
  // }
  // else{
  //     projectId = project.project_id;
  // }



  useEffect(() => {
    console.log("user");
    console.log(user);
    if(isAuth){
      const user_id = user.id;
      const members = [...payMembers];
      for(const member of members){
          if(member.user!=undefined&&member.user==user_id){
            setUserMember(member);
            console.log("userMember");
            console.log(userMember);
            return;
          }
      }
      // setIsJoinOpen(true);
    }
    // if(user)
  }, [user,isAuth,payMembers,isJoinOpen, projectId]);

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
  }, [projectId, dispatch, projectUpdate]);

  useEffect(() => {
    axios.get(`${API.PAYS}/${projectId}`).then((res) => {
      dispatch(paysActions.loadPays(res.data));
    });
  }, [paysUpdate]);


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

  const onJoinClick = () => {
    if(JSON.stringify({})==JSON.stringify(user)){
      alert("로그인 후 이용할 수 있습니다.\n 오른쪽 상단 로그인 버튼을 클릭해주세요.")
      // alert(JSON.stringify(user))
      return;
    }
    setIsJoinOpen(true);
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
    setIsJoinOpen(false);
  };

  const onEdit = () => {
    setIsEditOpen(true);
  };

  return (
    <Fragment>
      <main className="mt-16">
        <div className="flex flex-col items-center">
          <div className="flex justify-between w-full items-end mt-2 px-4">
            <span className="text-sm font-lignt">{project.event_dt.split("T")[0]}</span>
            {isAuth && userMember!=null ? (
              <div className="flex gap-3">
                <FiShare className="cursor-pointer" size="24" onClick={share} />
                { !project.status &&
                    <FiEdit className="cursor-pointer" size="24" onClick={onEdit} />
                }
              </div>
            ) : null}
          </div>
          <h1 className="font-scoredream my-4 text-3xl font-medium whitespace-nowrap overflow-clip">
            {project.title}
          </h1>
        </div>
        <div className="flex w-full h-20 mb-3 py-2.5 px-4 border-none rounded-md bg-lightgray overflow-x-auto">
          {payMembers.map((member, idx) => (
            <div key={idx} className="flex ml-2.5 mr-2.5">
              <UserProfile user_id={member.user} username={member.username} is_owner={member.user == project.owner} my_id={user.id}/>
            </div>
          ))}
        </div>
        {
          userMember == null && (
              <div className="w-full">
                <button
                    onClick={onJoinClick}
                    className="w-full h-12 border-none rounded-md bg-lime font-scoredream"
                >
                  <span className="font-medium">정산</span>에 <span className="font-medium">참여하기</span>
                </button>
              </div>
          )
        }
        <div className="mb-2 mt-3">
          <Tab title="결제내역" mode={isPayMode} onTabClick={onPayClick} />
          <Tab title="정산결과" mode={!isPayMode} onTabClick={onResultClick} />
        </div>
        {isPayMode ? (
          <PayList
            isAuth={isAuth}
            userMember={userMember}
            isComplete={project.status}
            pays={pays}
            onClick={onAddPayClick}
          />
        ) : (
          <ResultList
            project={project}
            results={results}
            isAuth={isAuth}
            userMember={userMember}
            // isComplete={project.status}
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
            setIsModalOpen={setIsModalOpen}
          />
        </Modal>
      )}

      {isJoinOpen && (
        <Modal title={`정산 참여하기`} onClose={onClose}>
          <ProjJoinModal
            setIsJoinOpen={setIsJoinOpen}
          />
        </Modal>
      )}
    </Fragment>
  );
};

export default ProjectPage;
