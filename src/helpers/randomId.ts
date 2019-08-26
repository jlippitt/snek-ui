export default (prefix: string): string =>
  prefix +
  Math.random()
    .toString(16)
    .substr(2);
