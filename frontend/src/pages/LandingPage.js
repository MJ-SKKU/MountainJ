import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";
import KakaoLogInImage from "../assets/images/kakao_login.png";
import { API } from "../config";

const LandingPage = () => {
  return (
    <Fragment>
      <div className="fixed inset-0 w-screen h-screen bg-lime -z-10" />
      <div className="flex flex-col justify-evenly h-screen">
        <div>
          <h1
            className="mb-1 font-scoredream leading-none font-light text-white text-center"
            style={{ fontSize: "36px" }}
          >
            정산을한번에
          </h1>
          <h1
            className="font-scoredream leading-none font-bold text-white text-center mt-5"
            style={{ fontSize: "60px" }}
          >
            마운틴제이
          </h1>
        </div>
        <Outlet />
        <div>
          <a href={API.KAKAO}>
            <img
              className="w-full mb-4"
              src={KakaoLogInImage}
              alt="kakao_login"
            />
          </a>
          {/*<button*/}
          {/*  className="w-full rounded-md bg-white"*/}
          {/*  style={{ aspectRatio: "20/3" }}*/}
          {/*  type="button"*/}
          {/*  onClick={() => {*/}
          {/*    alert("todo: 비회원 정산");*/}
          {/*  }}*/}
          {/*>*/}
          {/*  비회원으로*/}
          {/*</button>*/}
        </div>
      </div>
    </Fragment>
  );
};

export default LandingPage;
