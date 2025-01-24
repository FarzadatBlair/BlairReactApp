import React, { useState } from "react";
import Button from "@/components/common/Button";

interface QuestionPageProps {
  title: string;
  desc?: string;
  type: "multiple_choice" | "multi_select";
  options: string[];
  specialField?: string;
  otherField?: boolean;
  onContinue: (answer: any) => void;
}

const QuestionPage: React.FC<QuestionPageProps> = ({
  title,
  desc,
  type,
  options,
  specialField,
  otherField,
  onContinue,
}) => {
  const [selected, setSelected] = useState<any>(
    type === "multi_select" ? [] : null
  );
  const [otherValue, setOtherValue] = useState("");

  const handleOptionChange = (option: string) => {
    if (type === "multiple_choice") {
      setSelected(option);
    } else {
      // Toggle the selection for multi-select
      setSelected((prev: string[]) =>
        prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
      );
    }
  };

  const handleSpecialField = () => {
    if (type === "multi_select") {
      setSelected((prev: string[]) =>
        prev.includes(specialField!) ? prev.filter((o) => o !== specialField) : [...prev, specialField]
      );
    } else {
      setSelected(specialField);
    }
  };

  const handleContinue = () => {
    const answer =
      otherField && otherValue
        ? type === "multi_select"
          ? [...selected, otherValue]
          : otherValue
        : selected;
    onContinue(answer);
  };

  return (
    // <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div>
        <h1 className="mb-4">{title}</h1>
        {desc && <p>{desc}</p>}

        <div className="space-y-4">
          {options.map((option, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg cursor-pointer ${
                type === "multi_select"
                  ? selected.includes(option)
                    ? "border-black bg-gray-200"
                    : "border-gray-300"
                  : selected === option
                  ? "border-black bg-gray-200"
                  : "border-gray-300"
              } hover:border-black`}
              onClick={() => handleOptionChange(option)}
            >
              <span className="text-sm">{option}</span>
            </div>
          ))}

          {specialField && (
            <div
              className={`p-4 border rounded-lg cursor-pointer ${
                type === "multi_select"
                  ? selected.includes(specialField)
                    ? "border-black bg-gray-200"
                    : "border-gray-300"
                  : selected === specialField
                  ? "border-black bg-gray-200"
                  : "border-gray-300"
              } hover:border-black`}
              onClick={handleSpecialField}
            >
              <span className="text-sm">{specialField}</span>
            </div>
          )}

          {otherField && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Other (please specify)"
                value={otherValue}
                onChange={(e) => setOtherValue(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <Button
            onClick={handleContinue}
          >
            Continue
          </Button>
          <button
            onClick={() => window.history.back()}
            className="text-sm text-gray-500 hover:underline"
          >
            Go back
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>{" "}
          |{" "}
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    // </div>
  );
};

export default QuestionPage;
