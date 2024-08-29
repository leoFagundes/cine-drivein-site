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
}
