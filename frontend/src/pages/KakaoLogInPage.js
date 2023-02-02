import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

import { userActions } from "../store/User";
import { API } from "../config";

const KakaoLogInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const params = new URL(window.location.href).searchParams;
  const authCode = params.get("code");

  const authCodeformData = new FormData();
  authCodeformData.append("code", authCode);

  axios.post(`${API.LOGIN}`, authCodeformData).then((res) => {
    const user = res.data.user;
    const token = res.data.token;
    localStorage.setItem("token", token);
    localStorage.setItem("userInfo", JSON.stringify(user));
    dispatch(userActions.login({ user, token }));
    navigate("/projects");
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
