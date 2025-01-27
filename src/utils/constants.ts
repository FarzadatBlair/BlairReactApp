export const HEALTH_CARD_FORMATS = {
  AB: {
    name: 'AHCIP card number',
    regex: /^\d{5}-\d{4}$/,
    example: '12345-0000',
  },
  BC: {
    name: 'BC Personal Health Number (PHN)',
    regex: /^\d{4} \d{3} \d{3}$/,
    example: '9123 456 789',
  },
  SK: {
    name: 'Saskatchewan Health Card Number',
    regex: /^\d{3} \d{3} \d{3}$/,
    example: '123 456 789',
  },
  MB: {
    name: 'Manitoba Personal Health ID Number (PHIN)',
    regex: /^\d{3} \d{3} \d{3}$/,
    example: '123 456 789',
  },
  ON: {
    name: 'OHIP Number',
    regex: /^\d{4}-\d{3}-\d{3}-[A-Z]{2}$/,
    example: '1234-567-897-AB',
  },
  PE: {
    name: 'Personal Health Number',
    regex: /^\d{8}$/,
    example: '12341234',
  },
  NS: {
    name: 'MSI Card Number',
    regex: /^\d{4} \d{3} \d{3}$/,
    example: '1234 567 890',
  },
  NL: {
    name: 'MCP Medical Care Plan',
    regex: /^\d{3} \d{3} \d{3} \d{3}$/,
    example: '123 456 789 015',
  },
  QC: {
    name: 'RAMQ Number',
    regex: /^[A-Z]{4} \d{4} \d{4}$/,
    example: 'ABCD 1234 1234',
  },
  NB: {
    name: 'Medicare Card Number',
    regex: /^\d{3}-\d{3}-\d{3}$/,
    example: '123-456-782',
  },
  YT: {
    name: 'YHCIP Number',
    regex: /^\d{3}-\d{3}-\d{3}$/,
    example: '123-456-782',
  },
  NT: {
    name: 'NWT Health Care Plan Card Number',
    regex: /^N\d{7}$/,
    example: 'N6739906',
  },
  NU: {
    name: 'Nunavut Health Care Plan Card Number',
    regex: /^\d{9}$/,
    example: '123456768',
  },
};

export const PROVINCES = [
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'YT', label: 'Yukon' },
];

export const QUESTION_TITLE_CHAR_LIMIT = 30;
