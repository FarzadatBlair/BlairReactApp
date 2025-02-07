export interface Options {
  label: string;
  // 'text' for user text input, 'none' none of above, boolean for default
  special?: 'free-text' | 'none-above' | 'not-special';
}

export interface Question {
  id: string;
  category: string;
  title: string;
  description?: string;
  type: 'MC' | 'MS';
  options: Options[];
  column: string;
}

export type CalculationFunction =
  | 'ageBetween'
  | 'ageGreaterThan'
  | 'ageLessThan';

export interface FlowStep {
  from: string;
  to: string; // Empty string `""` if leading to a result
  'to-result'?: string; // Optional result code (R1 - R11)
  includes: number[]; // List of option indexes that MUST be included
  excludes: number[]; // List of option indexes that MUST NOT be included
  'is-start': boolean;
  'is-end': boolean;
  calculation?: {
    func: CalculationFunction; // Function name (e.g., "ageGreaterThan")
    params: number[]; // Function parameters
  };
  note?: string;
}
