import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Project from "./Project";
import { API } from "../config";

const ProjectList = ({ isComplete }) => {
  const location = useLocation();
  const userId = location.state.userId;
  const userObject = location.state.userObject;

  const [user, setUser] = useState({});
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get(`${API.USERS}/${userId}`).then((res) => setUser(res.data));
    axios.get(`${API.PROJECTS}/${userId}`).then((res) => setProjects(res.data));
  }, [userId]);

  /* 완료 여부 filter */
  let filteredProjects = [];
  isComplete
    ? (filteredProjects = projects.filter((project) => project.status === 1))
    : (filteredProjects = projects.filter((project) => project.status === 0));

  return (
    <div className="flex w-full p-3 border-none rounded-md bg-lightgray overflow-x-scroll" style={{ minHeight: "185px" }}>
      {filteredProjects.map((project) => (
        <Project
          key={project.project_id}
          userName={user.k_name}
          projectId={project.project_id}
          date={project.date}
          isComplete={project.isComplete}
          title={project.title}
          ownername={project.owner}
          memberCount={project.memberCount}
          endDate={project.endDate}
        />
      ))}
    </div>
  );
};

export default ProjectList;
