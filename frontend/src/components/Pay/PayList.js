import Button from "../UI/Button";
import Pay from "./Pay";

const PayList = (props) => {
  return (
    <div>
      {props.isAuth
        ? !props.isComplete && (
            <Button
              className="w-full h-12 border-none rounded-md bg-lime font-scoredream"
              type="button"
              onClick={props.onClick}
            >
              <span className="font-medium">결제내역</span>
              <span className="font-light">을 추가해주세요!</span>
            </Button>
          )
        : null}
      <div className="w-full max-h-[55vh mt-2 pt-3 border-none rounded-md bg-lightgray overflow-y-scroll">
        {
            props.pays.length == 0 ?
                    <div className="w-full text-center pb-3 text-muted">결제내역이 없습니다.</div>
                :
                props.pays.map((pay, idx) => (
                  <Pay key={idx} pay={pay} />
                ))
        }
      </div>
    </div>
  );
};

export default PayList;
