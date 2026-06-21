/**
 * Frequently asked questions.
 *
 * Single source for both the visible FAQ section on the home page and the
 * `FAQPage` JSON-LD. Keeping them identical is what makes the page eligible
 * for FAQ rich results and easy for AI engines to quote accurately.
 */
export interface FaqItem {
  question: string;
  /** Plain-text answer. Keep it self-contained and factual for GEO. */
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "Is PrismPrep free?",
    answer:
      "Yes. PrismPrep is completely free. There is no account to create, no paywall, and no trial — every practice question, timed test, and scoring report is available at no cost.",
  },
  {
    question: "What GRE sections does PrismPrep cover?",
    answer:
      "PrismPrep covers all three measured areas of the GRE General Test: Verbal Reasoning, Quantitative Reasoning, and Analytical Writing. Each section has 100 practice questions, for 300 questions in total across 18 timed practice tests.",
  },
  {
    question: "Do I need to create an account to practice?",
    answer:
      "No. You can start practicing immediately. PrismPrep runs entirely in your browser, so you can open a section, take a timed quiz, and get scored without signing up or sharing personal information.",
  },
  {
    question: "How does PrismPrep score my practice?",
    answer:
      "Verbal and Quantitative questions are scored instantly against the correct answers. Analytical Writing prompts include rubric-style guidance so you can evaluate your own essays against the qualities GRE graders look for.",
  },
  {
    question: "What types of questions are included?",
    answer:
      "Verbal includes reading comprehension, text completion, and sentence equivalence. Quantitative includes arithmetic, algebra, geometry, and data analysis. Analytical Writing includes Issue and Argument essay prompts.",
  },
  {
    question: "Is PrismPrep affiliated with ETS or the official GRE?",
    answer:
      "No. PrismPrep is an independent, free study tool and is not affiliated with or endorsed by ETS, the organization that administers the official GRE General Test.",
  },
];
