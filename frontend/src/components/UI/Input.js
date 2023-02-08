import moment from "moment";

const Input = (props) => {
  const inputChangeHandler = (e) => {
    props.onChange(e.target.value);
  };

  let placeholder = "";
  if (props.title === "정산명*") {
    placeholder = moment().lang("ko").format("정산 MMDDHHSS").toString();
  }

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
      <label htmlFor={props.htmlFor} className="text-md tracking-tight">
        {label}
      </label>
      <input
        placeholder={placeholder}
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
