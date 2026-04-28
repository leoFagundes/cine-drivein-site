// export interface FilmProps {
//   _id: string;
//   title: string;
//   showtime: string;
//   image: string;
//   classification: "L" | "12" | "14" | "16" | "18";
//   synopsis: string;
//   director: string;
//   writer: string[];
//   cast: string[];
//   genres: string[];
//   duration: string;
//   language: string;
//   displayDate: string;
//   trailer: string;
//   screening: "Sessão 1" | "Sessão 2" | "Sessão 3" | "Sessão 4" | "";
// }

// export interface SiteConfig {
//   _id: string;
//   isClosed: boolean;
//   isEvent: string;
//   popUpImage: string;
//   popUpText: {
//     title: string;
//     description: string[];
//   };
// }

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
}

export interface SiteConfig {
  siteUrl: string;
  isClosed: boolean;
  isEvent: EventType;
  popUpEnabled: boolean;
  popUpImage?: string;
  popUpTitle?: string;
  popUpDescriptions?: string[];
  session1?: Film | null;
  session2?: Film | null;
  session3?: Film | null;
  session4?: Film | null;
}

export type Schedule = {
  _id: string;
  isOpen: boolean;
  closingTime: string;
  openingTime: string;
};
