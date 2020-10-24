import Die from "../Die.ts";
import { Boggle } from "./BoggleGameMode.ts";

export default class Boggle16 extends Boggle {
  readonly dice: Die[] = [
    new Die(["R", "I", "F", "O", "B", "X"]),
    new Die(["I", "F", "E", "H", "E", "Y"]),
    new Die(["D", "E", "N", "O", "W", "S"]),
    new Die(["U", "T", "O", "K", "N", "D"]),
    new Die(["H", "M", "S", "R", "A", "O"]),
    new Die(["L", "U", "P", "E", "T", "S"]),
    new Die(["A", "C", "I", "T", "O", "A"]),
    new Die(["Y", "L", "G", "K", "U", "E"]),
    new Die(["Qu", "B", "M", "J", "O", "A"]),
    new Die(["E", "H", "I", "S", "P", "N"]),
    new Die(["V", "E", "T", "I", "G", "N"]),
    new Die(["B", "A", "L", "I", "Y", "T"]),
    new Die(["E", "Z", "A", "V", "N", "D"]),
    new Die(["R", "A", "L", "E", "S", "C"]),
    new Die(["U", "W", "I", "L", "R", "G"]),
    new Die(["P", "A", "C", "E", "M", "D"]),
  ];
}
