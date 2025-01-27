export interface Question {
  title: string;
  desc?: string;
  type: 'multiple_choice' | 'multi_select';
  options: string[];
  specialField?: string;
  otherField?: boolean;
}
