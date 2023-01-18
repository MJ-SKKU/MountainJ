import React from "react";
import { Outlet } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";

const Modal = ({ setIsModalOpen }) => {
  const handleCloseIconClick = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col justify-center items-center fixed inset-0 z-20">
      <div className="absolute inset-0" style={{ background: "rgba(11, 19, 30, 0.37)" }} />
      <div className="flex flex-col w-11/12 p-4 rounded-md bg-white z-10" style={{ maxWidth: "360px", minHeight: "420px" }}>
        <div className="flex justify-end">
          <IoCloseOutline size="24" onClick={handleCloseIconClick} />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Modal;
