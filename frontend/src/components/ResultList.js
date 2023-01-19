import React, { Fragment } from "react";

const ResultList = () => {
  return (
    <Fragment>
      <div className="w-full pt-4 border-none rounded-md bg-lightgray overflow-y-scroll" style={{ minHeight: "96px", maxHeight: "55vh" }}>
        <div>todo: 정산 결과</div>
      </div>
    </Fragment>
  );
};

export default ResultList;
