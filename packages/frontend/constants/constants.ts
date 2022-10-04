export const FORM_COLLECTION_FACTORY_CONTRACT_ADDRESS =
  "0xEBed7538E8cc636F3FbaCEE289Aacb2Ef959AbA2";

export const TEST_NFT_CONTRACT_ADDRESS =
  "0xe5b4d6b5f37cae9dc4c7384cd97038cd0573d7d2"; // Strxngers

export const CHAIN_NAME = "mumbai";

export const CHAIN_ID = 80001;

export const LIT_CHAIN = "ethereum";

// TODO: use API Key
export const SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/nakaakist/form-collection-mumbai";

export const AGE_QUESTION: Question = {
  questionBody: "What's your age range?",
  questionType: "single_choice",
  options: [
    { text: "Under 21" },
    { text: "Between 21 and 30" },
    { text: "Between 31 and 40" },
    { text: "Between 41 and 50" },
    { text: "Over 50" },
    { text: "Prefer not to respond" },
  ],
};

export const GENDER_QUESTION: Question = {
  questionBody: "What's your gender?",
  questionType: "single_choice",
  options: [
    { text: "Male" },
    { text: "Female" },
    { text: "Transgender" },
    { text: "Non-binary / non-conforming" },
    { text: "Intersex" },
    { text: "Other" },
    { text: "Prefer not to say" },
  ],
};

export const COUNTRY_QUESTION: Question = {
  questionBody: "In what country are you based?",
  questionType: "single_choice_dropdown",
  options: [
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
  ],
};

export const ETHNICITY_QUESTION: Question = {
  questionBody: "What's your ethnicity?",
  questionType: "single_choice_dropdown",
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
};

export const INDUSTRY_QUESTION: Question = {
  questionBody: "What's your occupation's industry?",
  questionType: "single_choice",
  options: [
    { text: "Arts and entertainment" },
    { text: "Business administration" },
    { text: "Industrial and manufacturing" },
    { text: "Law enforcement and armed forces" },
    { text: "Science and technology" },
    { text: "Others" },
  ],
};

export const QUESTIONS: Question[] = [
  AGE_QUESTION,
  AGE_QUESTION,
  GENDER_QUESTION,
  COUNTRY_QUESTION,
  ETHNICITY_QUESTION,
  INDUSTRY_QUESTION,
];


export type FormTemplate = {
  title: string;
  description: string;
  questions: Question[];
};



export type Answer = {
  question_id: string;
  questionType: string;
  answer: string | string[];
};

export type QuestionOption = {
  text: string;
};

export type Question = {
  questionBody: string;
  questionType: "single_choice" | "single_choice_dropdown";
  options: QuestionOption[];
};


