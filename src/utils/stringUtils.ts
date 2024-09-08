export function safeTitleCase(str: string): string {
    if (typeof str.titleCase === 'function') {
      return str.titleCase();
    } else {
      // Fallback implementation
      return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
  }