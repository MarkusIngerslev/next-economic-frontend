import { IncomeRecord } from "@/services/api"; // Eller hvor din type er defineret

export const calculateIncomeThisYear = (
  incomeData: IncomeRecord[],
  currentYear: number
): number => {
  return incomeData
    .filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate.getFullYear() === currentYear;
    })
    .reduce((sum, current) => sum + parseFloat(current.amount), 0);
};

export const calculateIncomeThisMonth = (
  incomeData: IncomeRecord[],
  currentMonth: number,
  currentYear: number
): number => {
  return incomeData
    .filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, current) => sum + parseFloat(current.amount), 0);
};

export const calculateAverageMonthlyIncomeThisYear = (
  incomeThisYear: number,
  currentMonth: number
): number => {
  return currentMonth + 1 > 0 ? incomeThisYear / (currentMonth + 1) : 0;
};
