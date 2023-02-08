import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { projectsActions } from "../../store/Projects";
import Project from "./Project";
import { API } from "../../config";

const ProjectList = (props) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.userReducer.userObj);
  const projects = useSelector((state) => state.projectsReducer.projects);

  useEffect(() => {
    axios.get(`${API.PROJECTS}/${user.id}`).then((res) => {
      dispatch(projectsActions.loadProjects(res.data));
    });
  }, [user, dispatch]);

  const filteredProjects = props.isComplete
    ? projects.filter((project) => project.status === 1)
    : projects.filter((project) => project.status === 0);

  const info = !props.isComplete ? (
      <div className="flex justify-between">
        <div className="mb-1.5">
          현재 <span className="font-semibold text-red">진행중</span>인 정산이에요!
        </div>
        <div>({filteredProjects.length})</div>
      </div>
  ) : (
      <div className="flex justify-between">
        <div className="mb-1.5">
          이미 <span className="font-semibold text-green">완료</span>된 정산이에요!
        </div>
        <div>({filteredProjects.length})</div>
      </div>
  );

  return (
    <div className="mb-7">
      {info}
      <div className="flex w-full min-h-[185px] p-3 border-none rounded-md bg-lightgray overflow-x-auto">
        {filteredProjects.map((project, idx) => (
          <Project key={idx} projectInfo={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
