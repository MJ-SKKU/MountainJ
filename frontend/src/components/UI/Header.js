import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { userActions } from "../../store/User";
import { API } from "../../config";
import { useEffect } from "react";
import { projectActions } from "../../store/ProjectInfo";
import { membersActions } from "../../store/Members";
import { paysActions } from "../../store/Pays";
import { payActions } from "../../store/PayInfo";
import { resultsActions } from "../../store/Results";
import { pageStatusActions } from "../../store/PageStatus";

const Header = () => {
  const location = useLocation();

  const user = useSelector((state) => state.userReducer.userObj);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.1.0/kakao.min.js";
    script.async = true;
    // script.integrity = "sha384-dpu02ieKC6NUeKFoGMOKz6102CLEWi9+5RQjWSV0ikYSFFd8M3Wp2reIcquJOemx";
    script.crossorigin = "anonymous";
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const userObj = useSelector((state) => state.userReducer.userObj);
  const isAuth = useSelector((state) => state.userReducer.isAuthenticated);

  const onLogoClick = () => {
    window.location.replace("/projects");
  };

  const onLogInClick = () => {
    console.log(location.pathname);
    dispatch(pageStatusActions.setLatestURL(location.pathname));
    dispatch(pageStatusActions.setUsing(true));
    window.location.href = API.KAKAO;
    // navigate("/");
  };

  const handleLogOutClick = async () => {
    const logOutFormData = new FormData();
    logOutFormData.append("k_id", userObj.k_id);

    dispatch(userActions.logout());
    dispatch(projectActions.unsetProject());
    dispatch(membersActions.unloadMembers());
    dispatch(paysActions.unloadPays());
    dispatch(payActions.unsetPay());
    dispatch(resultsActions.unloadResults());

    try {
      await axios.post(`${API.LOGOUT}`, logOutFormData);
      dispatch(userActions.logout());
      dispatch(projectActions.unsetProject());
      dispatch(membersActions.unloadMembers());
      dispatch(paysActions.unloadPays());
      dispatch(payActions.unsetPay());
      dispatch(resultsActions.unloadResults());
      navigate("/");
    } catch {
      navigate("/");
      //alert("로그아웃 실패");
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center fixed top-0 right-0 left-0 w-full h-14 px-4 bg-white shadow z-50">
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={onLogoClick}
        >
          MountainJ
        </div>
        {/* 추후 사이드바 구현 시 토글 아이콘 고려 -> <GoThreeBars size="30" onClick={handleSideBarToggleCLick}></GoThreeBars> */}
        {/* 현재는 비회원 프로세스가 없기 때문에 로그아웃 버튼으로 고정 */}
        {user != undefined &&
        JSON.stringify({}) != JSON.stringify(user) &&
        isAuth ? (
          <button
            className="h-7 px-2 pt-0.5 rounded-md bg-lime font-scoredream font-light text-white"
            type="button"
            onClick={handleLogOutClick}
          >
            로그아웃
          </button>
        ) : (
          <button
            className="h-7 px-2 pt-0.5 rounded-md bg-lime font-scoredream font-light text-white"
            type="button"
            onClick={onLogInClick}
          >
            로그인
          </button>
        )}
      </header>
      {/*<div className="flex justify-between items-center fixed top-50 right-0 left-0 w-full h-14 px-4 bg-white shadow z-50">*/}

      {/*  어ㅏㅓㅁ이ㅏ런ㅁ;이ㅏ럼;니ㅏ</div>*/}
    </div>
  );
};

export default Header;
