import { v4 as uuidv4 } from "uuid";

export const FORM_COLLECTION_FACTORY_CONTRACT_ADDRESS =
  "0x306727350B001831a6BAd6C4201ad857D1e1fad8";

export const TEST_NFT_CONTRACT_ADDRESS =
  "0xe5b4d6b5f37cae9dc4c7384cd97038cd0573d7d2"; // Strxngers

export const CHAIN_NAME = "mumbai";

export const CHAIN_ID = 80001;

export const LIT_CHAIN = "ethereum";

// TODO: use API Key
export const SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/nakaakist/form-collection-mumbai";

const AGE_QUESTION: Question = {
  id: uuidv4(),
  question_body: "What's your age range?",
  question_type: "single_choice",
  question_max_rating: 5,
  options: [
    { index: 0, text: "Under 21" },
    { index: 1, text: "Between 21 and 30" },
    { index: 2, text: "Between 31 and 40" },
    { index: 3, text: "Between 41 and 50" },
    { index: 4, text: "Over 50" },
    { index: 5, text: "Prefer not to respond" },
  ],
};

const GENDER_QUESTION: Question = {
  id: uuidv4(),
  question_body: "What's your gender?",
  question_type: "single_choice",
  question_max_rating: 5,
  options: [
    { index: 0, text: "Male" },
    { index: 1, text: "Female" },
    { index: 2, text: "Transgender" },
    { index: 3, text: "Non-binary / non-conforming" },
    { index: 4, text: "Intersex" },
    { index: 5, text: "Other" },
    { index: 6, text: "Prefer not to say" },
  ],
};

const COUNTRY_QUESTION: Question = {
  id: uuidv4(),
  question_body: "In what country are you based?",
  question_type: "single_choice_dropdown",
  question_max_rating: 5,
  options: [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua & Deps",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Central African Rep",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Congo {Democratic Rep}",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "East Timor",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland {Republic}",
    "Israel",
    "Italy",
    "Ivory Coast",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea North",
    "Korea South",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar, {Burma}",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russian Federation",
    "Rwanda",
    "St Kitts & Nevis",
    "St Lucia",
    "Saint Vincent & the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome & Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Togo",
    "Tonga",
    "Trinidad & Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ].map((arg, idx) => {
    return { index: idx, text: arg };
  }),
};

const ETHNICITY_QUESTION: Question = {
  id: uuidv4(),
  question_body: "What's your ethnicity?",
  question_type: "single_choice",
  question_max_rating: 5,
  options: [
    { index: 0, text: "Hispanic" },
    { index: 1, text: "White alone, non-Hispanic" },
    { index: 2, text: "Black or African American alone, non-Hispanic" },
    { index: 3, text: "American Indian and Alaska Native alone, non-Hispanic" },
    { index: 4, text: "Asian alone, non-Hispanic" },
    {
      index: 5,
      text: "Native Hawaiian and Other Pacific Islander alone, non-Hispanic",
    },
    { index: 6, text: "Some Other Race alone, non-Hispanic" },
    { index: 7, text: "Multiracial, non-Hispanic" },
    { index: 8, text: "Prefer not to say" },
    { index: 9, text: "Other" },
  ],
};

const INDUSTRY_QUESTION: Question = {
  id: uuidv4(),
  question_body: "What's your occupation's industry?",
  question_type: "single_choice",
  question_max_rating: 5,
  options: [
    { index: 0, text: "Arts and entertainment" },
    { index: 1, text: "Business administration" },
    { index: 2, text: "Industrial and manufacturing" },
    { index: 3, text: "Law enforcement and armed forces" },
    { index: 4, text: "Science and technology" },
    { index: 5, text: "Others" },
  ],
};

const COMMUNITY_QUESTION: Question = {
  id: uuidv4(),
  question_body:
    "What community values are the most important to you in this community?",
  question_type: "multi_choice",
  question_max_rating: 5,
  options: [
    { index: 0, text: "Learning about web3 and crypto" },
    { index: 1, text: "Helping those that need it the most" },
    { index: 2, text: "Meet new people" },
    { index: 3, text: "Alpha (information not easily available out there)" },
    { index: 4, text: "Proliferating out NFT memes" },
    { index: 5, text: "Collect as many NFTs as possible" },
    { index: 6, text: "Create / build / launch stuff from within community" },
    { index: 7, text: "Just chill and have a good time" },
  ],
};

const DOB_QUESTION: Question = {
  id: uuidv4(),
  question_body: "Select your date of birth.",
  question_type: "date",
  question_max_rating: 5,
  options: [],
};
const RATING_QUESTION: Question = {
  id: uuidv4(),
  question_body: "How do you like decensus?",
  question_type: "rating",
  question_max_rating: 5,
  options: [],
};

export const QUESTIONS: Question[] = [
  AGE_QUESTION,
  GENDER_QUESTION,
  ETHNICITY_QUESTION,
  INDUSTRY_QUESTION,
  COUNTRY_QUESTION,
  COMMUNITY_QUESTION,
  DOB_QUESTION,
  RATING_QUESTION,
];

export type QuestionType =
  | "single_choice"
  | "single_choice_dropdown"
  | "multi_choice"
  | "text"
  | "date"
  | "rating";

export type Option = { index: number; text: string };

export type FormTemplate = {
  title: string;
  description: string;
  questions: Question[];
};
export type Question = {
  id: string;
  question_body: string;
  question_type: QuestionType;
  question_max_rating: number;
  options: Option[];
};

export type Answer = {
  question_id: string;
  question_type: QuestionType;
  answer: string | string[];
};
