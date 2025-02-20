export interface FlowStep {
  from: string;
  to: string; // Empty string `""` if leading to a result
  includes: number[]; // List of option indexes that MUST be included
  excludes: number[]; // List of option indexes that MUST NOT be included
  'is-start': boolean;
  'is-end': boolean;
  note?: string;
}

export interface Options {
  label: string;
  // 'text' for user text input, 'none' none of above, boolean for default
  special?: 'free-text' | 'none-above' | 'not-special';
}

export interface HealthWellnessQuestion {
  id: string;
  title: string;
  info?: string;
  description?: string;
  type: 'MC' | 'MS' | 'NUM' | 'list-text';
  options?: Options[];
  unitType?: 'weight' | 'height'; // Determines unit selection for NUM type
  onContinue: (answer: string | string[]) => void;
  disabled: boolean;
}

// Define a type that matches the expected shape of the raw JSON data
export interface RawHealthWellnessQuestion {
  id: string;
  title: string;
  description?: string;
  type: 'MC' | 'MS' | 'NUM' | 'list-text';
  info?: string;
  options?: {
    label: string;
    special?: 'free-text' | 'none-above' | 'not-special';
  }[];
  column?: string;
}

export const parseHealthWellnessQuestions = (
  json: RawHealthWellnessQuestion[],
): HealthWellnessQuestion[] => {
  return json.map((question) => ({
    id: question.id,
    title: question.title,
    info: question.info || undefined,
    description: question.description || undefined,
    type: question.type,
    options:
      question.options?.map((option) => ({
        label: option.label,
        special: option.special || 'not-special',
      })) || [],
    onContinue: (answer) =>
      console.log(`Answer submitted for ${question.id}:`, answer),
    disabled: false,
  }));
};
