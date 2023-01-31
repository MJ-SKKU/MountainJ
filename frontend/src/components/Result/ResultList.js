import Result from "./Result";

const ResultList = (props) => {
  const results = props.results;
  const payMembers = props.payMembers;

  return (
    <div className="w-full min-h-[96px] max-h-[55vh] mb-2 pt-3 border-none rounded-md bg-lightgray overflow-y-scroll">
      {results.map((result, idx) => (
        <Result
          key={idx}
          username={payMembers[idx + 1]}
          money={result[2]}
          payer={payMembers[0]}
        />
      ))}
    </div>
  );
};

export default ResultList;
