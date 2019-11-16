export const camelToSnake = (string: string) => {
    return string.replace(/[\w]([A-Z])/g, (m) => {
        return m[0] + "_" + m[1];
    }).toLowerCase();
};

export const toCamelCase = (string: string) => {
    return string.replace(/([-_][a-z])/ig, (m) => {
      return m.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
};