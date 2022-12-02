//* capitalize data
export const capitalize = (data: string): string => {
  const lowerCase: string = data.toLocaleLowerCase();
  return lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1);
};
