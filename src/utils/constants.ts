import { orange } from "@mui/material/colors";

export const mainColour = orange[500]; //#ff9800
export const INACTIVITY_TIME = 30 * 60 * 1000; //30 minute

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

export const stressLevelOptions = [
  { value: "0", label: "0 - No Stress" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5 - Terrible" },
];
