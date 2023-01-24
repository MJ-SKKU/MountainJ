import React, {useEffect, useState} from "react";
import { FiChevronDown, FiTrash } from "react-icons/fi";
import UserProfile from "./UserProfile";
import axios from "axios";
import {API} from "../config";

const Pay = ({ members, payer_id, money, title, pay_id }) => {

    const [paymembers, setPayMembers] = useState([]);
    useEffect(() => {
        axios.get(`${API.PAYMEMBERS}/${pay_id}`).then((res) => setPayMembers([...res.data]));
    }, [])

    const PayListAccordionIconClick = () => {
        alert("todo: 결제 내역 참여자 아코디언");
    };

    const PayDeleteClick = () => {
        axios.delete(`${API.PAY}/${pay_id}`).then((res) => {
            // todo: 새로고침 개선 필요
            window.location.reload();
        });
    }

    let username;

    for (let member of members){
        if (member.member_id==payer_id){
            username = member.username;
        }
    }
  return (
    <div className="flex flex-col mb-3">
        <div className="flex justify-between mx-auto items-center w-11/12 pt-3 px-5 pb-2.5 border-none rounded-md bg-white shadow z-40">
          <UserProfile username={username} />
          <div className="flex flex-col justify-evenly items-center">
            <span className="text-lg font-semibold">{money}원</span>
            <span>{title}</span>
          </div>
        <FiChevronDown size="24" onClick={PayListAccordionIconClick} />
        </div>
        <div className="flex justify-between mx-auto items-center w-11/12 pb-2.5 border-none bg-none z-30">
            <div className="flex flex-col w-full border bg-white shadow">
                <div className="flex justify-between mx-auto items-center w-full -m-1 pt-4 pl-5 pb-2.5 pr-3 overflow-x-auto">
                    <div className="flex pr-3">
                        참여자
                    </div>
                    {paymembers.map((member) => {
                        return (
                            <div key={member.member_id} className="flex">
                                <UserProfile username={member.username}/>
                                <div className="mr-5"/>
                            </div>
                        );
                    })
                    }
                </div>
                <div className="mx-auto mb-2">
                    <FiTrash size="12" onClick={PayDeleteClick} />
                </div>
            </div>
        </div>
    </div>
  );
};

export default Pay;
