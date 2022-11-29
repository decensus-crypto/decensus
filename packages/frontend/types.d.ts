export type QuestionnaireLink = {
  title: string;
  formUrl: string;
  resultUrl: string;
};

export type QuestionnaireForm = {
  questionnaire: Questionnaire;
  nftAddress: string;
  answerableWallets: string[];
};

export type Questionnaire = {
  title: string;
  description: string;
  questions: Question[];
};

export type Question = {
  id: string;
  questionBody: string;
  questionType:
    | "single_choice"
    | "single_choice_dropdown"
    | "multi_choice"
    | "rating"
    | "text"
    | "date";
  ratingMax: number;
  options: string[];
};

export type Answer = {
  questionId: string;
  questionType:
    | "single_choice"
    | "single_choice_dropdown"
    | "multi_choice"
    | "rating"
    | "text"
    | "date";
  answer: string | string[];
};
