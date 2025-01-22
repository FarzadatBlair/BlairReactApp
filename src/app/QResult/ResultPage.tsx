import React from "react";
import GenericPage from '@components/layout/GenericPage';

type Result = {
  title: string;
  desc: string;
  symptoms: string[];
  nextSteps: string[];
};

type ResultPageProps = {
  result: Result;
};

const ResultPage: React.FC<ResultPageProps> = ({ result }) => {
  return (
    <GenericPage className="flex flex-col">
      <div className="max-w-lg bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-[#4e342e] mb-4">{result.title}</h1>
        <p className="text-[#5d4037] mb-6">{result.desc}</p>

        <h2 className="text-lg font-semibold text-[#4e342e] mb-2">Common Symptoms:</h2>
        <ul className="list-disc pl-5 mb-6 text-[#5d4037]">
          {result.symptoms.map((symptom, index) => (
            <li key={index}>{symptom}</li>
          ))}
        </ul>

        <h2 className="text-lg font-semibold text-[#4e342e] mb-2">What’s Next?</h2>
        <ul className="list-disc pl-5 mb-6 text-[#5d4037]">
          {result.nextSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>

        <button className="w-full py-2 px-4 bg-[#6d4c41] text-white rounded-lg font-semibold hover:bg-[#5d4037]">
          Continue
        </button>
        <a href="/" className="block text-center mt-4 text-[#4e342e] underline">
          Go back
        </a>
      </div>
    </GenericPage>
  );
};

export default ResultPage;
