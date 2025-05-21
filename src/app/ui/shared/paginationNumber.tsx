// Hjælpefunktion til at generere sidetal-elementer
export const getPaginationItems = (
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
) => {
  const pageNeighbours = 1; // Antal sider at vise på hver side af den aktuelle side
  const items: (number | string)[] = [];

  // Altid vis første side
  items.push(1);

  // Venstre ellipsis
  if (currentPage - pageNeighbours > 2) {
    items.push("...");
  }

  // Sider omkring den aktuelle side
  const startPage = Math.max(2, currentPage - pageNeighbours);
  const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

  for (let i = startPage; i <= endPage; i++) {
    items.push(i);
  }

  // Højre ellipsis
  if (currentPage + pageNeighbours < totalPages - 1) {
    items.push("...");
  }

  // Altid vis sidste side (hvis den ikke allerede er vist)
  if (totalPages > 1) {
    items.push(totalPages);
  }

  return items.map((item, index) => {
    if (typeof item === "string") {
      return (
        <span
          key={`ellipsis-${index}`}
          className="px-2 py-1 text-sm text-gray-400"
        >
          ...
        </span>
      );
    }
    return (
      <button
        key={item}
        onClick={() => onPageChange(item)}
        disabled={currentPage === item}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
                    ${
                      currentPage === item
                        ? "bg-sky-500 text-white cursor-default"
                        : "bg-gray-600 hover:bg-gray-500 text-gray-200"
                    }`}
      >
        {item}
      </button>
    );
  });
};
