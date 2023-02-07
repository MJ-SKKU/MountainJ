import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { userActions } from "../../store/User";
import { API } from "../../config";

const Header = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const userObj = useSelector((state) => state.userReducer.userObj);
  const isAuth = useSelector((state) => state.userReducer.isAuthenticated);

  const onLogoClick = () => {
    navigate("/projects");
  };

  const onLogInClick = () => {
    navigate("/");
  };

  const handleLogOutClick = async () => {
    const logOutFormData = new FormData();
    logOutFormData.append("k_id", userObj.k_id);

    try {
      await axios.post(`${API.LOGOUT}`, logOutFormData);
      dispatch(userActions.logout());
      navigate("/");
    } catch {
      alert("로그아웃 실패");
    }
  };

  return (
    <header className="flex justify-between items-center fixed top-0 right-0 left-0 w-full h-14 px-4 bg-white shadow z-50">
      <div className="text-2xl font-bold cursor-pointer" onClick={onLogoClick}>
        MountainJ
      </div>
      {/* 추후 사이드바 구현 시 토글 아이콘 고려 -> <GoThreeBars size="30" onClick={handleSideBarToggleCLick}></GoThreeBars> */}
      {/* 현재는 비회원 프로세스가 없기 때문에 로그아웃 버튼으로 고정 */}
      {isAuth ? (
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
  );
};

export default Header;
