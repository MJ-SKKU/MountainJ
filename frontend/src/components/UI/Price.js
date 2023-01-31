const Price = (props) => {
  const moneyScaled = props.price.toLocaleString("en-US");

  return <span className="text-lg font-semibold">{moneyScaled}원</span>;
};

export default Price;
