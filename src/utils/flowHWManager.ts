import { HealthWellnessQuestion, FlowStep } from '@/types/HWquestion';

// Function to find the next question
export const getNextStep = (
  flow: FlowStep[],
  questions: HealthWellnessQuestion[],
  currentQuestionId: string,
  selectedAnswers: string[],
): FlowStep | null => {
  console.log(
    `Finding next step from question: ${currentQuestionId}, selected answers:`,
    selectedAnswers,
  );

  const question = questions.find((q) => q.id === currentQuestionId);
  if (!question) {
    console.log(`Question ${currentQuestionId} not found in questions list.`);
    return null;
  }

  const selectedIndices = question.options
    ? selectedAnswers
        .map((ans) => question.options?.findIndex((opt) => opt.label === ans))
        .filter((i) => i !== -1)
    : [];

  console.log(
    `Selected indices for question ${currentQuestionId}:`,
    selectedIndices,
  );

  const matchedStep = flow.find((step) => {
    if (step.from !== currentQuestionId) return false;

    const includesCondition =
      step.includes.length === 0 ||
      step.includes.some((inc) => selectedIndices.includes(inc));
    const excludesCondition = step.excludes.every(
      (exc) => !selectedIndices.includes(exc),
    );

    console.log(
      `Checking step: from ${step.from} to ${step.to} | includes: ${step.includes} | excludes: ${step.excludes} | includesCondition: ${includesCondition} | excludesCondition: ${excludesCondition}`,
    );

    return includesCondition && excludesCondition;
  });

  if (!matchedStep) {
    console.log(
      `No valid step found for question ${currentQuestionId} with selected indices:`,
      selectedIndices,
    );
  }

  return matchedStep || null;
};
