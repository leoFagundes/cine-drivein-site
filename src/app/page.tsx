import DriveinFilm from "./(sections)/driveinFilm";
import DriveinLocation from "./(sections)/driveinLocation";
import Hero from "./(sections)/hero";
import Movies from "./(sections)/movies";
import Prices from "./(sections)/prices";
import Snack from "./(sections)/snack";

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full">
      <div className="min-h-[2000px] hidden md:flex flex-col absolute top-0 left-0 pointer-events-none overflow-hidden">
        <img
          className="mix-blend-overlay -z-10 w-full scale-110"
          src="svg/roll.svg"
          alt="roll"
        />
        <img
          className="mix-blend-overlay -z-10 w-full scale-125"
          src="svg/roll2.svg"
          alt="roll"
        />
        <img
          className="mix-blend-overlay -z-10 w-full scale-125"
          src="svg/roll3.svg"
          alt="roll"
        />
      </div>
      <Hero />
      <Movies />
      <Prices />
      <Snack />
      <DriveinFilm />
      <DriveinLocation />
    </main>
  );
}
