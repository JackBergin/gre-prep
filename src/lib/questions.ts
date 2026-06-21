import { Question } from "./types";

const heatIslandPassage =
  `The phenomenon of \u201curban heat islands\u201d arises when densely built environments ` +
  `absorb and retain solar radiation far more efficiently than surrounding rural areas. ` +
  `Dark impervious surfaces\u2014roads, rooftops, parking lots\u2014replace vegetation that would ` +
  `otherwise release moisture through evapotranspiration, a cooling mechanism. As a result, ` +
  `city centers can register temperatures 1\u20137\u00b0C higher than nearby countryside, ` +
  `intensifying energy demand for cooling, worsening air quality, and exacerbating ` +
  `heat-related illness among vulnerable populations.`;

const sciencePassage =
  `Historians of science have long debated whether scientific revolutions follow a gradual ` +
  `accumulation of evidence or occur in sudden paradigm shifts, as Thomas Kuhn famously argued. ` +
  `Recent cognitive science research complicates both models: it suggests that scientists, like ` +
  `all humans, exhibit confirmation bias\u2014a tendency to seek data confirming existing beliefs\u2014` +
  `which slows incremental change. Yet it also shows that when anomalies accumulate beyond a ` +
  `threshold, belief revision can be remarkably rapid. This implies that progress is neither ` +
  `purely gradualist nor purely revolutionary but oscillates between periods of biased stability ` +
  `and sudden reorganization.`;

