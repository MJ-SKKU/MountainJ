import React, { Fragment } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UserPage from "./pages/UserPage";
import ProjectPage from "./pages/ProjectPage";
import Header from "./components/Header";
import Project from "./components/Project";
import PayList from "./components/PayList";
import ResultList from "./components/ResultList";

const Layout = () => {
  return (
    <Fragment>
      <Header />
      <Outlet />
    </Fragment>
  );
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}>
          <Route path=":projectid" element={<Project />} />
        </Route>
        <Route path="/user" element={<Layout />}>
          <Route index element={<UserPage />} />
          <Route path=":projectid" element={<ProjectPage />}>
            <Route index element={<PayList />} />
            <Route path="result" element={<ResultList />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
