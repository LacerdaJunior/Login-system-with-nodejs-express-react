// src/pages/Home.jsx
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Footer } from "../components/FooterTemp";

export function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
