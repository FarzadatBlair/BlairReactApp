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


const ResultPage: React.FC<ResultPageProps> = ({ result }) => {
  return (
    <GenericPage bgCol='default'>
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-[#5c4033]">
          Assessment complete!
        </h1>
        <p className="mt-2 text-lg font-medium text-[#5c4033]">
          {/* You are currently in */}
          <span className="font-bold">{result.title}</span>
        </p>
        <p className="mt-4 text-[#7d5e50]">{result.desc}</p>
      </div>

      {/* Menopause Journey Card */}
      <div className="mb-8 w-full max-w-lg rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-[#5c4033]">
          Your Menopause Journey
        </h2>
        <p className="mb-6 text-[#7d5e50]">{result.desc}</p>

        {/* Duration */}
        <div className="mb-6 flex items-center gap-4">
          <div className="text-2xl text-[#f57c00]">⏰</div>
          <div>
            <h3 className="font-semibold text-[#5c4033]">Duration</h3>
            <p className="text-[#7d5e50]">
              Perimenopause typically lasts 4-8 years, but can be shorter or
              longer for some women.
            </p>
          </div>
        </div>

        {/* Common Symptoms */}
        <div className="mb-6 flex items-center gap-4">
          <div className="text-2xl text-[#f57c00]">📋</div>
          <div>
            <h3 className="font-semibold text-[#5c4033]">Common Symptoms</h3>
            <ul className="list-disc pl-5 text-[#7d5e50]">
              {result.symptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tips for this Stage */}
        <div className="flex items-center gap-4">
          <div className="text-2xl text-[#f57c00]">👍</div>
          <div>
            <h3 className="font-semibold text-[#5c4033]">
              Tips for this Stage
            </h3>
            <ul className="list-disc pl-5 text-[#7d5e50]">
              <li>Maintain a healthy diet and exercise routine</li>
              <li>Practice stress-reduction techniques</li>
              <li>Consider hormone therapy (consult with your doctor)</li>
              <li>Stay hydrated and avoid triggers for hot flashes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Next Steps Section */}
      <div className="w-full max-w-lg">
        <h2 className="mb-4 text-xl font-semibold text-[#5c4033]">
          Next steps
        </h2>
        <p className="mb-6 text-[#7d5e50]">
          Thank you for taking this important step in your menopause journey.
        </p>
        {/* <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center gap-4">
          <img
            src="https://via.placeholder.com/64" // Placeholder for the doctor image
            alt="Doctor"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-[#5c4033]">Dr. Amanda Shaw</h3>
            <p className="text-[#7d5e50] text-sm">OB-GYN</p>
            <p className="text-[#7d5e50] text-sm">Appointment available tomorrow at 10:00am EST.</p>
          </div>
        </div>
        <Button >
          Talk to a specialist
        </Button>
        <div className="text-center mt-4">
          <span className="text-[#7d5e50]">OR</span>
        </div> */}
        <button className="mt-4 w-full rounded-lg border border-[#6d4c41] bg-white px-4 py-2 font-semibold text-[#6d4c41] hover:bg-[#fbe9e7]">
          Take me home
        </button>
      </div>
    </GenericPage>
  );
};

export default ResultPage;
