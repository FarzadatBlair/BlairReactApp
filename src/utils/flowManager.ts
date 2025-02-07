import { FlowStep, Question } from '@/types/question';
import { evaluateCalculation } from './calculations';

// Function to find the next question
export const getNextStep = (
  flow: FlowStep[],
  questions: Question[],
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

  const selectedIndices = selectedAnswers
    .map((ans) => question.options.findIndex((opt) => opt.label === ans))
    .filter((i) => i !== -1);

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
      `Checking step: from ${step.from} to ${step.to || step['to-result']} | includes: ${step.includes} | excludes: ${step.excludes} | includesCondition: ${includesCondition} | excludesCondition: ${excludesCondition}`,
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

// Function to determine final result
export const getFinalResult = async (
  flow: FlowStep[],
  questions: Question[],
  currentQuestionId: string,
  selectedAnswers: string[],
): Promise<string | null> => {
  console.log(
    `Checking final result for question: ${currentQuestionId}, answers:`,
    selectedAnswers,
  );

  const step = getNextStep(flow, questions, currentQuestionId, selectedAnswers);
  if (!step) {
    console.log(`No flow step found from question: ${currentQuestionId}`);
    return null;
  }

  if (step.to !== '' || !step['to-result']) {
    console.log(`Flow step does not lead to a result. Step details:`, step);
    return null;
  }

  if (step.calculation) {
    console.log(
      `Evaluating calculation for result condition:`,
      step.calculation,
    );
    const isValid = await evaluateCalculation(step.calculation);

    if (!isValid) {
      console.log(
        `Calculation condition failed for result: ${step['to-result']}`,
      );

      // ✅ Find the correct alternative result using a loop (instead of `.find()`)
      for (const altStep of flow) {
        if (
          altStep.from === currentQuestionId &&
          altStep.to === '' && // Ensure it's a final result
          altStep['to-result'] !== step['to-result'] // Ensure it's not the failed step
        ) {
          // Check if this alternative step has a calculation and if it passes
          if (
            !altStep.calculation ||
            (await evaluateCalculation(altStep.calculation))
          ) {
            console.log(`Using alternative result: ${altStep['to-result']}`);
            //TODO: investigate: The error Type 'string | undefined' is not assignable to type 'string | null' occurs because altStep['to-result'] might be undefined, but the function expects a string | null return type.
            return altStep['to-result'] ?? null;
          }
        }
      }

      console.log(`No valid alternative result found.`);
      return null;
    }
  }

  console.log(`Final result determined: ${step['to-result']}`);
  return step['to-result'];
};
