import { assertEquals } from "https://deno.land/std@0.74.0/testing/asserts.ts";
import Boggle16 from "./Boggle16.ts";
import Foggle16 from "./Foggle16.ts";

Deno.test({
	name: "Empty words list calculates score zero",
	fn: () => {
		const expected = 0;
		const gameMode = new Boggle16();
		const wordlist: Array<string> = [];
		const result = gameMode.calculateScore(wordlist);
		assertEquals(result, expected);
	},
});

Deno.test({
	name: "Each word length gives the correct amount of points",
	fn: () => {
		const gameMode = new Boggle16();
		let result = gameMode.calculateScore(["a"]);
		assertEquals(result, 0);
		result = gameMode.calculateScore(["to"]);
		assertEquals(result, 0);
		result = gameMode.calculateScore(["and"]);
		assertEquals(result, 1);
		result = gameMode.calculateScore(["cart"]);
		assertEquals(result, 1);
		result = gameMode.calculateScore(["spent"]);
		assertEquals(result, 2);
		result = gameMode.calculateScore(["scared"]);
		assertEquals(result, 3);
		result = gameMode.calculateScore(["bedroll"]);
		assertEquals(result, 5);
		result = gameMode.calculateScore(["absolute"]);
		assertEquals(result, 11);
		result = gameMode.calculateScore(["knowledge"]);
		assertEquals(result, 11);
	},
});

Deno.test({
	name: "Calculate work with Qu",
	fn: () => {
		const gameMode = new Boggle16();
		let result = gameMode.calculateScore(["quality"]);
		assertEquals(result, 5);
	},
});

Deno.test({
	name: "Foggle dice",
	fn: () => {
		const expected = 2;
		const gameMode = new Foggle16();
		const wordlist: Array<string> = ["3+2=5", "3-1=2"];
		const result = gameMode.calculateScore(wordlist);
		assertEquals(result, expected);
	},
});

Deno.test({
	name: "Verify existing word",
	fn: () => {
		const gameMode = new Boggle16();
		const result = gameMode.verify("AARDVARK");
		assertEquals(result, true);
	},
});

Deno.test({
	name: "Verify existing word using lowecase",
	fn: () => {
		const gameMode = new Boggle16();
		const result = gameMode.verify("aardvark");
		assertEquals(result, true);
	},
});

Deno.test({
	name: "Verify non-existing word ",
	fn: () => {
		const gameMode = new Boggle16();
		const result = gameMode.verify("AAARDVARK");
		assertEquals(result, false);
	},
});
