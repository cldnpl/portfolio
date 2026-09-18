import { Fragment } from "react";

type Props = {
  text: string;
  /** ms between each word */
  stagger?: number;
  /** ms before the first word moves */
  delay?: number;
  className?: string;
};

/**
 * Wraps each word in an overflow-hidden box so it can rise into place.
 * The parent carries `is-in`; this component only describes the geometry.
 */
export default function SplitWords({ text, stagger = 55, delay = 0, className }: Props) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="a-word">
            <span style={{ ["--word-delay" as string]: `${delay + i * stagger}ms` }}>{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
