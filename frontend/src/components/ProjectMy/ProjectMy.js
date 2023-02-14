import axios from "axios";

import Button from "../UI/Button";
import { API } from "../../config";

import { useDispatch, useSelector } from "react-redux";
import { projectsActions } from "../../store/Projects";
import { projectActions } from "../../store/ProjectInfo";
import { useEffect, useState } from "react";
import { membersActions } from "../../store/Members";
import { resultsActions } from "../../store/Results";

function makeMemberDisplay(members) {
  let memList = [];
  if (members) {
    for (let member of members) {
      memList.push(member.username);
    }
  }
  let member_disp = "";
  let etcCount = 0;
  for (let idx in memList) {
    if (member_disp.length < 10) {
      if (member_disp.length !== 0) {
        member_disp += ", ";
      }
      member_disp += `${memList[idx]}`;
    } else {
      etcCount += 1;
    }
  }
  if (etcCount > 0) {
    member_disp += ` 외 ${etcCount}명`;
  }
  return member_disp;
}

const ProjectMy = (props) => {
  const dispatch = useDispatch();

  const members = useSelector((state) => state.membersReducer.memObjects);
  const results = useSelector((state) => state.resultsReducer.results);
  // const results = props.results;

  const [myParticipate, setMyParticipate] = useState([]);
  const [myPay, setMyPay] = useState([]);
  const [myTotal, setMyTotal] = useState("");

  const [isSender, setIsSender] = useState(true);
  const [sendingList, setSendingList] = useState([]);

  const [payMembersDict, setPayMembersDict] = useState({});

  useEffect(() => {
    // console.log('hi');
    axios.get(`${API.RESULTS}/${props.project.project_id}`).then((res) => {
      const member_detail = res.data.members_detail[props.userMember.member_id];
      // console.log(member_detail.participate_pay);
      setMyParticipate(member_detail.participate_pay);
      // console.log(member_detail.payed_pay);
      setMyPay(member_detail.payed_pay);
      // console.log(member_detail.total);
      setMyTotal(parseInt(member_detail.total));
    });
    // console.log('bye');
  }, [props]);
  useEffect(() => {
    let tmpPayMembersDict = { ...payMembersDict };
    for (const temp of myParticipate) {
      const pay_id = temp[0];
      console.log(pay_id);
      if (!tmpPayMembersDict[pay_id]) {
        axios.get(`${API.PAYMEMBERS}/${pay_id}`).then((res) => {
          // console.log('pay_id');
          console.log(pay_id);
          // console.log(res.data);

          tmpPayMembersDict[pay_id] = makeMemberDisplay(res.data);
          console.log(tmpPayMembersDict[pay_id] );
          console.log(tmpPayMembersDict );
          temp.push(makeMemberDisplay(res.data));
        });
      }
    }
    setPayMembersDict(tmpPayMembersDict);
    for (const temp of myPay) {
      const pay_id = temp[0];
      if (!tmpPayMembersDict[pay_id]) {
        axios.get(`${API.PAYMEMBERS}/${pay_id}`).then((res) => {
          // console.log('pay_id');
          console.log(pay_id);
          // console.log(res.data);
          tmpPayMembersDict[pay_id] = makeMemberDisplay(res.data);
          console.log(tmpPayMembersDict[pay_id] );
          console.log(tmpPayMembersDict );
        });
      }
    }
    // console.log(tmpPayMembersDict);
    setPayMembersDict(tmpPayMembersDict);
  }, [myParticipate, myPay]);

  useEffect(()=>{console.log(payMembersDict)},[payMembersDict])

  return (
    <div className="mb-16">
      <div className="w-full max-h-[55vh] mt-2 pt-3 pb-3 border-none rounded-md bg-lightgray overflow-y-auto">
        {myParticipate.length === 0 && myPay.length === 0 ? (
          <div className="w-full text-center pb-3 text-muted">
            정산결과가 없습니다.
          </div>
        ) : (
          <div className="bg-white mx-5 rounded-md pb-2">
            {myPay.map((content, idx) => (
              <div
                className="h-full flex justify-between border-bottom bg-white px-3 pb-3 rounded-md "
                style={{
                  height: `100%`,
                  paddingTop: `8px`,
                  borderBottom: `solid 2px #D9D9D9`,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              >
                <div
                  className="h-full flex flex-column justify-center align-center"
                  style={{
                    flexDirection: "column",
                    height: `50px`,
                    // border: `1px solid black`,
                  }}
                >
                  <div style={{ border: ``, fontWeight: `bold` }}>
                    {content[1]}
                  </div>
                  <div style={{ fontSize: `12px`, paddingTop: `1px` }}>
                    {payMembersDict[content[0]]}
                  </div>
                </div>
                <div
                  className="h-full flex flex-column justify-center align-center"
                  style={{
                    flexDirection: "column",
                    height: `50px`,
                    // border: `1px solid black`,
                  }}
                >
                  <div style={{ border: ``, color: `#4B8CF7` }}>
                    + {content[2]}원
                  </div>
                </div>
              </div>
            ))}
            {myParticipate.map((content, idx) => (
              <div
                className="h-full flex justify-between border-bottom bg-white px-3 pb-3 rounded-md "
                style={{
                  height: `100%`,
                  paddingTop: `8px`,
                  borderBottom: `solid 2px #D9D9D9`,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              >
                <div
                  className="h-full flex flex-column justify-center align-center"
                  style={{
                    flexDirection: "column",
                    height: `50px`,
                    border: ``,
                  }}
                >
                  <div style={{ border: ``, fontWeight: `bold` }}>
                    {content[1]}
                  </div>
                  <div style={{ fontSize: `12px`, paddingTop: `1px` }}>
                    {payMembersDict[content[0]]}
                    {/*{payMembersDict[266]}*/}
                    {/*..*/}
                    {/*{content[3]}*/}
                  </div>
                </div>
                <div
                  className="h-full flex flex-column justify-center align-center"
                  style={{
                    flexDirection: "column",
                    height: `50px`,
                    // border: `1px solid black`,
                  }}
                >
                  <div style={{ border: ``, color: `#FF5146` }}>
                    - {content[2]}원
                  </div>
                </div>
              </div>
            ))}
            <div
              className="h-full flex justify-between border-bottom bg-white px-3 pb-3 rounded-md "
              style={{
                height: `100%`,
                paddingTop: `8px`,
              }}
            >
              <div
                className="h-full flex flex-column justify-center align-center"
                style={{
                  flexDirection: "column",
                  height: `50px`,
                  border: ``,
                }}
              >
                <div className="pt-3" style={{ fontWeight: `bold` }}>
                  총 정산금액
                </div>
              </div>
              <div
                className="h-full flex flex-column justify-center align-center"
                style={{
                  flexDirection: "column",
                  height: `50px`,
                  border: ``,
                }}
              >
                <div className="pt-3" style={{ fontWeight: `bold` }}>
                  {myTotal > 0 ? "+ " : "- "}
                  {Math.abs(myTotal)}원
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectMy;
