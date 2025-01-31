import React from 'react';
import GenericPage from '@components/layout/GenericPage';
import Button from '@/components/common/Button';

type Result = {
  title: string;
  desc: string;
  symptoms: string[];
  nextSteps: string[];
};

type ResultPageProps = {
  result: Result;
};

const ResultPageCondensed: React.FC<ResultPageProps> = ({ result }) => {
  return (
    <GenericPage bgCol="secondary">
      {/* Header Section */}
      <div className="mb-8">
        <h1>
          <span>{result.title}</span>
        </h1>
        <p className="mt-4 text-left">{result.desc}</p>
      </div>

      {/* Common Symptoms */}
      {/* <div className="flex items-start gap-4"> */}
      <div>
        <h4>Common Symptoms</h4>
        <ul className="list-disc pl-5">
          {result.symptoms.map((symptom, index) => (
            <li key={index}>{symptom}</li>
          ))}
        </ul>
      </div>
      {/* </div> */}
      <br></br>

      {/* Tips for this Stage */}
      {/* <div className="flex items-start gap-4"> */}
      <div>
        <h4>What's Next?</h4>
        {result.nextSteps.map((nextStep, index) => (
          <li key={index}>{nextStep}</li>
        ))}
      </div>
      {/* </div> */}

      {/* Next Steps Section */}
      <div className="w-full max-w-lg">
        <Button className="mt-6">Continue</Button>
        <button className="justify-center font-bold underline">Go back</button>
      </div>
    </GenericPage>
  );
};

export default ResultPageCondensed;
