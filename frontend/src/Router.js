import React, { Fragment, useEffect } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import KakaoLogInPage from "./pages/KakaoLogInPage";
import UserPage from "./pages/UserPage";
import ProjectPage from "./pages/ProjectPage";
import Header from "./components/UI/Header";
import Footer from "./components/UI/Footer";
import Project from "./components/Project/Project";
import { useDispatch, useSelector } from "react-redux";
import { FiCheck, FiX } from "react-icons/fi";
import { payActions } from "./store/PayInfo";
import { pageStatusActions } from "./store/PageStatus";

const Layout = () => {
  const dispatch = useDispatch();
  const isModalsOpen = useSelector(
    (state) => state.pageStatusReducer.isModalOpen
  );

  const tutOpen = useSelector((state) => state.pageStatusReducer.tutOpen);
  const closeTut = () => {
    console.log("hihihihi");
    dispatch(pageStatusActions.tutOpen(false));
  };
  const toForm = () => {
    window.location="https://forms.gle/f4M4gatsZNfuBAnz6";
  };
  useEffect(() => {
    console.log("hihihi");
  }, [tutOpen]);
  useEffect(() => {
    dispatch(pageStatusActions.tutOpen(true));
  }, []);
  return (
    <Fragment>
      <Header />
      {/*header 크기 만큼 */}
      <div style={{ height: `56px` }}></div>
      {/*이벤트 banner*/}
      {!isModalsOpen && (
        <div>
          <div
            className="fixed right-0 left-0 w-full   shadow z-50"
            style={{ top: `46px`, fontSize: "0.5em" }}
          >
            {" "}
            {tutOpen && (
              <div
                className="flex justify-between items-center  shadow px-4 bg-lime"
                style={{ height: `80px`, fontSize: "1em" }}
              >
                <div className="text-center">
                  <b>
                    [마운틴제이] <br /> 사용방법
                  </b>
                </div>
                <div className="flex mr-2">
                  1. 정산을 생성하세요. <br />
                  2. [결제내역] 탭에서을 결제내역을 추가하세요. <br />
                  3. 하단에 [공유하기] 버튼을 눌러 친구들과 함께해보세요. <br />
                  4. [정산결과] 탭에서 최소 송금횟수로 정산해보세요!
                </div>
                <div style={{ display: `absolute`, top: `0`, right: `0` }}>
                  <FiX onClick={closeTut} size="15" />
                </div>
              </div>
            )}
            {tutOpen ? (
              <div
                className="bg-white text-center pt-3"
                style={{ height: `60px`, fontSize: "1rem", backgroundColor:`#E4E5E7` }}
                onClick={toForm}
              >
                <p>
                  <b>설문조사</b>하고, <b>이벤트 참여</b>하러가기! 💸
                </p>

                <p style={{fontSize:`0.5em`}}>스타벅스 아메리카노 / 올리브영 1만원권</p>

              </div>
            ) : (
              <div
                className="bg-white text-center"
                style={{ height: `100px`, fontSize: "18px",paddingTop:`25px`,backgroundColor:`#D0DA59` }}
                onClick={toForm}
              >
                <b>설문조사</b>하고, <b>이벤트 참여</b>하러가기! 💸
                <br/>
                <p style={{fontSize:`0.5em`}}>정산을 공유하고 설문에 참여하면 스타벅스 아메리카노 쿠폰을,
                </p>
                <p style={{fontSize:`0.5em`}}>
                  설문을 열심히 작성해주신 20분에게는 올리브영 상품권을 드려요!
                </p>
              </div>
            )}
          </div>

          {/*banner 크기만큼*/}
          {tutOpen ? (
            <div style={{ height: `140px` }}></div>
          ) : (
            <div style={{ height: `100px` }}></div>
          )}
        </div>
      )}

      <Outlet />
      <Footer />
    </Fragment>
  );
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/kakao/login" element={<KakaoLogInPage />} />
        <Route path="/projects" element={<Layout />}>
          <Route index element={<UserPage />} />
          <Route path=":projectid" element={<ProjectPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
