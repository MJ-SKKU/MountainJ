import React, {useEffect, useState} from "react";
import { FiChevronDown } from "react-icons/fi";
import UserProfile from "./UserProfile";
import axios from "axios";
import {API} from "../config";





const Pay = ({ members, payer_id, money, title, pay_id }) => {

    const [paymembers, setPayMembers] = useState([]);
    // 수정: 이부분 계속 호출됨.
    // axios.get(`${API.PAYMEMBERS}/${pay_id}`).then((res) => {
    //     console.log('hi');
    //   setPayMembers([...res.data]);
    // });


    const MemberListDropDownIconClick = () => {
        alert("todo: 결제 내역 참여자 드롭다운");
    };
    let username;

    for (let member of members){
        if (member.member_id==payer_id){
            username = member.username;
        }
    }
  return (
    <div className="d-flex flex-column mb-3">
        <div className="flex justify-between mx-auto items-center w-11/12 pt-3 px-5 pb-2.5 border-none rounded-md bg-white shadow">
          <UserProfile username={username} />
          <div className="flex flex-col justify-evenly items-center">
            <span className="text-lg font-semibold">{money}원</span>
            <span>{title}</span>
          </div>
          <FiChevronDown size="24" onClick={MemberListDropDownIconClick} />
        </div>
        <div className="flex justify-between mx-auto items-center w-11/12   pb-2.5 border-none bg-none">
            <div className="flex justify-between mx-auto items-center w-11/12 pt-3 pl-5 pb-2.5 pr-3 border  bg-white shadow overflow-x-scroll">
                <div className="flex pr-3">
                    참여자
                </div>
                {paymembers.map((member) => {
                    // console.log('.');
                    // console.log(member);
                    return (
                        <div key={member.member_id} className="flex">
                            <UserProfile username={member.username}/>
                            <div className="mr-5"/>
                        </div>
                    );
                })
                }
            </div>
        </div>
    </div>
  );
};

export default Pay;
