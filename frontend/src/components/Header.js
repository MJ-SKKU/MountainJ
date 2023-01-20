import React from "react";
import { GoThreeBars } from "react-icons/go";

const Header = ({ isLogIn }) => {
  const handleLogoClick = () => {
    // ProjectPage에서 MemberPage로 돌아가는 경우에만 사용될 것 같은데.. ProjectPage에서는 뒤로가기 아이콘으로 변경?
    alert("todo: 유저페이지로 이동");
  };

  const handleSideBarToggleCLick = () => {
    alert("todo: 사이드바 열기");
  };

  const handleLogInClick = () => {
    alert("todo: 카카오 로그인 API");
  };

  return (
    <header className="flex justify-between items-center fixed top-0 right-0 left-0 w-full h-14 px-4 bg-white shadow z-10">
      <div className="text-2xl font-bold" onClick={handleLogoClick}>
        MountainJ
      </div>

      {/* 추후 사이드바 구현 시 토글 아이콘 고려 필요 -> <GoThreeBars size="30" onClick={handleSideBarToggleCLick}></GoThreeBars> */}
      {/* 현재는 비회원 프로세스가 없기 때문에 로그아웃 버튼으로 고정 */}
      {true ? (
        <button className="h-7 px-1.5 rounded-md bg-lime font-scoredream text-base font-light text-white" type="button" onClick={handleLogInClick}>
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