export const questions: Question[] = [
  // ── VERBAL REASONING ──────────────────────────────────────────────────────

  {
    id: "v1",
    section: "verbal",
    type: "reading-comprehension",
    passage: heatIslandPassage,
    prompt:
      "According to the passage, which of the following best explains why urban areas are hotter than rural areas?",
    options: [
      "Urban residents consume more energy than rural residents.",
      "Impervious surfaces replace vegetation that would otherwise cool through moisture release.",
      "Cities generate more greenhouse gases per capita than rural regions.",
      "Rural areas benefit from stronger prevailing winds that dissipate heat.",
      "Urban buildings trap cold air, creating a contrast effect.",
    ],
    correctAnswer:
      "Impervious surfaces replace vegetation that would otherwise cool through moisture release.",
    explanation:
      "The passage explicitly states that roads and rooftops replace vegetation that releases moisture via evapotranspiration\u2014a cooling mechanism\u2014directly causing the temperature differential.",
  },
  {
    id: "v2",
    section: "verbal",
    type: "reading-comprehension",
    passage: heatIslandPassage,
    prompt: "The author mentions \"vulnerable populations\" primarily to:",
    options: [
      "Provide a statistical demographic breakdown of city dwellers.",
      "Suggest that urban heat primarily affects outdoor workers.",
      "Illustrate one of the human costs of the urban heat island effect.",
      "Argue that rural populations are relatively safe from heat-related illness.",
      "Emphasize that only the elderly are at risk from rising temperatures.",
    ],
    correctAnswer:
      "Illustrate one of the human costs of the urban heat island effect.",
    explanation:
      "The reference to vulnerable populations caps a list of negative consequences (energy demand, air quality, illness), functioning as an illustration of human cost rather than a demographic claim.",
  },
  {
    id: "v3",
    section: "verbal",
    type: "text-completion",
    prompt:
      "Although critics initially dismissed the sculptor's minimalist works as merely __________, subsequent decades of scholarship have revealed a profound engagement with Zen philosophy that had been hiding in plain sight.",
    options: [
      "derivative",
      "vacuous",
      "ostentatious",
      "labyrinthine",
      "pedantic",
    ],
    correctAnswer: "vacuous",
    explanation:
      "The sentence contrasts surface dismissal with later-discovered depth. \"Vacuous\" (empty, lacking content) best captures the critics' charge that the works had no substance\u2014exactly what the Zen scholarship refutes.",
  },
  {
    id: "v4",
    section: "verbal",
    type: "text-completion",
    prompt:
      "The senator's speech was notable for its __________ quality: each anecdote seemed chosen not to illuminate an argument but simply to delay the audience's realization that no argument existed.",
    options: [
      "turgid",
      "laconic",
      "dilatory",
      "incisive",
      "pellucid",
    ],
    correctAnswer: "dilatory",
    explanation:
      "\"Dilatory\" means intended to cause delay. The passage explicitly says the anecdotes were used to delay audience realization, making dilatory the precise fit.",
  },
  {
    id: "v5",
    section: "verbal",
    type: "sentence-equivalence",
    prompt:
      "The documentary's tone was surprisingly __________, treating its grim subject matter with a lightness that many viewers found inappropriate.",
    options: [
      "lugubrious",
      "flippant",
      "mordant",
      "jocular",
      "solemn",
      "scathing",
    ],
    correctAnswer: ["flippant", "jocular"],
    explanation:
      "Both \"flippant\" (lacking seriousness) and \"jocular\" (characterized by joking) convey inappropriate lightness. Either word produces a sentence with the same meaning.",
  },
  {
    id: "v6",
    section: "verbal",
    type: "sentence-equivalence",
    prompt:
      "Far from being __________, the treaty's provisions were so ambiguous that every signatory nation interpreted them differently.",
    options: [
      "unequivocal",
      "contentious",
      "perspicuous",
      "nebulous",
      "verbose",
      "immutable",
    ],
    correctAnswer: ["unequivocal", "perspicuous"],
    explanation:
      "\"Unequivocal\" (leaving no doubt) and \"perspicuous\" (clearly expressed) both contrast with the ambiguity described. Either yields the same logical meaning for the sentence.",
  },
  {
    id: "v7",
    section: "verbal",
    type: "text-completion",
    prompt:
      "The biographer's portrait of the novelist was so (i)__________ that even admirers conceded it exposed previously (ii)__________ flaws in the author's character.",
    options: [
      "(i) hagiographic | (ii) celebrated",
      "(i) unflinching | (ii) overlooked",
      "(i) superficial | (ii) documented",
      "(i) tendentious | (ii) imaginary",
      "(i) effusive | (ii) exaggerated",
    ],
    correctAnswer: "(i) unflinching | (ii) overlooked",
    explanation:
      "An \"unflinching\" biography would expose hard truths; admirers conceding means the flaws were real but previously \"overlooked.\" The other pairs create logical inconsistencies.",
  },
  {
    id: "v8",
    section: "verbal",
    type: "reading-comprehension",
    passage: sciencePassage,
    prompt:
      "Which of the following, if true, would most weaken the passage's conclusion?",
    options: [
      "Thomas Kuhn's model has been criticized by historians of science who prefer gradualist accounts.",
      "Confirmation bias is equally present in non-scientific communities.",
      "Studies show that scientists consistently revise beliefs smoothly rather than in sudden bursts, even when anomalies are numerous.",
      "The threshold at which anomalies trigger rapid belief revision varies across scientific disciplines.",
      "Cognitive scientists have replicated confirmation bias findings in multiple cultural contexts.",
    ],
    correctAnswer:
      "Studies show that scientists consistently revise beliefs smoothly rather than in sudden bursts, even when anomalies are numerous.",
    explanation:
      "The conclusion is that progress oscillates between biased stability and sudden reorganization. Evidence that revision is always smooth\u2014never sudden\u2014removes the \"sudden reorganization\" component and thereby weakens the oscillation claim.",
  },
  {
    id: "v9",
    section: "verbal",
    type: "text-completion",
    prompt:
      "The new management's strategy was __________: it promised sweeping innovation while quietly preserving every legacy system that had made the company profitable.",
    options: [
      "audacious",
      "Janus-faced",
      "jejune",
      "Sisyphean",
      "lachrymose",
    ],
    correctAnswer: "Janus-faced",
    explanation:
      "\"Janus-faced\" means two-faced or duplicitous. The sentence describes a strategy that publicly promised one thing while privately doing another\u2014exactly the duplicitous quality Janus-faced captures.",
  },
  {
    id: "v10",
    section: "verbal",
    type: "sentence-equivalence",
    prompt:
      "The philosopher's later essays, while intellectually rigorous, were widely criticized for their __________ prose style that alienated general readers.",
    options: [
      "abstruse",
      "limpid",
      "recondite",
      "effulgent",
      "pellucid",
      "trenchant",
    ],
    correctAnswer: ["abstruse", "recondite"],
    explanation:
      "Both \"abstruse\" and \"recondite\" describe material that is difficult to understand, often because it is obscure or specialized\u2014fitting prose that alienates general readers.",
  },

  // ── QUANTITATIVE REASONING ────────────────────────────────────────────────

  {
    id: "q1",
    section: "quantitative",
    type: "arithmetic",
    prompt: "If 40% of a number is 96, what is 75% of the same number?",
    options: ["144", "160", "180", "192", "210"],
    correctAnswer: "180",
    explanation:
      "40% of x = 96 \u2192 x = 240. 75% of 240 = 0.75 \u00d7 240 = 180.",
  },
  {
    id: "q2",
    section: "quantitative",
    type: "arithmetic",
    prompt:
      "A store marks up an item by 30% and then offers a 20% discount on the marked price. What is the net percentage change from the original price?",
    options: ["\u22124%", "+4%", "+10%", "+6%", "0%"],
    correctAnswer: "+4%",
    explanation:
      "Let original = 100. After 30% markup: 130. After 20% discount: 130 \u00d7 0.8 = 104. Net change = +4%.",
  },
  {
    id: "q3",
    section: "quantitative",
    type: "algebra",
    prompt: "If 3x \u2212 7 = 5x + 1, what is the value of x\u00b2?",
    options: ["4", "8", "16", "\u22124", "64"],
    correctAnswer: "16",
    explanation:
      "3x \u2212 7 = 5x + 1 \u2192 \u22122x = 8 \u2192 x = \u22124. x\u00b2 = (\u22124)\u00b2 = 16.",
  },
  {
    id: "q4",
    section: "quantitative",
    type: "algebra",
    prompt:
      "The sum of three consecutive even integers is 78. What is the largest of the three integers?",
    options: ["24", "26", "28", "30", "32"],
    correctAnswer: "28",
    explanation:
      "Let the integers be n, n+2, n+4. 3n + 6 = 78 \u2192 3n = 72 \u2192 n = 24. Largest = 24 + 4 = 28.",
  },
  {
    id: "q5",
    section: "quantitative",
    type: "geometry",
    prompt:
      "A right triangle has legs of length 9 and 12. What is the length of the hypotenuse?",
    options: ["13", "14", "15", "16", "17"],
    correctAnswer: "15",
    explanation:
      "By the Pythagorean theorem: c\u00b2 = 9\u00b2 + 12\u00b2 = 81 + 144 = 225. c = \u221a225 = 15.",
  },
  {
    id: "q6",
    section: "quantitative",
    type: "geometry",
    prompt: "A circle has area 49\u03c0. What is its circumference?",
    options: ["7\u03c0", "14\u03c0", "49\u03c0", "28\u03c0", "21\u03c0"],
    correctAnswer: "14\u03c0",
    explanation:
      "Area = \u03c0r\u00b2 = 49\u03c0 \u2192 r\u00b2 = 49 \u2192 r = 7. Circumference = 2\u03c0r = 14\u03c0.",
  },
  {
    id: "q7",
    section: "quantitative",
    type: "data-analysis",
    prompt:
      "The mean of five numbers is 18. If four of the numbers are 12, 15, 21, and 24, what is the fifth number?",
    options: ["16", "17", "18", "19", "20"],
    correctAnswer: "18",
    explanation:
      "Sum of five numbers = 5 \u00d7 18 = 90. Sum of known four = 12 + 15 + 21 + 24 = 72. Fifth number = 90 \u2212 72 = 18.",
  },
  {
    id: "q8",
    section: "quantitative",
    type: "data-analysis",
    prompt:
      "In a class of 30 students, the ratio of boys to girls is 2\u22363. How many girls are in the class?",
    options: ["12", "15", "16", "18", "20"],
    correctAnswer: "18",
    explanation:
      "Total parts = 2 + 3 = 5. Girls = (3/5) \u00d7 30 = 18.",
  },
  {
    id: "q9",
    section: "quantitative",
    type: "arithmetic",
    prompt: "What is the value of 2\u2078 \u00f7 2\u00b3?",
    options: ["8", "16", "32", "64", "128"],
    correctAnswer: "32",
    explanation:
      "2\u2078 \u00f7 2\u00b3 = 2^(8\u22123) = 2\u2075 = 32.",
  },
  {
    id: "q10",
    section: "quantitative",
    type: "algebra",
    prompt:
      "If f(x) = x\u00b2 \u2212 3x + 2, what is f(5) \u2212 f(2)?",
    options: ["12", "10", "14", "16", "8"],
    correctAnswer: "12",
    explanation:
      "f(5) = 25 \u2212 15 + 2 = 12. f(2) = 4 \u2212 6 + 2 = 0. f(5) \u2212 f(2) = 12 \u2212 0 = 12.",
  },

  // ── ANALYTICAL WRITING ────────────────────────────────────────────────────

  {
    id: "w1",
    section: "writing",
    type: "issue-task",
    prompt:
      "Issue Task (30 minutes): Write a response in which you discuss the extent to which you agree or disagree with the following statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.\n\n\"Governments should prioritize economic growth over environmental protection, because a wealthier society will have greater resources to address environmental problems in the future.\"",
    explanation:
      "Strong responses will acknowledge trade-offs: e.g., economic growth creates wealth for environmental remediation BUT some environmental damage is irreversible (species extinction, tipping points), and the 'grow now, fix later' model assumes technology will keep pace. A high-scoring essay takes a clear, nuanced position, supports it with specific reasons and examples, and acknowledges counterarguments.",
  },
  {
    id: "w2",
    section: "writing",
    type: "argument-task",
    prompt:
      "Argument Task (30 minutes): Write a response in which you discuss what specific evidence is needed to evaluate the argument and explain how the evidence would weaken or strengthen the argument.\n\n\"The city of Elmwood recently installed bike lanes on its main commercial street. Within six months, several local businesses reported increased foot traffic. The city council should therefore install bike lanes on all major streets to boost economic activity across the entire city.\"",
    explanation:
      "Strong responses identify key assumptions that need evidence: Did bike lane installation coincide with other factors (season, events)? Were foot traffic gains due to cyclists or other causes? Would the same effect generalize to non-commercial streets? Is correlation causal? High-scoring essays systematically address each logical gap rather than simply agreeing or disagreeing with the conclusion.",
  },
];

export function getQuestionsBySection(section: string): Question[] {
  return questions.filter((q) => q.section === section);
}

export function getQuestionById(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}
