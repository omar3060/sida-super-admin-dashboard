import { SidebarData } from "@/core/json/siderbar_data";

// Interface for search result item
export interface SearchResult {
  label: string;
  link: string;
  icon?: string;
  category?: string;
}

// Function to extract all pages from sidebar data recursively
export const extractAllPages = (sidebarData: any[]): SearchResult[] => {
  const results: SearchResult[] = [];

  const extractFromItem = (item: any, category?: string) => {
    // If item has a direct link, add it to results
    if (item.link) {
      results.push({
        label: item.label,
        link: item.link,
        icon: item.icon,
        category: category || item.submenuHdr,
      });
    }

    // If item has submenuItems, recursively extract from them
    if (item.submenuItems && Array.isArray(item.submenuItems)) {
      const newCategory = category || item.submenuHdr || item.label;

      // Also add the parent item if it has a label (for search purposes)
      if (
        item.label &&
        !item.link &&
        item.submenuItems &&
        item.submenuItems.length > 0
      ) {
        // Find the first submenu item with a link
        const firstLinkItem = item.submenuItems.find(
          (subItem: any) => subItem.link
        );
        if (firstLinkItem) {
          results.push({
            label: item.label,
            link: firstLinkItem.link,
            icon: item.icon,
            category: newCategory,
          });
        }
      }

      item.submenuItems.forEach((subItem: any) => {
        extractFromItem(subItem, newCategory);
      });
    }
  };

  // Process each main section
  sidebarData.forEach((section: any) => {
    if (section.submenuItems) {
      section.submenuItems.forEach((item: any) => {
        extractFromItem(item, section.submenuHdr);
      });
    }
  });

  return results;
};

// Function to search through pages with debouncing
export const searchPages = (
  query: string,
  allPages: SearchResult[]
): SearchResult[] => {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase().trim();

  return allPages.filter(
    (page) =>
      page.label.toLowerCase().includes(searchTerm) ||
      (page.category && page.category.toLowerCase().includes(searchTerm))
  );
};

// Get all pages from sidebar data
export const getAllPages = (): SearchResult[] => {
  return extractAllPages(SidebarData);
};
