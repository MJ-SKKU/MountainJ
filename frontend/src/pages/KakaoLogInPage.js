import axios from "axios";
import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../config";

const KakaoLogInPage = () => {
  const navigate = useNavigate();

  const params = new URL(window.location.href).searchParams;
  const authCode = params.get("code");

  const authCodeformData = new FormData();
  authCodeformData.append("code", authCode);

  axios.post(`${API.LOGIN}`, authCodeformData).then((res) => {
    const userInfo = res.data.user;
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    navigate("/projects", { state: { userInfo: userInfo } });
  });

  return (
    <Fragment>
      <div className="fixed inset-0 w-screen h-screen bg-lime -z-10" />
      <div className="justify-center text-center h-screen">
        <span>카카오 로그인 중 . . .</span>
      </div>
    </Fragment>
  );
};

export default KakaoLogInPage;
