import React from "react";
import ResultPage from "@components/ResultPage";
import resultsData from "@data/results.json";
import GenericPage from '@components/layout/GenericPage';

const Page: React.FC = () => {
  // Dynamically fetch the first result for now
  const result = resultsData[0];

  return (<GenericPage className="flex flex-col"> 
  <ResultPage result={result} />
  </GenericPage>);
};

export default Page;
