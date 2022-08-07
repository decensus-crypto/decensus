export const LIT_CERAMIC_INTEGRATION_PARAMS = [
  "https://ceramic-clay.3boxlabs.com",
  "ethereum",
];

export const SUBMISSION_MARK_CONTRACT_ADDRESS =
  "0x3990B7daEF78C23686EB93e0cea624C8504ef9A0";

export const TEST_NFT_CONTRACT_ADDRESS =
  "0xF37B2387a370Abf0d968F36134C77eb3D880D4E4";

export const CHAIN_NAME = "goerli";

export const FORM_TEMPLATE = (params: { formName: string }) => ({
  formName: params.formName,
  questions: [
    {
      question_body: "What's your age range?",
      question_type: "single_choice",
      choices: [
        { text: "Under 21" },
        { text: "Between 21 and 30" },
        { text: "Between 31 and 40" },
        { text: "Between 41 and 50" },
        { text: "Over 50" },
      ],
    },
    {
      question_body: "What's your gender?",
      question_type: "single_choice",
      choices: [
        { text: "Male" },
        { text: "Female" },
        { text: "Transgender" },
        { text: "Non-binary / non-conforming" },
        { text: "Prefer not to say" },
      ],
    },
    {
      question_body: "What's your gender?",
      question_type: "single_choice",
      choices: [
        { text: "Hispanic" },
        { text: "White alone, non-Hispanic" },
        { text: "Black or African American alone, non-Hispanic" },
        { text: "American Indian and Alaska Native alone, non-Hispanic" },
        { text: "Asian alone, non-Hispanic" },
        {
          text: "Native Hawaiian and Other Pacific Islander alone, non-Hispanic",
        },
        { text: "Some Other Race alone, non-Hispanic" },
        { text: "Multiracial, non-Hispanic" },
        { text: "Prefer not to say" },
      ],
    },
    {
      question_body: "In what country are you based?",
      question_type: "text",
      choices: [],
    },
    {
      question_body: "What's your occupation's industry?",
      question_type: "multi_choice",
      choices: [
        { text: "Arts and entertainment" },
        { text: "Business administration" },
        { text: "Industrial and manufacturing" },
        { text: "Law enforcement and armed forces" },
        { text: "Science and technology" },
        { text: "Others" },
      ],
    },
  ],
});
