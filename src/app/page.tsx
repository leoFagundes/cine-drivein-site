import Hero from "./(sections)/hero";
import Movies from "./(sections)/movies";
import Prices from "./(sections)/prices";
import Snack from "./(sections)/snack";

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full">
      <Hero />
      <Movies />
      <Prices />
      <Snack />
    </main>
  );
}
