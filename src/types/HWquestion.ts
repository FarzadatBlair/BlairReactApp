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
  enum_val?: string; // this is specifically a piece of the enum
  lookup_id?: string;
}

export interface HealthWellnessQuestion {
  id: string;
  title: string;
  info?: string;
  description?: string;
  type: 'MC' | 'MS' | 'NUM' | 'list-text';
  table: string;
  column: string;
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
  table: string;
  info?: string;
  options?: {
    label: string;
    special?: 'free-text' | 'none-above' | 'not-special';
    lookup_id?: string;
    enum_val?: string;
  }[];
  column: string;
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
    column: question.column,
    table: question.table,
    options:
      question.options?.map((option) => ({
        label: option.label,
        special: option.special || 'not-special',
        lookup_id: option.lookup_id || undefined,
        enum_val: option.enum_val || undefined,
      })) || [],
    onContinue: (answer) =>
      console.log(`Answer submitted for ${question.id}:`, answer),
    disabled: false,
  }));
};
