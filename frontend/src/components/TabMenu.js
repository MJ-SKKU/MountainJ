import React, { Fragment } from "react";

const TabMenu = ({ id, clickedTabId, content, onClick }) => {
  return (
    <Fragment>
      {id === clickedTabId ? (
        <span
          className="inline-block relative mr-2.5 font-bold leading-loose before:absolute before:bottom-0.5 before:left-0 before:w-full before:h-1 before:rounded before:bg-lime before:opacity-1 before:scale-x-1 before:origin-left before:ease-in-out"
          onClick={onClick}
        >
          {content}
        </span>
      ) : (
        <span
          className="inline-block relative mr-2.5 leading-loose before:absolute before:bottom-0.5 before:left-0 before:w-full before:h-1 before:rounded before:bg-lime before:opacity-0 before:scale-x-0 before:origin-left before:ease-in-out"
          onClick={onClick}
        >
          {content}
        </span>
      )}
    </Fragment>
  );
};

export default TabMenu;
