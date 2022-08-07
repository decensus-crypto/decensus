export const SUBMISSION_MARK_CONTRACT_ADDRESS =
  "0x3990B7daEF78C23686EB93e0cea624C8504ef9A0";

export const TEST_NFT_CONTRACT_ADDRESS =
  "0xF37B2387a370Abf0d968F36134C77eb3D880D4E4";

export const CHAIN_NAME = "goerli";

export const LIT_CERAMIC_INTEGRATION_PARAMS = [
  "https://ceramic-clay.3boxlabs.com",
  CHAIN_NAME,
];

export const ANSWER_TEMPLATE = (params: {}) => ({
  answers: [
    {
      question_id: "2f633cdd1181d42a9c7ae9a889362ff7",
      question_type: "single_choice",
      answer: "Over 50",
    },
    {
      question_id: "c31248e78aced0c36320b2f13a8a7891",
      question_type: "single_choice",
      answer: "Male",
    },
    {
      question_id: "8e9c7a86c8295244c2f50e1049023b1b",
      question_type: "single_choice",
      answer: "Hispanic",
    },
    {
      question_id: "5ca2aa845c8cd5ace6b016841f100d82",
      question_type: "single_choice",
      answer: "Cyprus",
    },
    {
      question_id: "c570503c6bd0a44eb7ab38365ca83ced",
      question_type: "multi_choice",
      answer: ["Arts and entertainment", "Science and technology"],
    },
  ],
});

export const AGE_QUESTION_ID = "2f633cdd1181d42a9c7ae9a889362ff7";
export const AGE_QUESTION_OPTIONS = [
  { text: "Under 21" },
  { text: "Between 21 and 30" },
  { text: "Between 31 and 40" },
  { text: "Between 41 and 50" },
  { text: "Over 50" },
  { text: "Prefer not to respond" },
];
export const COUNTRY_QUESTION_ID = "5ca2aa845c8cd5ace6b016841f100d82";
export const COUNTRY_QUESTION_OPTIONS = [
  { text: "Afghanistan" },
  { text: "Albania" },
  { text: "Algeria" },
  { text: "Andorra" },
  { text: "Angola" },
  { text: "Antigua & Deps" },
  { text: "Argentina" },
  { text: "Armenia" },
  { text: "Australia" },
  { text: "Austria" },
  { text: "Azerbaijan" },
  { text: "Bahamas" },
  { text: "Bahrain" },
  { text: "Bangladesh" },
  { text: "Barbados" },
  { text: "Belarus" },
  { text: "Belgium" },
  { text: "Belize" },
  { text: "Benin" },
  { text: "Bhutan" },
  { text: "Bolivia" },
  { text: "Bosnia Herzegovina" },
  { text: "Botswana" },
  { text: "Brazil" },
  { text: "Brunei" },
  { text: "Bulgaria" },
  { text: "Burkina" },
  { text: "Burundi" },
  { text: "Cambodia" },
  { text: "Cameroon" },
  { text: "Canada" },
  { text: "Cape Verde" },
  { text: "Central African Rep" },
  { text: "Chad" },
  { text: "Chile" },
  { text: "China" },
  { text: "Colombia" },
  { text: "Comoros" },
  { text: "Congo" },
  { text: "Congo {Democratic Rep}" },
  { text: "Costa Rica" },
  { text: "Croatia" },
  { text: "Cuba" },
  { text: "Cyprus" },
  { text: "Czech Republic" },
  { text: "Denmark" },
  { text: "Djibouti" },
  { text: "Dominica" },
  { text: "Dominican Republic" },
  { text: "East Timor" },
  { text: "Ecuador" },
  { text: "Egypt" },
  { text: "El Salvador" },
  { text: "Equatorial Guinea" },
  { text: "Eritrea" },
  { text: "Estonia" },
  { text: "Ethiopia" },
  { text: "Fiji" },
  { text: "Finland" },
  { text: "France" },
  { text: "Gabon" },
  { text: "Gambia" },
  { text: "Georgia" },
  { text: "Germany" },
  { text: "Ghana" },
  { text: "Greece" },
  { text: "Grenada" },
  { text: "Guatemala" },
  { text: "Guinea" },
  { text: "Guinea-Bissau" },
  { text: "Guyana" },
  { text: "Haiti" },
  { text: "Honduras" },
  { text: "Hungary" },
  { text: "Iceland" },
  { text: "India" },
  { text: "Indonesia" },
  { text: "Iran" },
  { text: "Iraq" },
  { text: "Ireland {Republic}" },
  { text: "Israel" },
  { text: "Italy" },
  { text: "Ivory Coast" },
  { text: "Jamaica" },
  { text: "Japan" },
  { text: "Jordan" },
  { text: "Kazakhstan" },
  { text: "Kenya" },
  { text: "Kiribati" },
  { text: "Korea North" },
  { text: "Korea South" },
  { text: "Kosovo" },
  { text: "Kuwait" },
  { text: "Kyrgyzstan" },
  { text: "Laos" },
  { text: "Latvia" },
  { text: "Lebanon" },
  { text: "Lesotho" },
  { text: "Liberia" },
  { text: "Libya" },
  { text: "Liechtenstein" },
  { text: "Lithuania" },
  { text: "Luxembourg" },
  { text: "Macedonia" },
  { text: "Madagascar" },
  { text: "Malawi" },
  { text: "Malaysia" },
  { text: "Maldives" },
  { text: "Mali" },
  { text: "Malta" },
  { text: "Marshall Islands" },
  { text: "Mauritania" },
  { text: "Mauritius" },
  { text: "Mexico" },
  { text: "Micronesia" },
  { text: "Moldova" },
  { text: "Monaco" },
  { text: "Mongolia" },
  { text: "Montenegro" },
  { text: "Morocco" },
  { text: "Mozambique" },
  { text: "Myanmar, {Burma}" },
  { text: "Namibia" },
  { text: "Nauru" },
  { text: "Nepal" },
  { text: "Netherlands" },
  { text: "New Zealand" },
  { text: "Nicaragua" },
  { text: "Niger" },
  { text: "Nigeria" },
  { text: "Norway" },
  { text: "Oman" },
  { text: "Pakistan" },
  { text: "Palau" },
  { text: "Panama" },
  { text: "Papua New Guinea" },
  { text: "Paraguay" },
  { text: "Peru" },
  { text: "Philippines" },
  { text: "Poland" },
  { text: "Portugal" },
  { text: "Qatar" },
  { text: "Romania" },
  { text: "Russian Federation" },
  { text: "Rwanda" },
  { text: "St Kitts & Nevis" },
  { text: "St Lucia" },
  { text: "Saint Vincent & the Grenadines" },
  { text: "Samoa" },
  { text: "San Marino" },
  { text: "Sao Tome & Principe" },
  { text: "Saudi Arabia" },
  { text: "Senegal" },
  { text: "Serbia" },
  { text: "Seychelles" },
  { text: "Sierra Leone" },
  { text: "Singapore" },
  { text: "Slovakia" },
  { text: "Slovenia" },
  { text: "Solomon Islands" },
  { text: "Somalia" },
  { text: "South Africa" },
  { text: "South Sudan" },
  { text: "Spain" },
  { text: "Sri Lanka" },
  { text: "Sudan" },
  { text: "Suriname" },
  { text: "Swaziland" },
  { text: "Sweden" },
  { text: "Switzerland" },
  { text: "Syria" },
  { text: "Taiwan" },
  { text: "Tajikistan" },
  { text: "Tanzania" },
  { text: "Thailand" },
  { text: "Togo" },
  { text: "Tonga" },
  { text: "Trinidad & Tobago" },
  { text: "Tunisia" },
  { text: "Turkey" },
  { text: "Turkmenistan" },
  { text: "Tuvalu" },
  { text: "Uganda" },
  { text: "Ukraine" },
  { text: "United Arab Emirates" },
  { text: "United Kingdom" },
  { text: "United States" },
  { text: "Uruguay" },
  { text: "Uzbekistan" },
  { text: "Vanuatu" },
  { text: "Vatican City" },
  { text: "Venezuela" },
  { text: "Vietnam" },
  { text: "Yemen" },
  { text: "Zambia" },
  { text: "Zimbabwe" },
];

