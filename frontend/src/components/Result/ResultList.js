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
  const results = useSelector((state) => state.resultsReducer.results);

  const [sortedResults, setSortedResults] = useState([...results]);

  // 본인 포함된 것 먼저 정렬하도록 변경하기.
  // projectid 고쳐졌을때 다시
  useEffect(() => {
    if (results) {
      // let sortedResults = [...results];
      let tempResults = [...results];

      results.map((e, i) => {
        // console.log(i);
        tempResults.splice(i, 1);
        tempResults.unshift(e);
        // console.log(e);
      });
      setSortedResults(tempResults);
    }
  }, [results, props]);

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
        {results.length === 0 ? (
          <div className="w-full text-center pb-3 text-muted">
            정산결과가 없습니다.
          </div>
        ) : (
          sortedResults.map((result, idx) => {
            let Receiver;
            let Sender ;

            let payerName = "";
            let userName = "";
            for (let member of members) {
              if (member.member_id === result[0]) {
                payerName = member.username;
                Receiver=member;
              }
              if (member.member_id === result[1]) {
                userName = member.username;
                Sender=member;
              }
            }

            return (
              <Result
                key={idx}
                payer={payerName}
                myName={props.userMember ? props.userMember.username : null}
                Receiver={Receiver}
                Sender={Sender}
                username={userName}
                money={result[2]}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ResultList;
