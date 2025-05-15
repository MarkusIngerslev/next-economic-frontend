import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Category",
};

export default function Page() {
  return (
    <main className=" p-8 border">
      <div>
        <h1 className="text-2xl font-bold mb-6">Overblik over indtægt</h1>
        <p className="mb-6 text-center">Budget page content goes here.</p>
      </div>
    </main>
  );
}
