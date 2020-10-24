import { Boggle } from "./BoggleGameMode.ts";
import Die from "../Die.ts";

export default class Boggle25 extends Boggle {
  dice = [
    new Die(["Qu", "B", "Z", "J", "X", "K"]),
    new Die(["T", "O", "U", "O", "T", "O"]),
    new Die(["O", "V", "W", "R", "G", "R"]),
    new Die(["A", "A", "A", "F", "S", "R"]),
    new Die(["A", "U", "M", "E", "E", "G"]),
    new Die(["H", "H", "L", "R", "D", "O"]),
    new Die(["N", "H", "D", "T", "H", "O"]),
    new Die(["L", "H", "N", "R", "O", "D"]),
    new Die(["A", "F", "A", "I", "S", "R"]),
    new Die(["Y", "I", "F", "A", "S", "R"]),
    new Die(["T", "E", "L", "P", "C", "I"]),
    new Die(["S", "S", "N", "S", "E", "U"]),
    new Die(["R", "I", "Y", "P", "R", "H"]),
    new Die(["D", "O", "R", "D", "L", "N"]),
    new Die(["C", "C", "W", "N", "S", "T"]),
    new Die(["T", "T", "O", "T", "E", "M"]),
    new Die(["S", "C", "T", "I", "E", "P"]),
    new Die(["E", "A", "N", "D", "N", "N"]),
    new Die(["M", "N", "N", "E", "A", "G"]),
    new Die(["U", "O", "T", "O", "W", "N"]),
    new Die(["A", "E", "A", "E", "E", "E"]),
    new Die(["Y", "I", "F", "P", "S", "R"]),
    new Die(["E", "E", "E", "E", "M", "A"]),
    new Die(["I", "T", "I", "T", "I", "E"]),
    new Die(["E", "T", "I", "L", "I", "C"]),
  ];
}
