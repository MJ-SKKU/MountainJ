import Button from "../UI/Button";
import Pay from "./Pay";

const PayList = (props) => {
  const pays = props.pays;
  const payMembers = props.payMembers;
  const originMemberIds = props.originMemberIds;
  const projectId = props.projectId;

  const onClick = () => {
    props.onClick();
  };

  return (
    <div>
      {props.isLoggedIn
        ? !props.isComplete && (
            <Button
              className="w-full h-12 border-none rounded-md bg-lime font-scoredream text-base text-black"
              type="button"
              onClick={onClick}
            >
              <span className="font-medium">결제내역</span>
              <span className="font-light">을 추가해주세요!</span>
            </Button>
          )
        : null}
      <div className="w-full min-h-[96px] max-h-[55vh mt-2 pt-3 border-none rounded-md bg-lightgray overflow-y-scroll">
        {pays.map((pay, idx) => (
          <Pay
            key={idx}
            pay={pay}
            title={pay.title}
            payer_id={pay.payer}
            payMembers={payMembers}
            payMemberIds={originMemberIds}
            price={pay.money}
            projectId={projectId}
          />
        ))}
      </div>
    </div>
  );
};

export default PayList;
