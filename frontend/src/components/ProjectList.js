import axios from "axios";
import React, { useEffect, useState } from "react";
import Project from "./Project";
import { API } from "../config";

const ProjectList = ({ userInfo, isComplete }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get(`${API.PROJECTS}/${userInfo.id}`).then((res) => setProjects(res.data));
  }, [userInfo.id]);

  let filteredProjects = [];
  isComplete
    ? (filteredProjects = projects.filter((project) => project.status === 1))
    : (filteredProjects = projects.filter((project) => project.status === 0));

  return (
    <div className="flex w-full p-3 border-none rounded-md bg-lightgray overflow-x-auto" style={{ minHeight: "185px" }}>
      {filteredProjects.map((project) => (
        <Project key={project.project_id} userInfo={userInfo} projectInfo={project} />
      ))}
    </div>
  );
};

export default ProjectList;
