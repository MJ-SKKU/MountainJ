import React, { Fragment } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import KakaoLogInImage from "../assets/images/kakao_login.png";
import { API, CLIENT_URL } from "../config";

const LandingPage = () => {

  const href = window.location.href;
  let params = new URL(window.location.href).searchParams;
  let code = params.get("code");

  if (code!=null){
        const formData = new FormData();
        formData.append("code", code);

        axios.post(`${API.LOGIN}`, formData).then((res) => {

          code = null;

          const user_id = res['data']['user']['id'];
          const userObject = res['data']['user'];
          navigate("/user", { state: { userId: user_id, userObject:userObject } });

        });
  }
  else{
    code = null;
  }

  const navigate = useNavigate();
  const handleKakaoLogInClick = async (e) => {
    e.preventDefault();
    window.location.href = `${API.KAKAO}`;
  };

  const handleNonMemberClick = () => {
    alert("todo: 비회원 정산");
  };

  return (
    <Fragment>
      <div className="fixed inset-0 w-screen h-screen bg-lime -z-10" />
      <div className="flex flex-col justify-evenly h-screen">
        <div>
          <h1 className="mb-1 font-scoredream  leading-none font-light text-white text-center" style={{ fontSize: "42px" }}>
            정산을한번에
          </h1>
          <h1 className="font-scoredream leading-none font-bold text-white text-center" style={{ fontSize: "42px" }}>
            마운틴제이
          </h1>
        </div>
        <Outlet />
        <div>
          <img className="w-full mb-3" src={KakaoLogInImage} alt="kakao_login" onClick={handleKakaoLogInClick} />
          <button className="w-full rounded-md bg-white" style={{ aspectRatio: "20/3" }} type="button" onClick={handleNonMemberClick}>
            비회원으로
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default LandingPage;
