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
}
