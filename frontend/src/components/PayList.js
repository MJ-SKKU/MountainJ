import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Pay from "./Pay";
import { API } from "../config";

const PayList = () => {
  const location = useLocation();
  const projectId = location.state.projectId;

  const [pays, setPays] = useState([]);

  useEffect(() => {
    axios.get(`${API.PAYS}/${projectId}`).then((res) => setPays(res.data));
  }, [projectId]);

  return (
    <Fragment>
      <div className="w-full pt-4 border-none rounded-md bg-lightgray overflow-y-scroll" style={{ minHeight: "96px", maxHeight: "55vh" }}>
        {/* @@todo 결제내역 참여 멤버 리스트(드롭다운)도 넘겨줘야 함 */}
        {pays.map((pay) => (
          <Pay key={pay.pay_id} username={pay.username} money={pay.money} title={pay.title} />
        ))}
      </div>
    </Fragment>
  );
};

export default PayList;
