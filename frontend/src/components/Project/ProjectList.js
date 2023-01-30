import React, { useEffect, useState } from "react";
import axios from "axios";

import Project from "./Project";
import { API } from "../../config";

const ProjectList = (props) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get(`${API.PROJECTS}/${props.userInfo.id}`)
      .then((res) => setProjects(res.data));
  }, [props.userInfo.id]);

  const filteredProjects = props.isComplete
    ? projects.filter((project) => project.status === 1)
    : projects.filter((project) => project.status === 0);

  const ment = !props.isComplete ? (
    <div className="mb-1.5">
      현재 <span className="font-semibold text-red">진행중</span>인 정산이에요!
    </div>
  ) : (
    <div className="mb-1.5">
      이미 <span className="font-semibold text-green">완료</span>된 정산이에요!
    </div>
  );

  return (
    <div className="mb-7">
      {ment}
      <div className="flex w-full min-h-[185px] p-3 border-none rounded-md bg-lightgray overflow-x-auto">
        {filteredProjects.map((project) => (
          <Project
            key={project.project_id}
            userInfo={props.userInfo}
            projectInfo={project}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
