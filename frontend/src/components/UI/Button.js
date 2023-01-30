const Button = (props) => {
  const onClickHandler = () => {
    if (props.onClick) {
      props.onClick();
    }
  };

  return (
    <button
      className={props.className}
      type={props.type}
      onClick={onClickHandler}
    >
      {props.children}
    </button>
  );
};

export default Button;
