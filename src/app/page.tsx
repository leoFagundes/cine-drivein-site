import Hero from "./(sections)/hero";
import Movies from "./(sections)/movies";

export default function Home() {
  return (
    <main className="flex flex-col w-full ">
      <Hero />
      <Movies />
    </main>
  );
}
