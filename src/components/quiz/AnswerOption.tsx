"use client";

interface AnswerOptionProps {
  label: string;
  selected: boolean;
  correct?: boolean | null;
  incorrect?: boolean | null;
  disabled?: boolean;
  onClick: () => void;
}

export default function AnswerOption({
  label,
  selected,
  correct,
  incorrect,
  disabled,
  onClick,
}: AnswerOptionProps) {
  let cls = "answer-option";
  if (correct) cls += " answer-option--correct";
  else if (incorrect) cls += " answer-option--incorrect";
  else if (selected) cls += " answer-option--selected";

  return (
    <button className={cls} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
