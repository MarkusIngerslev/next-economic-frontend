"use client"; // Gør dette til en Client Component

import { useEffect, useState } from "react";
import CategoryTabs from "@/app/ui/dashboard/category/categoryTabs"; 
import { getAllCategories, Category } from "@/services/api/category"; 


export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const fetchedCategories = await getAllCategories();
        console.log("Fetched categories on client:", fetchedCategories);
        setCategories(fetchedCategories);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch categories on client:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Ukendt fejl ved hentning af kategorier"
        );
        setCategories([]); // Sørg for at categories er et tomt array ved fejl
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []); // Tom dependency array sikrer, at dette kun kører én gang ved mount

  if (isLoading) {
    return (
      <main className="p-8 bg-gray-800 text-white  flex justify-center items-center">
        <p>Indlæser kategorier...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8 bg-gray-800 text-white  flex justify-center items-center">
        <p className="text-red-500">Fejl: {error}</p>
      </main>
    );
  }

  return (
    <main className="p-8 bg-gray-800 border text-white">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-100">
          Kategorier
        </h1>
        <CategoryTabs categories={categories} />
      </div>
    </main>
  );
}
