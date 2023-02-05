const Button = (props) => {
  const onClick = () => {
    props.onClick();
  };

  return (
    <button className={props.className} type={props.type} onClick={onClick}>
      {props.children}
    </button>
  );
};

export default Button;
