export const printBoggle = (boggle: string[][]) => {
  let returnMsg = "";
  boggle.forEach((row) => {
    row.forEach((column) => {
      returnMsg += column + (column === "Qu" ? " " : "  ");
    });
    returnMsg += "\n";
  });
  return returnMsg;
};
