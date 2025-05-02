"use client";

import clsx from "clsx";

interface SummaryCardProps {
  className?: string;
  title?: string;
  content?: string;
}

export default function SummaryCard({
  className,
  title = "Card Title",
  content = "Card content goes here.",
}: SummaryCardProps) {
  return (
    <div
      className={clsx(
        "bg-white p-4 rounded shadow-xl text-stone-600",
        className
      )}
    >
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p>{content}</p>
    </div>
  );
}
