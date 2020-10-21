import {
	assertEquals,
	assertNotEquals,
} from "https://deno.land/std@0.74.0/testing/asserts.ts";
import Boggle16 from "./GameModes/Boggle16.ts";
import BoggleGameMode from "./GameModes/BoggleGameMode.ts";
import { shuffle, rollAndPlaceDice, sortFunc } from "./GameUtils.ts";

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
			["R", "I", "F", "O", "B", "X"],
			["I", "F", "E", "H", "E", "Y"],
			["D", "E", "N", "O", "W", "S"],
			["U", "T", "O", "K", "N", "D"],
			["H", "M", "S", "R", "A", "O"],
			["L", "U", "P", "E", "T", "S"],
			["A", "C", "I", "T", "O", "A"],
			["Y", "L", "G", "K", "U", "E"],
			["Qu", "B", "M", "J", "O", "A"],
			["E", "H", "I", "S", "P", "N"],
			["V", "E", "T", "I", "G", "N"],
			["B", "A", "L", "I", "Y", "T"],
			["E", "Z", "A", "V", "N", "D"],
			["R", "A", "L", "E", "S", "C"],
			["U", "W", "I", "L", "R", "G"],
			["P", "A", "C", "E", "M", "D"],
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
			return sortFunc(new Boggle16(), a, b);
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
			return sortFunc(new Boggle16(), a, b);
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
			return sortFunc(new Boggle16(), a, b);
		});
		const expected = [b, d, a, c];
		assertEquals(sorted, expected);
	},
});
