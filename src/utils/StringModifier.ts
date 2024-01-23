export const StringModifier = (initialValue: string) => {
  let result: string = initialValue;

  const builder = {
    get: () => result,
    removeDelimiters: () => {
      // Regular expression to match the outermost layer of delimiters
      const regex = /\$\{\d+:(.*?)\}/;

      // Continuously replace the outermost layer until no more delimiters are found
      while (regex.test(result)) {
        result = result.replace(regex, '$1');
      }

      // Replace escaped double quotes with regular double quotes
      result = result.replace(/\\"/g, '"');

      return builder;
    },
    escapeQuotes: () => {
      // Replace all double quotes with escaped double quotes
      result = result.replace(/"/g, '\\"');
      return builder;
    },
    convertToSnippetFormat: () => {
      result = result
        .split('\n')
        .map((line, i) => {
          const lineCount = result.split('\n').length;
          let lineBuilder: string = line;
          const isLastLine: boolean = i + 1 === lineCount;
          lineBuilder = `"${line}"`;
          if (!isLastLine) {
            lineBuilder = `${lineBuilder},\n`;
          }
          return `${lineBuilder}`;
        })
        .join('');
      result = `[\n${result}\n]`;
      return builder;
    },
  };
  return builder;
};