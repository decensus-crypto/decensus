export type QuestionType =
  | "single_choice"
  | "single_choice_dropdown"
  | "multi_choice"
  | "text"
  | "date"
  | "rating";

export type Option = { index: number; text: string };

export type Form = {
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
  qid: string;
  val: string | string[];
};
