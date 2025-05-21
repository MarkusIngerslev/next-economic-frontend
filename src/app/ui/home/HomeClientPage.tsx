"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HomeClientPage() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const headerScrollThreshold = 70; // Hvor langt ned man skal scrolle før header skjules (ca. headers højde)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        // Scroller op
        setShowHeader(true);
      } else {
        // Scroller ned
        if (currentScrollY > headerScrollThreshold) {
          setShowHeader(false);
        }
      }

      // Altid vis header hvis man er helt i toppen
      if (currentScrollY < 10) {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <main className="min-h-screen bg-gray-800 text-gray-100">
      {/* Header med Log ind knap */}
      <motion.header
        className="fixed top-0 left-0 w-full z-50 bg-gray-800 shadow-md py-4 px-4 sm:px-6 lg:px-8"
        initial={{ y: 0 }}
        animate={{ y: showHeader ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="container mx-auto flex justify-end items-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/login"
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out shadow"
            >
              Log ind
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-12 md:py-16">
        <div className="bg-gray-700 p-6 md:p-8 rounded-xl shadow-2xl max-w-2xl w-full">
          <div className="w-full mb-6 max-w-xs sm:max-w-sm md:max-w-md mx-auto">
            <img
              src="/personal-finance-illustration.svg"
              alt="Økonomi illustration"
              className="mx-auto w-48 h-48"
            />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Velkommen til din økonomioversigt
          </h1>
          <p className="text-gray-300 mb-8 text-lg max-w-xl mx-auto">
            Få overblik over din indtægt, dit forbrug og dine vaner.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/register"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full transition duration-200 shadow-lg text-lg"
            >
              Opret Gratis Konto
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Feature Section 1: Text Left, Image Right */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="text-gray-700"
          >
            <h2 className="text-3xl font-bold mb-4">Visualiser Dit Forbrug</h2>
            <p className="text-lg mb-4">
              Med intuitive grafer og diagrammer får du et klart billede af,
              hvor dine penge går hen. Identificer mønstre og tag kontrol over
              dit budget.
            </p>
            <p className="text-lg">
              Se detaljerede opdelinger pr. kategori og periode, så du nemt kan
              justere dine udgifter og nå dine økonomiske mål.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <img
              src="/pie-chart-illustration.svg"
              alt="Forbrugsdiagram"
              className="rounded-lg shadow-xl mx-auto w-full max-w-md"
            />
          </motion.div>
        </div>
      </section>

      {/* Feature Section 2: Image Left, Text Right */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="md:order-first" // Sikrer billedet er til venstre på medium skærme og op
          >
            <img
              src="/globe.svg" // Erstat med relevant graf billede
              alt="Indtægtsanalyse"
              className="rounded-lg shadow-xl mx-auto w-full max-w-md"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="text-gray-700 md:order-last" // Sikrer teksten er til højre
          >
            <h2 className="text-3xl font-bold mb-4">Optimer Din Indtægt</h2>
            <p className="text-lg mb-4">
              Få et dybdegående overblik over dine indtægtskilder. Analyser
              tendenser og find muligheder for at øge din indtjening.
            </p>
            <p className="text-lg">
              Vores værktøjer hjælper dig med at forstå din økonomiske
              situation, så du kan træffe informerede beslutninger.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Section 3: Different Background */}
      <section className="py-16 md:py-24 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-6">
              Klar Til At Tage Kontrollen?
            </h2>
            <p className="text-lg mb-8 max-w-xl mx-auto">
              Opret din konto i dag og start rejsen mod en sundere økonomi. Det
              er gratis at komme i gang!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                href="/register"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full transition duration-200 shadow-lg"
              >
                Opret Gratis Konto
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 text-center bg-gray-900 text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} Din Økonomioversigt. Alle
          rettigheder forbeholdes.
        </p>
      </footer>
    </main>
  );
}
