import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import Pay from "./Pay";
import { API } from "../config";

const PayList = ({ projectInfo }) => {
  const [pays, setPays] = useState([]);

  useEffect(() => {
    axios.get(`${API.PAYS}/${projectInfo.project_id}`).then((res) => setPays(res.data));
  }, [projectInfo.project_id]);

  return (
    <Fragment>
      <div className="w-full pt-4 border-none rounded-md bg-lightgray overflow-y-scroll" style={{ minHeight: "96px", maxHeight: "55vh" }}>
        {pays.map((pay) => (
          <Pay key={pay.pay_id} username={pay.username} money={pay.money} title={pay.title} />
        ))}
      </div>
    </Fragment>
  );
};

export default PayList;
