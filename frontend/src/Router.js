import React, { Fragment, useEffect } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";

import LandingPage from "./pages/LandingPage";
import KakaoLogInPage from "./pages/KakaoLogInPage";
import UserPage from "./pages/UserPage";
import ProjectPage from "./pages/ProjectPage";
import Header from "./components/UI/Header";
import Footer from "./components/UI/Footer";
import { pageStatusActions } from "./store/PageStatus";

const Layout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(pageStatusActions.tutOpen(true));
  }, [dispatch]);

  return (
    <Fragment>
      <Header />
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
