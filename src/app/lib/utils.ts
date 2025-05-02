// filepath: d:\github\Fritid\Learning-projects\spending-budget\next-economic-frontend\src\app\lib\utils.ts
import { format, parseISO } from "date-fns";
import { da } from "date-fns/locale"; // Import Danish locale

// Formaterer en ISO-datostreng (f.eks. "2025-02-26") til et lokalt format (f.eks. "26. feb. 2025")
export const formatDateToLocal = (
  dateStr: string,
  localeStr: string = "da-DK"
): string => {
  try {
    const date = parseISO(dateStr); // Parser ISO strengen til et Date objekt
    // Bruger 'da' locale fra date-fns for danske månedsnavne etc.
    return format(date, "P", { locale: da }); // 'P' er et datoformat (f.eks. 02/26/2025), juster efter behov
    // Andre formater: 'PP' (Feb 26, 2025), 'PPP' (February 26th, 2025), 'PPPP' (Wednesday, February 26th, 2025)
    // Eller specifikt format: format(date, 'dd. MMM yyyy', { locale: da }) -> 26. feb. 2025
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateStr; // Returner original streng ved fejl
  }
};

// Formaterer et tal som valuta (f.eks. 12500 til "12.500,00 kr.")
export const formatCurrency = (
  amount: number,
  currencyCode: string = "DKK",
  localeStr: string = "da-DK"
): string => {
  try {
    return new Intl.NumberFormat(localeStr, {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return String(amount); // Returner tallet som streng ved fejl
  }
};
