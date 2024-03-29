import {
	assertEquals,
	assertNotEquals,
} from "https://deno.land/std@0.74.0/testing/asserts.ts";
import Die from "./Die.ts";
import Boggle16 from "./GameModes/Boggle16.ts";
import Foggle16 from "./GameModes/Foggle16.ts";
import { shuffle } from "./Utils.ts";
import {
	rollAndPlaceDice,
	sortByScore,
	findAllWordsInBoard,
} from "./GameUtils.ts";

Deno.test({
	name: "Shuffle",
	fn: () => {
		const boggle = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
		const actual = shuffle(boggle);
		const notExpected = [
			"A",
			"B",
			"C",
			"D",
			"E",
			"F",
			"G",
			"H",
			"I",
			"J",
			"K",
			"L",
		];
		assertNotEquals(actual, notExpected);
	},
});

Deno.test({
	name: "Shuffle array with arrays",
	fn: () => {
		const boggle = [
			["1", "2", "3", "4"],
			["2", "3", "4", "1"],
			["3", "4", "1", "2"],
			["4", "1", "2", "3"],
			["1", "2", "3", "4"],
			["2", "3", "4", "1"],
			["3", "4", "1", "2"],
			["4", "1", "2", "3"],
			["1", "2", "3", "4"],
			["2", "3", "4", "1"],
			["3", "4", "1", "2"],
			["4", "1", "2", "3"],
		];
		const actual = shuffle(boggle);
		const notExpected = [
			["1", "2", "3", "4"],
			["2", "3", "4", "1"],
			["3", "4", "1", "2"],
			["4", "1", "2", "3"],
			["1", "2", "3", "4"],
			["2", "3", "4", "1"],
			["3", "4", "1", "2"],
			["4", "1", "2", "3"],
			["1", "2", "3", "4"],
			["2", "3", "4", "1"],
			["3", "4", "1", "2"],
			["4", "1", "2", "3"],
		];
		assertNotEquals(actual, notExpected);
	},
});

Deno.test({
	name: "Roll and place dice",
	fn: () => {
		const dice = [
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
		const placedDice = rollAndPlaceDice(dice);
		assertEquals(placedDice.length, 4);
		assertEquals(placedDice[0].length, 4);
		placedDice.forEach((row) => {
			row.forEach((column) => {
				assertNotEquals(column, undefined);
			});
		});
	},
});

Deno.test({
	name: "Sort list by score",
	fn: () => {
		const a = ["dock"];
		const b = ["knowledge"];
		const list = [a, b];
		const sorted = list.sort((a: string[], b: string[]) => {
			return sortByScore(new Boggle16(), a, b);
		});
		const expected = [b, a];
		assertEquals(sorted, expected);
	},
});

Deno.test({
	name: "Sort list by score, more words",
	fn: () => {
		const a = ["dock", "cork", "dork", "zoning", "zombie", "goods", "spoof"];
		const b = ["knowledge", "pop"];
		const list = [a, b];
		const sorted = list.sort((a: string[], b: string[]) => {
			return sortByScore(new Boggle16(), a, b);
		});
		const expected = [a, b];
		assertEquals(sorted, expected);
	},
});

Deno.test({
	name: "Sort list by score, more players",
	fn: () => {
		const a = ["dock"];
		const b = ["knowledge"];
		const c: string[] = [];
		const d = ["clock"];
		const list = [a, b, c, d];
		const sorted = list.sort((a: string[], b: string[]) => {
			return sortByScore(new Boggle16(), a, b);
		});
		const expected = [b, d, a, c];
		assertEquals(sorted, expected);
	},
});

Deno.test({
	name: "Find all words in Boggle 2x2",
	fn: async () => {
		const board = [
			["B", "K"],
			["A", "R"],
		];
		const gameMode = new Boggle16();
		const result = await findAllWordsInBoard(board, gameMode);
		assertEquals(
			result,
			new Set([
				"AB",
				"AR",
				"ARB",
				"ARK",
				"BA",
				"BAR",
				"BARK",
				"BRA",
				"BRAK",
				"KA",
				"KAB",
				"KBAR",
				"KRAB",
			])
		);
	},
});

Deno.test({
	name: "Find all words in 3x3 Boggle",
	fn: async () => {
		const board = [
			["W", "O", "A"],
			["T", "Z", "B"],
			["T", "Z", "B"],
		];
		const gameMode = new Boggle16();
		const result = await findAllWordsInBoard(board, gameMode);
		assertEquals(
			result,
			new Set([
				"AB",
				"ABB",
				"ABO",
				"AZO",
				"BA",
				"BAO",
				"BAZZ",
				"BO",
				"BOA",
				"BOT",
				"BOTT",
				"BOW",
				"OB",
				"OBA",
				"OW",
				"OWT",
				"TO",
				"TOW",
				"TWO",
				"WO",
				"WOT",
				"ZA",
				"ZO",
				"ZOA",
			])
		);
	},
});

// Deno.test({
//   name: "Find all words in 4x4 Boggle",
//   fn: async () => {
//     const board = [
//       ["W", "O", "A", "K"],
//       ["T", "Z", "B", "C"],
//       ["T", "Z", "B", "U"],
//       ["I", "M", "D", "F"],
//     ];
//     const gameMode = new Boggle16();
//     const result = await findAllWordsInBoard(board, gameMode);
//     assertEquals(
//       result,
//       new Set(
//         [
//           "AB",
//           "ABB",
//           "ABO",
//           "AZO",
//           "BA",
//           "BAC",
//           "BACK",
//           "BAO",
//           "BAZZ",
//           "BO",
//           "BOA",
//           "BOAK",
//           "BOT",
//           "BOTT",
//           "BOW",
//           "BUB",
//           "BUBA",
//           "BUBO",
//           "BUCK",
//           "BUD",
//           "CAB",
//           "CAZ",
//           "CUB",
//           "CUD",
//           "DUB",
//           "DUBBO",
//           "DUCK",
//           "FUB",
//           "FUCK",
//           "FUD",
//           "IT",
//           "KA",
//           "KAB",
//           "MI",
//           "MITT",
//           "MIZ",
//           "MIZZ",
//           "OAK",
//           "OB",
//           "OBA",
//           "OW",
//           "OWT",
//           "TI",
//           "TIZ",
//           "TIZZ",
//           "TO",
//           "TOW",
//           "TWO",
//           "WO",
//           "WOT",
//           "ZA",
//           "ZACK",
//           "ZIMB",
//           "ZIT",
//           "ZO",
//           "ZOA",
//           "ZOBU",
//         ],
//       ),
//     );
//   },
// });

Deno.test({
	name: "Find no words in Foggle",
	fn: async () => {
		const board = [
			["1", "3", "4", "2"],
			["2", "5", "9", "3"],
			["3", "8", "2", "0"],
			["1", "2", "5", "8"],
		];
		const gameMode = new Foggle16();
		const result = await findAllWordsInBoard(board, gameMode);
		assertEquals(result, []);
	},
});
