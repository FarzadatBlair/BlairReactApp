export interface Options {
  label: string;
  // 'text' for user text input, 'none' none of above, boolean for default
  special?: 'free-text' | 'none-above' | 'not-special';
}

export interface HealthWellnessQuestion {
  id: string;
  title: string;
  description?: string;
  type: 'MC' | 'MS' | 'NUM' | 'list-text';
  options?: Options[];
  info?: string;
  unitType?: 'weight' | 'height'; // Determines unit selection for NUM type
  onContinue: (answer: string | string[]) => void;
  disabled: boolean;
}

export interface FlowStep {
  from: string;
  to: string; // Empty string `""` if leading to a result
  includes: number[]; // List of option indexes that MUST be included
  excludes: number[]; // List of option indexes that MUST NOT be included
  'is-start': boolean;
  'is-end': boolean;
  note?: string;
}

export const parseHealthWellnessQuestions = (
  json: any[],
): HealthWellnessQuestion[] => {
  return json.map((question) => ({
    id: question.id,
    title: question.title,
    description: question.description || undefined,
    type: question.type,
    options:
      question.options?.map((option: any) => ({
        label: option.label,
        special: option.special || 'not-special',
      })) || [],
    onContinue: (answer) =>
      console.log(`Answer submitted for ${question.id}:`, answer),
    disabled: false,
  }));
};
