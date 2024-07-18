declare global {
    interface String {
      titleCase(): string;
    }
  }
  
  String.prototype.titleCase = function(this: string): string {
    return this
      // Split on whitespace and camelCase transitions
      .split(/(?=[A-Z])|[\s_-]+/)
      .map(word => {
        // Handle all-uppercase words
        if (word === word.toUpperCase()) {
          return word.toLowerCase();
        }
        // Capitalize the first letter, lowercase the rest
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  };
  
  // This export is necessary to make this a module
  export {};