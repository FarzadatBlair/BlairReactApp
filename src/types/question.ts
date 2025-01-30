export interface Options {
  label: string;
  // 'text' for user text input, 'none' none of above, boolean for default
  special?: 'text' | 'none' | boolean;
}

export interface Question {
  // id: string;
  category: string;
  title: string;
  description?: string;
  type: 'MC' | 'MS';
  options: Options[];
}

/* 

example of array of Options:
[
  { "label": "Hot Flashes", "special": false },
  { "label": "Night Sweats", "special": false },
  { "label": "Other", "special": "text" },
  { "label": "None of the Above", "special": "none" }
]

exmaple of Question:
{
  "id": "1",
  "category": "Master",
  "title": "Do you experience any of the following symptoms?",
  "description": "Please select all that apply.",
  "type": "MS",
  "options": [
    { "label": "Hot Flashes", "special": false },
    { "label": "Night Sweats", "special": false },
    { "label": "Other", "special": "text" },
    { "label": "None of the Above", "special": "none" }
  ]
}

*/
