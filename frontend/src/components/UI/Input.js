const Input = (props) => {
  const inputChangeHandler = (e) => {
    props.onChange(e.target.value);
  };

  const label = props.title.includes("*") ? (
    <span>
      {props.title.split("*")[0]}
      <span className="pl-0.5 text-red">*</span>
    </span>
  ) : (
    <span>{props.title}</span>
  );

  return (
    <div className={props.divClass}>
      <label htmlFor={props.htmlFor} className={props.labelClass}>
        {label}
      </label>
      <input
        id={props.htmlFor}
        className={props.inputClass}
        type="text"
        value={props.value}
        onChange={inputChangeHandler}
      />
    </div>
  );
};

export default Input;
