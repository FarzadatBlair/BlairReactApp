import React from "react";
import ResultPage from "./ResultPage";
import resultsData from "./results.json";

const Page: React.FC = () => {
  // Placeholder logic: Fetch the first result for now
  const result = resultsData[0];

  return <ResultPage result={result} />;
};

export default Page;
