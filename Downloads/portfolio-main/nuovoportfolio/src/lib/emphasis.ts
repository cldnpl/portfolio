import { Fragment, createElement, type ReactNode } from "react";

/**
 * Key concepts in the copy are marked **like this**. A marker can open in one
 * word and close in a later one, and punctuation may follow it ("**Naples**,").
 */
export type Segment = { text: string; bold: boolean };
export type Word = Segment[];

export const parseEmphasis = (text: string): Word[] => {
  let bold = false;
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((raw) => {
      const word: Word = [];
      raw.split("**").forEach((part, i) => {
        if (i > 0) bold = !bold;
        if (part) word.push({ text: part, bold });
      });
      return word;
    })
    .filter((word) => word.length > 0);
};

/** The text without markers, for meta tags and alt text. */
export const plainText = (text: string) => text.replace(/\*\*/g, "");

const BOLD_STYLE = { fontWeight: 600 };

/** One word's segments, with the bold parts in <strong>. */
export const renderWord = (word: Word) =>
  word.map((seg, i) =>
    seg.bold ? createElement("strong", { key: i, style: BOLD_STYLE }, seg.text) : createElement(Fragment, { key: i }, seg.text),
  );

/** Plain inline rendering (no per-word spans), for text split by lines elsewhere. */
export const renderEmphasis = (text: string): ReactNode =>
  parseEmphasis(text).map((word, i, all) =>
    createElement(Fragment, { key: i }, ...renderWord(word), i < all.length - 1 ? " " : null),
  );
