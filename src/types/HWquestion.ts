export interface Options {
  label: string;
  // 'text' for user text input, 'none' none of above, boolean for default
  special?: 'free-text' | 'none-above' | 'not-special';
}

export interface HealthWellnessQuestion {
  title: string;
  description?: string;
  type: 'MC' | 'MS' | 'NUM' | 'list-text';
  options?: Options[];
  info?: string;
  unitType?: 'weight' | 'height'; // Determines unit selection for NUM type
  onContinue: (answer: string | string[]) => void;
  disabled: boolean;
}