export const FORM_TEMPLATE = (params: { title: string }) => ({
  title: params.title,
  questions: [
    {
      id: AGE_QUESTION_ID,
      question_body: "What's your age range?",
      question_type: "single_choice",
      options: AGE_QUESTION_OPTIONS,
    },
    {
      id: "c31248e78aced0c36320b2f13a8a7891",
      question_body: "What's your gender?",
      question_type: "single_choice",
      options: [
        { text: "Male" },
        { text: "Female" },
        { text: "Transgender" },
        { text: "Non-binary / non-conforming" },
        { text: "Intersex" },
        { text: "Other" },
        { text: "Prefer not to say" },
      ],
    },
    {
      id: "8e9c7a86c8295244c2f50e1049023b1b",
      question_body: "What's your ethnicity?",
      question_type: "single_choice",
      options: [
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
        { text: "Other" },
      ],
    },
    {
      id: COUNTRY_QUESTION_ID,
      question_body: "In what country are you based?",
      question_type: "single_choice",
      options: COUNTRY_QUESTION_OPTIONS,
    },
    {
      id: "c570503c6bd0a44eb7ab38365ca83ced",
      question_body: "What's your occupation's industry?",
      question_type: "multi_choice",
      options: [
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

export type AnswerTemplate = ReturnType<typeof ANSWER_TEMPLATE>;
export type FormTemplate = ReturnType<typeof FORM_TEMPLATE>;
export type Answer = {
  question_id: string;
  question_type: string;
  answer: string | string[];
};
