import Result from "./Result";

const ResultList = (props) => {
  const results = props.results;
  const payMembers = props.payMembers;

  return (
    <div className="w-full min-h-[96px] max-h-[55vh] pt-4 border-none rounded-md bg-lightgray overflow-y-auto">
      <div className="min-h-[96px] max-h-[55vh] w-full mb-2 border-none rounded-md bg-lightgray overflow-y-auto">
        {results.map((result, idx) => (
          <Result
            key={idx}
            username={payMembers[idx + 1]}
            money={result[2]}
            payer={payMembers[0]}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultList;
