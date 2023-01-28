import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
// import Select from "react-select";

import { useLocation, useNavigate } from "react-router-dom";
import { FiShare, FiEdit } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import UserProfile from "../components/UserProfile";
import Pay from "../components/Pay";
import Result from "../components/Result";
import { API } from "../config";

const ProjectPage = (e) => {
  const navigate = useNavigate();
  const location = useLocation();

  // const [members, setMembers] = useState([]);

  // let userInfo = location.state.userInfo;
  // let userInfo = {};

  // const projectInfo = location.state.projectInfo;
  // const memberId = location.state.memberId;
  // const member = location.state.member;
  // const member = {member_id: 114, project: 68, user: null, username: '박성원'};

  let curr = new Date();
  curr.setDate(curr.getDate() + 3);
  let date = curr.toISOString().substring(0, 10);

  const [projectInfo, setProjectInfo] = useState({});
  const [tempProjectInfo, setTempProjectInfo] = useState({...projectInfo});

  const handleChangeTempProject = (e) => {
    setTempProjectInfo({
      ...tempProjectInfo,
      [e.target.name]: e.target.value,
    });
  };

  const [isOwner, setisOwner] = useState(false);

  // 아래 명칭 owner로 바꾸기
  // const [member, setMember] = useState({});
  // const member = {member_id: 114, project: 68, user: null, username: '박성원'};
  const [member, setMember] = useState({});
  const [members, setMembers] = useState([]);

  const [newProjectMember, setNewProjectMember] = useState("");
  const [projectMemberList, setProjectMemberList] = useState([]);




  const handleAddProjectMemberClick = () => {
    console.log("Test1", projectMemberList);
    // memberList.push(newProjectMember);
    setProjectMemberList([...projectMemberList, newProjectMember]);
    console.log("Test2", projectMemberList);
    setNewProjectMember({"username":""});
  };
  const handleDeleteMemberClick = (e) => {
    e.preventDefault();
    console.log("handleDeleteMemberClick");
    let index = e.target.getAttribute("index");
    projectMemberList.splice(index, 1);
    setProjectMemberList([...projectMemberList]);
    let eve = { target: { name: "name_li", value: projectMemberList } };
    handleChangeTempProject(eve);
  };

  const handleChangeNewProjectMember = (e) => {
    console.log("******");
    console.log(e);
    setNewProjectMember({"username": e.target.value});
  };

  // 코드 리팩토링해서 newpay나 이거 둘중에 하나만 남기기
  // 여기서 newpay 초기화해줘야한다면
  const InitNewPay = {
    payer: member,
    pay_member: [...members],
    title: "",
    money: "",
  };
  const [newPay, setNewPay] = useState(InitNewPay);
  const [pays, setPays] = useState([]);
  const [results, setResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ProjectModalOpen, setProjectModalOpen] = useState(false);
  const [clickedTabId, setClickedTabId] = useState("0");

  const [newMemberName, setNewMemberName] = useState("");
  const [paymembers, setPayMembers] = useState([]);


  useEffect(() => {
    console.log('변경');
    console.log(members);
    setProjectMemberList([...members]);
  }, [members]);

  useEffect(() => {
    if(ProjectModalOpen===true){
      // console.log("!!!!!!!!!!!");
      console.log(members);
      setTempProjectInfo({...projectInfo});
      setProjectMemberList([...members]);
    }
  }, [ProjectModalOpen]);

  useEffect(() => {
    console.log('@@@@@');
    console.log(projectMemberList);
  }, [projectMemberList]);


  useEffect(() => {
    const project_id = location.pathname.split("/").slice(-1)[0];
    console.log(project_id);

    if (JSON.stringify(projectInfo) === JSON.stringify({})) {
      axios.get(`${API.PROJECT}/${project_id}`).then((res) => {
        console.log(res.data);
        setProjectInfo(res.data);
      });
    } else {
      axios
        .get(`${API.PAYS}/${projectInfo.project_id}`)
        .then((res) => setPays(res.data));
      axios.get(`${API.MEMBERS}/${projectInfo.project_id}`).then((res) => {
        setMembers([...res.data]);
        setPayMembers([...res.data]);
      });
      setTempProjectInfo(projectInfo);
    }
  }, [location.pathname, projectInfo]);


  const [IsLogin, setIsLogin] = useState(false);

  const [userInfo, setUserInfo] = useState({});




  useEffect(() => {
    console.log(localStorage.getItem("userInfo"));
    if (userInfo!==null && JSON.stringify(userInfo) !== JSON.stringify({})) {
      setIsLogin(true);
    }else{
      setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
      setIsLogin(false);
    }
  }, [userInfo]);


  useEffect(() => {
    if (userInfo != null && JSON.stringify(userInfo) !== JSON.stringify({})) {
      const project_id = location.pathname.split("/").slice(-1)[0];

      setisOwner(true);
      axios.get(`${API.MEMBER}/${userInfo.id}/${project_id}`).then((res) => {
        console.log("log");
        console.log(res.data);
        setMember(res.data);
      });
    } else {
      console.log("..");
    }
  }, [location.pathname, userInfo]);

  // useEffect(() => {
  //   axios.get(`${API.PAYS}/${projectInfo.project_id}`).then((res) => setPays(res.data));
  // }, [projectInfo.project_id]);

  const handleShareIconClick = () => {
    if (window.Kakao) {
      const kakao = window.Kakao;

      if (!kakao.isInitialized()) {
        kakao.init(API.JS_KEY);
      }
      console.log(`${API.PAYS}/${projectInfo.project_id}`);
      kakao.Share.sendCustom({
        templateId: 88996,
        templateArgs: {
          MessageTitle: `${projectInfo.title}`,
          MessageDescription: `${userInfo.k_name}님이 정산을 요청했어요!`,
          ProjectTitle: `정산하러 가기`,
          project_id: projectInfo.project_id,
        },
      });
    }
  };

  const handleAddPayClick = () => {
    //paymembers 초기화
    setPayMembers([...members]);
    setNewPay(InitNewPay);
    setIsModalOpen(true);
  };

  const handlePayListTabClick = () => {
    setClickedTabId("0");
  };

  const handleChangeNewMemberName = (e) => {
    setNewMemberName(e.target.value);
  };

  const handleDeletePayMemberClick = (e) => {
    e.preventDefault();
    let index = e.target.getAttribute("index");
    console.log(paymembers[index]);
    console.log(newPay.payer);
    if (paymembers[index].member_id === newPay.payer.member_id) {
      alert("결제자는 삭제할 수 없습니다.");
      return;
    }
    paymembers.splice(index, 1);
    setPayMembers(paymembers);
    let eve = { target: { name: "pay_member", value: paymembers } };
    handleChangeNewPay(eve);
  };

  const handleAddPayMemberClick = () => {
    if (newMemberName === "") {
      alert("이름을 입력해주세요.");
    } else {
      let newMember = {
        project: projectInfo.project_id,
        username: newMemberName,
      };
      paymembers.push(newMember);
      setNewMemberName("");
    }
    let e = { target: { name: "pay_member", value: paymembers } };
    handleChangeNewPay(e);
  };

  const handleResultListTabClick = () => {
    axios.get(`${API.RESULTS}/${projectInfo.project_id}`).then((res) => {
      setResults(res["data"]["project_result"]);
    });
    setClickedTabId("1");
  };

  const handleCloseIconClick = () => {
    setIsModalOpen(false);
    setProjectModalOpen(false);
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

    setNewPay(obj);

    if (e.target.name === "payer") {
      console.dir(e.target.options.selectedIndex);
      let k = e.target.options.selectedIndex;
      // 에러나는데 되서 그냥 씀
      e.target.options.selectedIndex(k);
      // e.target.value = JSON.parse(e.target.value);
    }
  };

  const handleAddClick = async (e) => {
    e.preventDefault();
    console.log(newPay);
    if (newPay.title === "" || newPay.money === "") {
      alert("결제 내역명과 금액을 입력해주세요");
      return 0;
    } else if (!isNaN(newPay.money.replace((",", "")))) {
      alert("금액은 숫자만 입력가능합니다.");
      return 0;
    }
    console.log(newPay.title);
    console.log(newPay.money);

    const newPayFormData = new FormData();
    for (let key in newPay) {
      if (key === "pay_member" || key === "payer") {
        newPayFormData.append(key, JSON.stringify(newPay[key]));
      } else newPayFormData.append(key, newPay[key]);
    }
    newPayFormData.append("project", projectInfo.project_id);
    // console.log('call');
    // console.log(newPay);
    // console.log('paymember');
    // console.log(newPay["pay_member"]);
    // console.log('payer');
    // console.log(newPay["payer"]);
    axios.post(`${API.PAYS}`, newPayFormData).then((res) => {
      // console.log('response');
      if (res.status === 200) {
        // console.log(res['data']['pays']);
        setPays(res["data"]["pays"]);
        // console.log(res['data']['paymembers']);
        // console.log(res['data']['members']);
        setMembers(res["data"]["members"]);
      } else {
        alert("페이 생성 실패");
      }
    });

    setNewPay(InitNewPay);

    setIsModalOpen(false);
  };

  const handleEndProjectClick = () => {
    const projectEndFormData = new FormData();
    projectEndFormData.append("project_id", projectInfo.project_id);

    axios.patch(`${API.END}`, projectEndFormData).then((res) => {
      if (res.status === 200) {
        navigate("/projects", { state: { userInfo: userInfo } });
      } else {
        alert("정산 종료 실패");
      }
    });
  };

  const handleEditIconClick = () => {
    console.log(projectInfo.project_id);
    setProjectModalOpen(true);
  };


  const isComplete = projectInfo.status;


  const handleEditClick = async (e) => {

    e.preventDefault();

    console.log('수정 완료하기');
    console.log(projectMemberList);

    if (tempProjectInfo.title === "" || tempProjectInfo.end_dt === "") {
      alert("정산명과 입력 마감 날짜를 입력해주세요");
      return 0;
    }

    tempProjectInfo.name_li = projectMemberList; // 참여자 입력 받은 memberList 배열  newProject.name_li 에 넣기
    const newProjectFormData = new FormData();
    for (let key in tempProjectInfo) {
      if (key === "name_li")
        newProjectFormData.append(key, JSON.stringify(tempProjectInfo[key]));
      else newProjectFormData.append(key, tempProjectInfo[key]);
    }

    axios.patch(`${API.PROJECT}/${projectInfo.project_id}`, newProjectFormData).then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        console.log('set 하세요.');
        // const projectInfo = res.data.project;
        setProjectInfo(res.data.project);
        setMembers(res.data.members);

        axios
        .get(`${API.PAYS}/${projectInfo.project_id}`)
        .then((res) => setPays(res.data));

      } else {
        alert("정산 생성 실패");
      }
    });
    setProjectModalOpen(false);
  };

  // let isOwner =  userInfo.id === projectInfo.owner ? true : false;

  // let isOwner =  false;
  const Tab = {
    0: (
      <div>
        {IsLogin ? (
            isComplete ? (
              <button
                className="w-full h-12 mb-2 border-none rounded-md bg-lightgray font-scoredream text-base text-gray-500"
                type="button"
                onClick={() => {
                  alert("이미 완료된 정산입니다.");
                }}
              >
                <span className="font-medium">결제내역</span>
                <span className="font-light">을 추가해주세요!</span>
              </button>
            ) : (
              <button
                className="w-full h-12 mb-2 border-none rounded-md bg-lime font-scoredream text-base text-black"
                type="button"
                onClick={handleAddPayClick}
              >
                <span className="font-medium">결제내역</span>
                <span className="font-light">을 추가해주세요!</span>
              </button>
            )
        ) : (
            <span title={`비회원보기모드`}></span>
        )}

        <div
          className="w-full pt-4 border-none rounded-md bg-lightgray overflow-y-auto"
          style={{ minHeight: "96px", maxHeight: "55vh" }}
        >
          {pays.map((pay) => {
            // console.log(pay);
            return (
              <Pay
                members={members}
                key={pay.pay_id}
                payer_id={pay.payer}
                money={pay.money}
                title={pay.title}
                pay_id={pay.pay_id}
              />
            );
          })}
        </div>
      </div>
    ),
    1: (
      <div>
        <div
          className="w-full mb-2 pt-2 border-none rounded-md bg-lightgray overflow-y-auto"
          style={{ minHeight: "96px", maxHeight: "55vh" }}
        >
          {results.map((result) => {
            let members_map = {};
            for (var m in members) {
              // console.log(members[m])
              members_map[members[m].member_id] = members[m].username;
            }
            return (
              <Result
                key={result[0] + result[1]}
                username={members_map[result[1]]}
                money={result[2]}
                payer={members_map[result[0]]}
              />
            );
          })}
        </div>
        {IsLogin ? (
            isOwner ? (
              <button
                className="w-full h-12 mb-3 border-none rounded-md bg-lime font-scoredream text-base text-black"
                type="button"
                onClick={handleEndProjectClick}
              >
                <span className="font-medium">정산 종료하기</span>
              </button>
            ) : (
              <button
                className="w-full h-12 mb-3 border-none rounded-md bg-lightgray font-scoredream text-base text-gray-500"
                type="button"
                onClick={() => {
                  alert("정산 생성자만 종료할 수 있습니다.");
                }}
              >
                <span className="font-medium">정산 종료하기</span>
              </button>
            )
        ) : (
            <span title={`비회원보기모드`}></span>
        )}
      </div>
    ),
  };

  return (
    <Fragment>
      <main className="mt-24">
        <div className="flex justify-between mb-5">
          <div className="flex items-end">
            <span className="mr-0.5 font-scoredream text-4xl font-medium whitespace-nowrap overflow-clip">
              {projectInfo.title}
            </span>
            <span className="text-sm font-lignt">2023.1.17</span>
          </div>
          {IsLogin ? (
              <div className="flex gap-3">
                <FiEdit size="30" onClick={handleEditIconClick} />
                <FiShare size="30" onClick={handleShareIconClick} />
              </div>
          ) : (
              <div className="flex gap-3">
                {/*<FiEdit size="30" onClick={handleEditIconClick} />*/}
                <FiShare size="30" onClick={()=>alert("공유하기는 로그인 후 이용가능합니다.")} />
              </div>
          )}
        </div>
        <div className="flex w-full h-20 mb-5 py-2.5 px-4 border-none rounded-md bg-lightgray overflow-x-auto">
          {members.map((member) => {
            // console.log('.');
            // console.log(member);
            return (
              <div key={member.member_id} className="flex">
                <UserProfile username={member.username} />
                <div className="mr-5" />
              </div>
            );
          })}
        </div>
        <div className="mb-2">
          <span
            className={
              "inline-block relative mr-2.5 leading-loose before:absolute before:bottom-0.5 before:left-0 before:w-full before:h-1 before:rounded before:bg-lime before:origin-left before:ease-in-out" +
              (clickedTabId === "0"
                ? " font-bold before:opacity-1 before:scale-x-1"
                : " before:opacity-0 before:scale-x-0")
            }
            onClick={handlePayListTabClick}
          >
            결제내역
          </span>
          <span
            className={
              "inline-block relative mr-2.5 leading-loose before:absolute before:bottom-0.5 before:left-0 before:w-full before:h-1 before:rounded before:bg-lime before:origin-left before:ease-in-out" +
              (clickedTabId === "1"
                ? " font-bold before:opacity-1 before:scale-x-1"
                : " before:opacity-0 before:scale-x-0")
            }
            onClick={handleResultListTabClick}
          >
            정산결과
          </span>
        </div>
        {Tab[clickedTabId]}
      </main>

      {ProjectModalOpen && (
            <div className="flex flex-col justify-center items-center fixed inset-0 z-20">
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
                  <h1 className="mb-5 text-2xl font-medim">정산 정보 수정</h1>
                  <form className="flex flex-col w-full mb-5">
                    <div className="mb-4">
                      <label className="text-md tracking-tight">
                        정산명<span className="pl-0.5 text-red">*</span>
                      </label>
                      <input
                        className="w-full h-12 mt-0.5 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                        name="title"
                        type="text"
                        value={tempProjectInfo.title}
                        onChange={handleChangeTempProject}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="text-md tracking-tight">날짜</label>
                      <input
                        className="w-full h-12 mt-0.5 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                        name="event_dt"
                        type="date"
                        value={tempProjectInfo.event_dt}
                        defaultValue={date}
                        onChange={handleChangeTempProject}
                      />
                    </div>
                    <div className="mb-1.5">
                      <label className="text-md tracking-tight">참여자</label>
                      <input
                        className="w-full h-12 mt-0.5 mb-1 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                        name="member"
                        type="text"
                        value={newProjectMember.username}
                        onChange={handleChangeNewProjectMember}
                        // onKeyDown={handleKeyDownMember}
                      />
                      <button
                        className="w-full h-10 mb-1 rounded bg-lime text-white"
                        type="button"
                        onClick={handleAddProjectMemberClick}
                      >
                        추가하기
                      </button>
                      <div className="flex items-center w-full h-14 mb-4 px-2 border border-lightgray rounded-md bg-lightgray overflow-x-auto">
                        {projectMemberList.map((member, index) =>
                          (
                          <span
                            key={index}
                            className="mr-2 p-1.5 border-none rounded-lg bg-white text-center whitespace-nowrap overflow-hidden"
                            style={{ minWidth: "60px" }}
                          >
                            {member.username}
                            {userInfo.k_name === member.username ? (
                              <button
                                className="ml-1 text-danger"
                                index={index}
                                // onClick={handleDeleteMemberClick}
                              ></button>
                            ) : (
                              <button className="ml-1 text-danger"
                                      index={index}
                                      onClick={handleDeleteMemberClick}
                              >
                                x
                              </button>
                            )}
                          </span>
                        )
                        )}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="text-md tracking-tight">
                        입력 마감 기한<span className="pl-0.5 text-red">*</span>
                      </label>
                      <input
                        className="w-full h-12 mt-0.5 py-3.5 px-3 border border-gray rounded font-notosans text-base text-black tracking-tight focus:outline-1 focus:outline-lime placeholder:lightgray"
                        name="end_dt"
                        type="date"
                        value={tempProjectInfo.end_dt}
                        onChange={handleChangeTempProject}
                      />
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
                    onChange={handleChangeNewPay}
                    // defaultValue={member.username}
                    defaultValue={JSON.stringify(member)}
                  >
                    {paymembers.map((pm, index) => {
                      // console.log(pm);
                      return (
                        <option
                          // id={JSON.stringify(pm)}
                          value={JSON.stringify(pm)}
                        >
                          {/*value={pm.username}>*/}
                          {pm.username}
                        </option>
                      );
                      // return (
                      //     <option
                      //       value={JSON.stringify(pm)}
                      //       member_id={pm.member_id}
                      //       username={pm.username}
                      //       className="mr-2 p-1.5  border-none rounded-lg bg-white text-center whitespace-nowrap overflow-hidden"
                      //       style={{ minWidth: "60px" }}
                      //     >
                      //       {pm.username}
                      //     </option>
                      //   )
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
                onClick={handleAddClick}
              >
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
