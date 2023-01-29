import { Fragment } from "react";

const Button = (props) => {
  const onClickHandler = () => {
    props.onClick();
  };

  const btnMent = props.btnTitle.includes("새로운 정산") ? (
    <Fragment>
      <span className="font-medium">새로운 정산</span>
      <span className="font-light">을 생성해보세요!</span>
    </Fragment>
  ) : (
    props.btnTitle
  );

  return (
    <button
      className={props.className}
      type={props.type}
      onClick={onClickHandler}
    >
      {btnMent}
    </button>
  );
};

export default Button;
