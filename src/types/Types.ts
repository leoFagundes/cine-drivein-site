export type FilmClassification =
  | "L"
  | "6"
  | "10"
  | "12"
  | "14"
  | "16"
  | "18"
  | "";
export type EventType = "" | "christmas" | "halloween" | "easter";
export type SessionKey = "session1" | "session2" | "session3" | "session4";

export interface Film {
  title: string;
  showtime: string;
  image: string;
  classification: FilmClassification;
  synopsis: string;
  director: string;
  writer: string[];
  cast: string[];
  genres: string[];
  duration: string;
  language: string;
  displayDate: string;
  trailer: string;
  avisos?: string[];
}

type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // domingo = 0

export interface PriceRule {
  label: string;
  days: WeekDay[];
  meia: number;
  inteira: number;
}

export interface SiteConfig {
  siteUrl: string;
  isClosed: boolean;
  openingTime?: string;
  closingTime?: string;
  isEvent: EventType;
  popUpEnabled: boolean;
  popUpImage?: string;
  popUpTitle?: string;
  popUpDescriptions?: string[];
  popUpImageHistory?: string[];
  session1?: Film | null;
  session2?: Film | null;
  session3?: Film | null;
  session4?: Film | null;
  prices?: PriceRule[];
}

export type Schedule = {
  _id: string;
  isOpen: boolean;
  closingTime: string;
  openingTime: string;
};
