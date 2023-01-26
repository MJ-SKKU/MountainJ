import axios from "axios";
import React, {useEffect, useState} from "react";
import { GoThreeBars } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../config";

const Header = ({ isLogIn }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // const userInfo = location.state.userInfo;

  useEffect(() => {
    if(localStorage.getItem("userInfo")==null){
      console.log(location.pathname.split("/").length);
      if(location.pathname.split("/").length ==3 && location.pathname.split("/")[1]=="projects"){
        console.log('...')
      }else{
        console.log(location.pathname.split("/"));
        alert("로그인을 해주세요.");
        navigate("/");
      }
    }
  }, []);

  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")));


  const handleLogoClick = () => {
    navigate("/projects", { state: { userInfo: userInfo } });
  };

  const handleSideBarToggleCLick = () => {
    alert("todo: 사이드바 열기");
  };

  const handleLogInClick = () => {
    alert("todo: 카카오 로그인 API");
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.1.0/kakao.min.js";
    script.async = true;
    // script.integrity = "sha384-dpu02ieKC6NUeKFoGMOKz6102CLEWi9+5RQjWSV0ikYSFFd8M3Wp2reIcquJOemx";
    script.crossorigin="anonymous";
    document.body.appendChild(script);
    return () => document.body.removeChild(script)
  }, []);

  const handleLogOutClick = () => {
    const logOutFormData = new FormData();
    logOutFormData.append("k_id", userInfo.k_id);

    axios.post(`${API.LOGOUT}`, logOutFormData).then((res) => {
      if (res.status === 200) {
        navigate("/");
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
      } else {
        alert("로그아웃 실패");
      }
    });
  };

  return (
    <header className="flex justify-between items-center fixed top-0 right-0 left-0 w-full h-14 px-4 bg-white shadow z-10">
      <div className="text-2xl font-bold" onClick={handleLogoClick}>
        MountainJ
      </div>

      {/* 추후 사이드바 구현 시 토글 아이콘 고려 필요 -> <GoThreeBars size="30" onClick={handleSideBarToggleCLick}></GoThreeBars> */}
      {/* 현재는 비회원 프로세스가 없기 때문에 로그아웃 버튼으로 고정 */}
      {true ? (
        <button className="h-7 px-1.5 rounded-md bg-lime font-scoredream text-base font-light text-white" type="button" onClick={handleLogOutClick}>
          로그아웃
        </button>
      ) : (
        <button className="h-7 px-1.5 rounded-md bg-lime font-scoredream text-base font-light text-white" type="button" onClick={handleLogInClick}>
          로그인
        </button>
      )}
    </header>
  );
};

export default Header;
