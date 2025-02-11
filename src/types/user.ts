export type Sex = 'M' | 'F';

export interface User {
  first_name: string;
  last_name: string;
  dob: Date;
  sex: Sex;
  address: string;
  province: string;
}
