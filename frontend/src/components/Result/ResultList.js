import { useNavigate } from "react-router-dom";
import axios from "axios";

import Result from "./Result";
import Button from "../UI/Button";
import { API } from "../../config";

const ResultList = (props) => {
  const navigate = useNavigate();

  const results = props.results;
  const payMembers = props.payMembers;

  const projTerminateHandler = async () => {
    const finalProjFormData = new FormData();
    finalProjFormData.append("project_id", props.project.project_id);

    try {
      await axios.patch(`${API.END}`, finalProjFormData);
      navigate("/projects", { state: { userInfo: props.user } });
    } catch {
      alert("정산 종료 실패");
    }
  };

  return (
    <div className="w-full min-h-[96px] max-h-[55vh] mb-2 pt-3 border-none rounded-md bg-lightgray overflow-y-scroll">
      {results.map((result, idx) => (
        <Result
          key={idx}
          username={payMembers[idx + 1]}
          money={result[2]}
          payer={payMembers[0]}
        />
      ))}
      {props.isLoggedIn
        ? !props.isComplete && (
            <Button
              className="w-full h-12 border-none rounded-md bg-lime font-scoredream text-base text-black"
              type="button"
              onClick={projTerminateHandler}
            >
              <span className="font-medium">정산 종료</span>
            </Button>
          )
        : null}
    </div>
  );
};

export default ResultList;