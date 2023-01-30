import ReactDOM from "react-dom";
import { IoCloseOutline } from "react-icons/io5";

const Backdrop = (props) => {
  return (
    <div
      className="absolute inset-0 bg-stone-600/[.47] z-30"
      onClick={props.onClick}
    />
  );
};

const ModalOverlay = (props) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[360px] min-h-[420px] flex flex-col w-11/12 p-4 rounded-md bg-white z-40">
      <IoCloseOutline
        className="absolute right-4"
        size="24"
        onClick={props.onClose}
      />
      <div className="flex flex-col items-center mt-6">
        <h1 className="mb-5 text-3xl font-medim">{props.title}</h1>
        {props.children}
      </div>
    </div>
  );
};

const portalElement = document.getElementById("overlays");

const Modal = (props) => {
  return (
    <div className="relative flex flex-col justify-center items-center fixed inset-0">
      {ReactDOM.createPortal(
        <Backdrop onClick={props.onClose} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          title={props.title}
          onClose={props.onClose}
          onSubmit={props.onSubmit}
        >
          {props.children}
        </ModalOverlay>,
        portalElement
      )}
    </div>
  );
};

export default Modal;
