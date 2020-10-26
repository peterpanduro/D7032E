import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.74.0/testing/asserts.ts";
import Boggle16 from "./Boggle16.ts";
import { Settings } from "./BoggleGameMode.ts";
import Foggle16 from "./Foggle16.ts";

// **************************************
// *                                    *
// *             COMMON                 *
// *                                    *
// **************************************

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

// **************************************
// *                                    *
// *             BOGGLE                 *
// *                                    *
// **************************************

Deno.test({
  name: "Calculate work with Qu",
  fn: () => {
    const gameMode = new Boggle16();
    let result = gameMode.calculateScore(["quality"]);
    assertEquals(result, 5);
  },
});

Deno.test({
  name: "Verify existing word",
  fn: () => {
    const gameMode = new Boggle16();
    const result = gameMode.verify("AARDVARK");
    assert(result);
  },
});

Deno.test({
  name: "Verify existing word using lowecase",
  fn: () => {
    const gameMode = new Boggle16();
    const result = gameMode.verify("aardvark");
    assert(result);
  },
});

Deno.test({
  name: "Verify non-existing word",
  fn: () => {
    const gameMode = new Boggle16();
    const result = gameMode.verify("AAARDVARK");
    assert(!result);
  },
});

Deno.test({
  name: "Can play word",
  fn: () => {
    const gameMode = new Boggle16();
    const boggle = [
      ["H", "X", "X", "X"],
      ["E", "L", "L", "O"],
      ["X", "X", "X", "X"],
      ["X", "X", "X", "X"],
    ];
    assert(gameMode.canPlay("HELLO", boggle));
  },
});

Deno.test({
  name: "Can't play word",
  fn: () => {
    const gameMode = new Boggle16();
    const boggle = [
      ["S", "X", "X", "X"],
      ["C", "A", "R", "X"],
      ["B", "X", "X", "X"],
      ["X", "X", "X", "X"],
    ];
    assert(!gameMode.canPlay("HELLO", boggle));
  },
});

Deno.test({
  name: "Can play - Multiple paths",
  fn: () => {
    const gameMode = new Boggle16();
    const boggle = [
      ["H", "E", "X", "X"],
      ["E", "L", "L", "X"],
      ["L", "X", "X", "X"],
      ["L", "O", "X", "X"],
    ];
    assert(gameMode.canPlay("HELLO", boggle));
  },
});

Deno.test({
  name: "Can play - Qu",
  fn: () => {
    const gameMode = new Boggle16();
    const boggle = [
      ["Qu", "A", "X", "X"],
      ["X", "C", "X", "X"],
      ["X", "K", "X", "X"],
      ["X", "X", "X", "X"],
    ];
    assert(gameMode.canPlay("QUACK", boggle));
  },
});

Deno.test({
  name: "Can play - Q",
  fn: () => {
    const gameMode = new Boggle16();
    const boggle = [
      ["Qu", "X", "X", "X"],
      ["O", "X", "X", "X"],
      ["P", "X", "X", "X"],
      ["X", "H", "X", "X"],
    ];
    assert(gameMode.canPlay("QOPH", boggle));
  },
});

Deno.test({
  name: "Can play - Q in word",
  fn: () => {
    const gameMode = new Boggle16();
    const boggle = [
      ["B", "X", "X", "X"],
      ["A", "X", "X", "X"],
      ["X", "N", "X", "X"],
      ["X", "Q", "A", "X"],
    ];
    assert(gameMode.canPlay("BANQA", boggle));
  },
});

Deno.test({
  name: "Can play - Starts at non [0, 0] index",
  fn: () => {
    const gameMode = new Boggle16();
    const boggle = [
      ["X", "X", "X", "X"],
      ["X", "A", "C", "X"],
      ["X", "R", "S", "X"],
      ["X", "X", "X", "X"],
    ];
    assert(gameMode.canPlay("SCAR", boggle));
  },
});

Deno.test({
  name: "Can play - Qu starts at non [0, 0] index",
  fn: () => {
    const gameMode = new Boggle16();
    const boggle = [
      ["X", "X", "X", "X"],
      ["T", "X", "X", "X"],
      ["X", "I", "Qu", "X"],
      ["X", "X", "X", "X"],
    ];
    assert(gameMode.canPlay("QUIT", boggle));
  },
});

