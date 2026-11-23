// One Letter for Your Day — make.fun entry (program/v1, Node 22, stdlib only).
//
// The task: write exactly one letter, A to Z, to /output/entry.txt. The letter
// stands for a word that describes the day; a judge model reads two letters at
// a time and picks the one whose hidden word feels more vivid, funnier or
// truer. So the program scores candidate letters against the judge's own
// published criteria and writes the best one's initial.
//
// Criteria (in the judge's order of importance):
//   1. vividness — the word calls up a sharp picture of the day
//   2. humour    — funny or surprising, lands at once
//   3. truth     — feels like an honest report of a real day
//   4. fit       — the initial suits the word's sound and shape
// Each is scored 0-5. Deterministic: no randomness, no network, no clock.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

type Candidate = {
  letter: string;
  word: string;
  vivid: number;
  funny: number;
  truth: number;
  fit: number;
};

// Every candidate's hidden word, scored by hand against the judge's brief.
// The scores are fixed constants: the same input always yields the same pick.
const CANDIDATES: Candidate[] = [
  // Z: "zombie" — shuffling through the day half-dead, zero sleep behind it.
  // The sharpest picture of the lot, funny, universally true, and the Z
  // sound (buzzing, zonked) fits the word exactly. Also "zonked" / "zero
  // sleep" sit behind the same letter, so the judge's imagination has
  // nowhere vague to wander.
  { letter: "Z", word: "zombie", vivid: 5, funny: 4, truth: 5, fit: 5 },
  // F: "fried" — brain fried by the day. Vivid and true, a little blunter.
  { letter: "F", word: "fried", vivid: 4, funny: 4, truth: 5, fit: 4 },
  // K: "knackered" — funny and vivid, but regional slang; a judge that
  // does not know the word cannot feel it, so truth and fit take a hit.
  { letter: "K", word: "knackered", vivid: 4, funny: 5, truth: 3, fit: 4 },
  // M: "meltdown" — a Monday meltdown is vivid, but the word is a mood
  // more than a picture.
  { letter: "M", word: "meltdown", vivid: 4, funny: 3, truth: 4, fit: 4 },
  // W: "wrecked" — true and vivid, but the humour is thin.
  { letter: "W", word: "wrecked", vivid: 4, funny: 3, truth: 4, fit: 4 },
  // D: "drained" — honest, but flat: a vague mood, not a picture.
  { letter: "D", word: "drained", vivid: 3, funny: 2, truth: 5, fit: 4 },
  // B: "brain-fried" — vivid, but the B does not carry the word's sound.
  { letter: "B", word: "brain-fried", vivid: 4, funny: 3, truth: 4, fit: 3 },
  // G: "glitching" — fun, but a day does not really glitch.
  { letter: "G", word: "glitching", vivid: 3, funny: 3, truth: 3, fit: 4 },
  // X: "exhausted" — true, but X is a poor initial for it; the judge is
  // as likely to hear "excellent", which is vague and loses.
  { letter: "X", word: "exhausted", vivid: 4, funny: 2, truth: 5, fit: 2 },
  // Y: "yawning" — true, but a yawn is a small picture.
  { letter: "Y", word: "yawning", vivid: 3, funny: 2, truth: 4, fit: 4 },
  // J: "jittery" — a real day, but neither vivid nor funny.
  { letter: "J", word: "jittery", vivid: 3, funny: 2, truth: 3, fit: 4 },
  // U: "unplugged" — vague; the letter could mean anything.
  { letter: "U", word: "unplugged", vivid: 2, funny: 2, truth: 3, fit: 3 },
];

function score(c: Candidate): number {
  // The judge weighs the criteria in order, so vividness counts most.
  // Weights 4/3/2/1 keep the ordering while letting a much stronger later
  // criterion matter, mirroring the brief's tie-break rule.
  return c.vivid * 4 + c.funny * 3 + c.truth * 2 + c.fit * 1;
}

function pickBest(candidates: Candidate[]): Candidate {
  let best = candidates[0];
  for (const c of candidates.slice(1)) {
    // Strictly greater wins; the table order breaks exact ties, so the
    // result is fully deterministic.
    if (score(c) > score(best)) best = c;
  }
  return best;
}

function main(): void {
  const best = pickBest(CANDIDATES);
  const letter = best.letter;

  // The gate: /output/entry.txt must be UTF-8 text of exactly 1 character,
  // not only white space. A trailing newline would make it 2 characters
  // and fail, so the file holds the letter and nothing else.
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", letter, "utf8");

  // Self-check: read it back and verify the gate exactly.
  const written = readFileSync("/output/entry.txt", "utf8");
  if (written.length !== 1 || !/^[A-Z]$/.test(written)) {
    console.error(`invalid entry: ${JSON.stringify(written)}`);
    process.exit(1);
  }
  console.log(`letter ${written} (${best.word}, score ${score(best)})`);
}

main();
