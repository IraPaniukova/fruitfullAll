import { orange } from "@mui/material/colors";
import type { PostInputDto } from "./interfaces";

export const mainColour = orange[500]; //#ff9800
export const INACTIVITY_TIME = 30 * 60 * 1000; //30 minute

//should be moved to DB later
export const industryOptions = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
];

export const countryOptions = [
  "New Zealand",
  "United States",
  "United Kingdom",
  "Australia",
  "Canada",
  // may be other countries
];

export const questionTypeOptions = [
  "Technical",
  "Behavioral",
  "Situational",
  "Case Study",
];
export const interviewFormatOptions = [
  "Face to face with one",
  "Face to face with group",
  "Video call with one",
  "Video call with group",
  "Video recording",
  "Timed online test",
  "Take home task",
];

export const stressLevelOptions = [
  { value: 0, label: "0 - No Stress" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5 - Terrible" },
];
export const currentYear = new Date().getFullYear();
export const yearOptions = [currentYear, currentYear - 1];

export const initialForm: PostInputDto = {
  content: "",
  opinion: "",
  company: "",
  industry: "",
  year: null,
  country: "",
  stressLevel: null,
  questionType: "",
  interviewFormat: "",
  tags: [],
};
