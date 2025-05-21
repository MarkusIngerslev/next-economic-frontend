"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

interface MonthYearSelectorProps {
  selectedDate: Date;
  onDateChange: (newDate: Date) => void;
  buttonTextPrefix?: string;
}

const months = [
  "Januar",
  "Februar",
  "Marts",
  "April",
  "Maj",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "December",
];

export default function MonthYearSelector({
  selectedDate,
  onDateChange,
  buttonTextPrefix = "Data for:",
}: MonthYearSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(selectedDate.getFullYear());
  const [pickerMonth, setPickerMonth] = useState(selectedDate.getMonth());

  useEffect(() => {
    setPickerYear(selectedDate.getFullYear());
    setPickerMonth(selectedDate.getMonth());
  }, [selectedDate]);

  const handleApply = () => {
    onDateChange(new Date(pickerYear, pickerMonth, 1));
    setIsModalOpen(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    setPickerMonth(monthIndex);
  };

  const formattedButtonDate = selectedDate.toLocaleString("da-DK", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex w-120 items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
      >
        <CalendarDaysIcon
          className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-300"
          aria-hidden="true"
        />
        {buttonTextPrefix} {formattedButtonDate}
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Vælg Måned og År
              </h2>

              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => setPickerYear(pickerYear - 1)}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Forrige år"
                >
                  <ChevronLeftIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </button>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {pickerYear}
                </span>
                <button
                  onClick={() => setPickerYear(pickerYear + 1)}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Næste år"
                >
                  <ChevronRightIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(index)}
                    className={`p-2 rounded-md text-sm font-medium transition-colors
                      ${
                        pickerMonth === index
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                  >
                    {month}
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Annuller
                </button>
                <button
                  onClick={handleApply}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Anvend
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
