import { Category } from "@/services/api/category";

export const standardCategoriesToCreate: Array<Omit<Category, "id">> = [
  { name: "Løn", type: "income" },
  // { name: "Gaver", type: "income" },
  // { name: "Diverse Indtægter", type: "income" },
  // { name: "Mobilpay overførsler", type: "income" },
  { name: "Bolig", type: "expense" },
  // { name: "Mad og Drikke", type: "expense" },
  // { name: "Transport", type: "expense" },
  // { name: "Underholdning", type: "expense" },
  // { name: "Tøj og Sko", type: "expense" },
  // { name: "Regninger og Abonnementer", type: "expense" },
  // { name: "Opsparing", type: "expense" },
  // { name: "Diverse Udgifter", type: "expense" },
  // { name: "Mobilpay overførsler", type: "expense" },
];