Deno.test({
  name: "Can play - Q starts at non [0, 0] index",
  fn: () => {
    const gameMode = new Boggle16();
    const boggle = [
      ["X", "X", "X", "X"],
      ["X", "A", "Q", "X"],
      ["X", "R", "S", "X"],
      ["X", "P", "X", "X"],
    ];
    assert(gameMode.canPlay("SPRAQ", boggle));
  },
});

// **************************************
// *                                    *
// *             CONFIG                 *
// *                                    *
// **************************************

Deno.test({
  name: "Can play - Generous",
  fn: () => {
    const config = new Settings(true, false);
    const gameMode = new Boggle16(config);
    const boggle = [
      ["S", "E", "X", "X"],
      ["C", "A", "R", "X"],
      ["B", "X", "X", "X"],
      ["X", "X", "X", "X"],
    ];
    assert(gameMode.canPlay("SCARAB", boggle));
  },
});

Deno.test({
  name: "Can't play - Generous",
  fn: () => {
    const config = new Settings(true, false);
    const gameMode = new Boggle16(config);
    const boggle = [
      ["S", "A", "X", "X"],
      ["C", "X", "R", "X"],
      ["B", "X", "X", "X"],
      ["X", "X", "X", "X"],
    ];
    assert(!gameMode.canPlay("SCARAB", boggle));
  },
});

Deno.test({
  name: "Battle Boggle only accept first occurence",
  fn: () => {
    const config = new Settings(false, true);
    const gameMode = new Boggle16(config);
    const expectTrue = gameMode.add("HELLO");
    assert(expectTrue);
    const expectFalse = gameMode.add("HELLO");
    assert(!expectFalse);
  },
});

// **************************************
// *                                    *
// *             FOGGLE                 *
// *                                    *
// **************************************

Deno.test({
  name: "Foggle score",
  fn: () => {
    const expected = 2;
    const gameMode = new Foggle16();
    const wordlist: Array<string> = ["3+2=5", "3-1=2"];
    const result = gameMode.calculateScore(wordlist);
    assertEquals(result, expected);
  },
});

Deno.test({
  name: "Verify expression",
  fn: () => {
    const gameMode = new Foggle16();
    const result = gameMode.verify("1+2=3");
    assert(result);
  },
});

Deno.test({
  name: "Verify false expression",
  fn: () => {
    const gameMode = new Foggle16();
    const result = gameMode.verify("1+2=4");
    assert(!result);
  },
});

Deno.test({
  name: "Verify subtraction",
  fn: () => {
    const gameMode = new Foggle16();
    const result = gameMode.verify("2-2=0");
    assert(result);
  },
});

Deno.test({
  name: "Verify multiplication",
  fn: () => {
    const gameMode = new Foggle16();
    const result = gameMode.verify("1*2=2");
    assert(result);
  },
});

Deno.test({
  name: "Verify division",
  fn: () => {
    const gameMode = new Foggle16();
    const result = gameMode.verify("2/2=1");
    assert(result);
  },
});

Deno.test({
  name: "Verify longer expression",
  fn: () => {
    const gameMode = new Foggle16();
    const result = gameMode.verify("2/2+8-2*2=5");
    assert(result);
  },
});

Deno.test({
  name: "Multiple equals in a row to return false",
  fn: () => {
    const gameMode = new Foggle16();
    const result = gameMode.verify("2/2+8-2*2===5");
    assert(!result);
  },
});

Deno.test({
  name: "Reject pow using **",
  fn: () => {
    const gameMode = new Foggle16();
    const result = gameMode.verify("2**2=4");
    assert(!result);
  },
});

Deno.test({
  name: "Reject multiple separated equal signs =",
  fn: () => {
    const gameMode = new Foggle16();
    const result = gameMode.verify("4=4=4");
    assert(!result);
  },
});

Deno.test({
  name: "Reject unvalid chars",
  fn: () => {
    const gameMode = new Foggle16();
    assert(!gameMode.verify("4s+4=4"));
    assert(!gameMode.verify("4%4=0"));
  },
});
