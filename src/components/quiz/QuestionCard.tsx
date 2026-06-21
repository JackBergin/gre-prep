import { Question } from "@/lib/types";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
}

const typeLabels: Record<string, string> = {
  "reading-comprehension": "Reading Comprehension",
  "text-completion": "Text Completion",
  "sentence-equivalence": "Sentence Equivalence",
  arithmetic: "Arithmetic",
  algebra: "Algebra",
  geometry: "Geometry",
  "data-analysis": "Data Analysis",
  "issue-task": "Issue Task",
  "argument-task": "Argument Task",
};

export default function QuestionCard({ question, index, total }: QuestionCardProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 flex-wrap">
        <Chip as="span">{typeLabels[question.type] ?? question.type}</Chip>
        <span className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
          Question {index + 1} of {total}
        </span>
      </div>

      {question.passage && (
        <Card className="text-sm leading-relaxed" style={{ color: "var(--ink)", fontSize: "14px" }}>
          <p className="chip mb-3" style={{ boxShadow: "none", paddingLeft: 0, background: "transparent" }}>
            Passage
          </p>
          <p style={{ whiteSpace: "pre-line" }}>{question.passage}</p>
        </Card>
      )}

      <Card>
        <p className="font-medium text-base leading-relaxed" style={{ whiteSpace: "pre-line" }}>
          {question.prompt}
        </p>
      </Card>
    </div>
  );
}
