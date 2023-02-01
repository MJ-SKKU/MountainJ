const Tab = (props) => {
  const basicTabStyle =
    "inline-block relative mr-3 leading-8 before:absolute before:bottom-0.5 before:w-full before:h-1 before:rounded before:bg-lime before:origin-left before:ease-in-out";

  const onClick = () => {
    props.onTabClick();
  };
  return (
    <span
      className={
        basicTabStyle +
        (props.mode
          ? " font-bold before:opacity-1 before:scale-x-1"
          : " before:opacity-0 before:scale-x-0")
      }
      onClick={onClick}
    >
      {props.title}
    </span>
  );
};

export default Tab;
