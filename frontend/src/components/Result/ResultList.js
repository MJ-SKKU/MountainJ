import axios from "axios";
import { useEffect, useState } from "react";
import Result from "./Result";
import Button from "../UI/Button";
import { API } from "../../config";

import { useDispatch, useSelector } from "react-redux";
import { projectsActions } from "../../store/Projects";
import { projectActions } from "../../store/ProjectInfo";

const ResultList = (props) => {
  const dispatch = useDispatch();

  const project = props.project;

  const members = useSelector((state) => state.membersReducer.memObjects);
  // const results = useSelector((state) => state.resultsReducer.results);

  const [sortedResults, setSortedResults] = useState([]);
  const [resTemp, setResTemp] = useState([]);
  const [sender, setSender] = useState({});
  const [receiver, setReceiver] = useState({});
  const [results, setResults] = useState([]);

  // 본인 포함된 것 먼저 정렬하도록 변경하기.

  useEffect(() => {
    axios.get(`${API.RESULTS}/${props.project.project_id}`).then((res) => {
      setResults(res.data.project_result);
      console.log(res.data.project_result);
    });
  }, []);

  // projectid 고쳐졌을때 다시
  useEffect(() => {
    let tmp = [];
    let tempResults = [];

    results.map((e, i) => {
      console.log(e);
      if (props.userMember && props.userMember.member_id) {
        if (
          e[0] === props.userMember.member_id ||
          e[1] == props.userMember.member_id
        ) {
          tempResults.unshift(e);
          console.log("hi");
        } else {
          tmp.unshift(e);
          console.log("b");
        }
      } else {
        tmp.unshift(e);
      }
    });
    setResTemp(tmp);
    setSortedResults(tempResults);
  }, [props, results]);

  const onProjectTerminate = async () => {
    const finalProjFormData = new FormData();
    finalProjFormData.append("project_id", props.project.project_id);

    try {
      await axios.patch(`${API.END}`, finalProjFormData);
      dispatch(projectsActions.needUpdate());
      dispatch(projectActions.needUpdate());
    } catch {
      console.log("정산 종료 실패");
    }
  };
  const onProjectRecovery = async () => {
    const finalProjFormData = new FormData();
    finalProjFormData.append("project_id", props.project.project_id);

    try {
      await axios.patch(`${API.RECOVER}`, finalProjFormData);
      dispatch(projectsActions.needUpdate());
      dispatch(projectActions.needUpdate());
      // navigate("/projects");
    } catch {
      console.log("정산 종료 취소 실패");
    }
  };

  return (
    <div className="mb-16">
      {props.isAuth && props.userMember !== null ? (
        !project.status ? (
          <Button
            className="w-full h-12 border-none rounded-md bg-lime font-scoredream"
            type="button"
            onClick={onProjectTerminate}
          >
            <span className="font-medium">정산 종료</span>
          </Button>
        ) : (
          <Button
            className="w-full h-12 border-none rounded-md bg-lime font-scoredream"
            type="button"
            onClick={onProjectRecovery}
          >
            <span className="font-medium">정산 종료 취소</span>
          </Button>
        )
      ) : null}

      <div className="w-full max-h-[55vh] mt-2 pt-3 border-none rounded-md bg-lightgray overflow-y-auto">
        {sortedResults.length === 0 && resTemp.length === 0 ? (
          <div className="w-full text-center pb-3 text-muted">
            정산결과가 없습니다.
          </div>
        ) : (
          sortedResults.map((result, idx) => {
            return (
              <Result
                key={idx}
                // payer={payerName}
                myName={props.userMember ? props.userMember.username : null}
                receiver_id={result[1]}
                sender_id={result[0]}
                // username={userName}
                money={result[2]}
              />
            );
          })
        )}
        {resTemp.map((result, idx) => {
          return (
            <Result
              key={idx}
              // payer={payerName}
              myName={props.userMember ? props.userMember.username : null}
              receiver_id={result[1]}
              sender_id={result[0]}
              // username={userName}
              money={result[2]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ResultList;
