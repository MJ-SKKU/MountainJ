const Input = (props) => {
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
        type={props.type}
        ref={props.reference}
      />
    </div>
  );
};

export default Input;