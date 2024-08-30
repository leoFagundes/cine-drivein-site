export interface FilmProps {
  _id: string;
  title: string;
  showtime: string;
  image: string;
  classification: "L" | "12" | "14" | "16" | "18";
  synopsis: string;
  director: string;
  writer: string[];
  cast: string[];
  genres: string[];
  duration: string;
  language: string;
  displayDate: string;
  trailer: string;
  screening: "Sessão 1" | "Sessão 2" | "Sessão 3";
}

export type Schedule = {
  _id: string;
  isOpen: boolean;
  closingTime: string;
  openingTime: string;
};
