import { useNavigate } from "react-router-dom";
import axios from "axios";
import {useLocation} from "react-router-dom";


import Result from "./Result";
import Button from "../UI/Button";
import { API } from "../../config";
import {useEffect} from "react";
import {payActions} from "../../store/PayInfo";
import {membersActions} from "../../store/Members";
import {resultsActions} from "../../store/Results";
import {paysActions} from "../../store/Pays";
import {projectActions} from "../../store/ProjectInfo";
import {useSelector} from "react-redux";
import Pay from "../Pay/Pay";

const ResultList = (props) => {
  const navigate = useNavigate();

  const payMemberNames = props.payMemberNames;
  const payMemberIds = props.payMemberIds;

  const members = useSelector((state) => state.membersReducer.memObjects);
  const results = useSelector((state) => state.resultsReducer.results);
  // const results = props.results;


  const onProjectTerminate = async () => {
    const finalProjFormData = new FormData();
    finalProjFormData.append("project_id", props.project.project_id);

    try {
      await axios.patch(`${API.END}`, finalProjFormData);
      navigate("/projects");
    } catch {
      alert("정산 종료 실패");
    }
  };

  return (
    <div>
      {props.isAuth
        ? !props.isComplete && (
            <Button
              className="w-full h-12 border-none rounded-md bg-lime font-scoredream"
              type="button"
              onClick={onProjectTerminate}
            >
              <span className="font-medium">정산 종료</span>
            </Button>
          )
        : null}

      <div className="w-full max-h-[55vh] mt-2 pt-3 border-none rounded-md bg-lightgray overflow-y-scroll">
        {
          results.length == 0 ?
              <div className="w-full text-center pb-3 text-muted">정산 결과가 없습니다.</div>
          :
          results.map((result, idx) => {
          let payerName = "";
          let userName = "";
          console.log(results);
          for (let member of members) {
            console.log(member);
            if(member.member_id == result[0]){
              payerName = member.username;
            }
            if(member.member_id == result[1]){
              userName = member.username;
            }
          }
          // for (let id of payMemberIds) {
          //   if (result[0] === id)
          //     payerName = payMemberNames[id - payMemberIds[0]];
          //   else userName = payMemberNames[id - payMemberIds[0]];
          // }
          return (
            <Result
              key={idx}
              payer={payerName}
              username={userName}
              money={result[2]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ResultList;
