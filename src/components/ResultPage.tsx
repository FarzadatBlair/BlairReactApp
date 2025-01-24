import React from "react";
import Button from "@/components/common/Button";

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
    <div>
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-[#5c4033]">Assessment complete!</h1>
        <p className="text-lg font-medium text-[#5c4033] mt-2">
          {/* You are currently in */}
           <span className="font-bold">{result.title}</span>
        </p>
        <p className="text-[#7d5e50] mt-4">{result.desc}</p>
      </div>

      {/* Menopause Journey Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-[#5c4033] mb-4">Your Menopause Journey</h2>
        <p className="text-[#7d5e50] mb-6">{result.desc}</p>

        {/* Duration */}
        <div className="flex items-center gap-4 mb-6">
          <div className="text-2xl text-[#f57c00]">⏰</div>
          <div>
            <h3 className="font-semibold text-[#5c4033]">Duration</h3>
            <p className="text-[#7d5e50]">
              Perimenopause typically lasts 4-8 years, but can be shorter or longer for some women.
            </p>
          </div>
        </div>

        {/* Common Symptoms */}
        <div className="flex items-center gap-4 mb-6">
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
            <h3 className="font-semibold text-[#5c4033]">Tips for this Stage</h3>
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
        <h2 className="text-xl font-semibold text-[#5c4033] mb-4">Next steps</h2>
        <p className="text-[#7d5e50] mb-6">
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
        <button className="w-full py-2 px-4 bg-white text-[#6d4c41] rounded-lg font-semibold mt-4 border border-[#6d4c41] hover:bg-[#fbe9e7]">
          Take me home
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
