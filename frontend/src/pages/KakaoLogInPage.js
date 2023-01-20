import axios from "axios";
import React from "react";
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
    navigate("/user", { state: { userInfo: userInfo } });
  });

  return <div>카카오 로그인중입니다...</div>;
};

export default KakaoLogInPage;
