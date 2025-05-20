"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-800 text-gray-800">
      {/* Hero Section */}
      <section className="flex items-center justify-center px-4 py-16 md:py-24">
        <div className="max-w-2xl w-full flex flex-col items-center text-center bg-gradient-to-tl from-gray-100 to-white shadow-xl rounded-2xl p-8 border">
          <div className="w-full mb-6">
            <img
              src="/personal-finance-illustration.svg"
              alt="Økonomi illustration"
              className="mx-auto w-48 h-48"
            />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            Velkommen til din økonomioversigt
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            Få overblik over din indtægt, dit forbrug og dine vaner.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition duration-200 shadow"
            >
              Log ind
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
            viewport={{ once: true, amount: 0.3 }}
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
