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

export const arrayIntersection = async (
  a: string[],
  b: string[],
): Promise<string[]> => {
  return new Promise((resolve) => {
    const sorted_a = a.concat().sort();
    const sorted_b = b.concat().sort();
    let intersection = [];
    let a_i = 0;
    let b_i = 0;

    while (a_i < a.length && b_i < b.length) {
      if (sorted_a[a_i] === sorted_b[b_i]) {
        intersection.push(sorted_a[a_i]);
        a_i++;
        b_i++;
      } else if (sorted_a[a_i] < sorted_b[b_i]) {
        a_i++;
      } else {
        b_i++;
      }
    }
    resolve(intersection);
  });
};
