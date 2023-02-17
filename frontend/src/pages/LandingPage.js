import { useEffect, Fragment } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import KakaoLogInImage from "../assets/images/kakao_login.png";
import { API } from "../config";
import { pageStatusActions } from "../store/PageStatus";

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.userReducer.userObj);

  useEffect(() => {
    // console.log("!!!!!!!!!!!!")
    // console.log(user.id);
    if (user !== undefined && user.id !== undefined) {
      navigate("/projects");
      return;
    }
  });

  const onLogInClick = () => {
    // console.log(location.pathname);
    // dispatch(pageStatusActions.setLatestURL(location.pathname));
    dispatch(pageStatusActions.setUsing(false));
    window.location.href = API.KAKAO;
    // navigate("/");
  };

  return (
    <Fragment>
      <div className="fixed inset-0 w-screen h-screen bg-lime -z-10" />
      <div className="flex flex-col justify-evenly h-screen">
        <div>
          <h1 className="mb-1 font-scoredream text-[36px] leading-none font-light text-white text-center">
            정산을한번에
          </h1>
          <h1 className="font-scoredream text-[60px] leading-none font-bold text-white text-center mt-5">
            마운틴제이
          </h1>
        </div>
        <Outlet />
        <div>
          <button onClick={onLogInClick}>
            <img
              className="w-full mb-4"
              src={KakaoLogInImage}
              alt="kakao_login"
            />
          </button>
          {/* <button
            className="w-full rounded-md bg-white aspect-[20/3"
            type="button"
            onClick={() => {}}
          >
            비회원으로
          </button> */}
        </div>
      </div>
    </Fragment>
  );
};

export default LandingPage;
