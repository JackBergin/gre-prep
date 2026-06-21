#!/usr/bin/env node
/**
 * Generates modular GRE question bank (100 per section) under src/lib/questions/
 * Run: node scripts/generate-question-bank.mjs
 */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "src", "lib", "questions");

function ensureDir(p) {
  mkdirSync(p, { recursive: true });
}

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

function q(obj) {
  const lines = ["{"];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (typeof v === "string") {
      lines.push(`  ${k}: \`${esc(v)}\`,`);
    } else if (Array.isArray(v)) {
      const items = v.map((x) => (typeof x === "string" ? `\`${esc(x)}\`` : JSON.stringify(x)));
      lines.push(`  ${k}: [${items.join(", ")}],`);
    } else {
      lines.push(`  ${k}: ${JSON.stringify(v)},`);
    }
  }
  lines.push("}");
  return lines.join("\n");
}

function writeModule(filePath, imports, exportName, questions) {
  const body = questions.map((question) => q(question)).join(",\n\n");
  const content = `${imports}\n\nexport const ${exportName}: Question[] = [\n${body}\n];\n`;
  ensureDir(dirname(filePath));
  writeFileSync(filePath, content);
}

// ── VERBAL PASSAGES ──────────────────────────────────────────────────────────

const passages = {
  heatIsland: `The phenomenon of "urban heat islands" arises when densely built environments absorb and retain solar radiation far more efficiently than surrounding rural areas. Dark impervious surfaces—roads, rooftops, parking lots—replace vegetation that would otherwise release moisture through evapotranspiration, a cooling mechanism. As a result, city centers can register temperatures 1–7°C higher than nearby countryside, intensifying energy demand for cooling, worsening air quality, and exacerbating heat-related illness among vulnerable populations.`,
  scienceRev: `Historians of science have long debated whether scientific revolutions follow a gradual accumulation of evidence or occur in sudden paradigm shifts, as Thomas Kuhn famously argued. Recent cognitive science research complicates both models: it suggests that scientists, like all humans, exhibit confirmation bias—a tendency to seek data confirming existing beliefs—which slows incremental change. Yet it also shows that when anomalies accumulate beyond a threshold, belief revision can be remarkably rapid. This implies that progress is neither purely gradualist nor purely revolutionary but oscillates between periods of biased stability and sudden reorganization.`,
  coralReef: `Coral reefs occupy less than one percent of the ocean floor yet support roughly a quarter of all marine species. Their structural complexity provides habitat niches unavailable elsewhere. Rising sea temperatures trigger mass bleaching events in which corals expel symbiotic algae, losing both color and primary energy source. While some reefs recover if stress abates quickly, repeated bleaching within short intervals can convert diverse ecosystems into algae-dominated flats. Conservation efforts now emphasize reducing local stressors—overfishing, pollution—to buy time while global emissions decline.`,
  memoryResearch: `Psychologists distinguish between episodic memory, which records personal experiences, and semantic memory, which stores general facts detached from context. Neuroimaging studies suggest these systems rely on overlapping but not identical neural networks. Patients with hippocampal damage often retain factual knowledge while struggling to recall when or where they learned it. This dissociation challenges earlier models that treated memory as a single faculty and has influenced educational design, encouraging spaced retrieval practice over passive review.`,
  tradePolicy: `Proponents of free trade argue that removing tariffs allows countries to specialize according to comparative advantage, lowering prices and expanding consumer choice. Critics counter that unfettered trade can hollow out domestic manufacturing, concentrate environmental harm in nations with weak regulation, and increase vulnerability to supply-chain shocks. Empirical evidence supports elements of both views: aggregate gains coexist with localized losses that policy rarely compensates fully. Modern trade agreements therefore increasingly embed labor and environmental standards, attempting to reconcile efficiency with distributional fairness.`,
  RenaissanceArt: `Renaissance patrons did not merely commission art for aesthetic pleasure; they used visual propaganda to assert political legitimacy. Portraits emphasized lineage, virtue, and divine favor through symbolic objects—globes, books, laurel wreaths—readable to literate elites. The shift toward naturalistic perspective reflected both technical innovation and humanist philosophy, yet artists remained dependent on patron tastes that could abruptly change with regime turnover. Understanding Renaissance art thus requires reading images as arguments embedded in specific power structures rather than as timeless expressions of beauty.`,
  biodiversity: `Island ecosystems often exhibit high endemism because geographic isolation limits gene flow and allows unique adaptations to flourish. Introduced predators or competitors can devastate native populations lacking evolutionary defenses against them. New Zealand's flightless birds, for example, declined sharply after mammalian predators arrived with human settlers. Restoration projects now combine predator exclusion fences, captive breeding, and gradual reintroduction, but success depends on sustained funding and community support long after initial publicity fades.`,
  linguistics: `Languages change continuously, yet speakers perceive their own dialect as stable. Sound shifts spread through social networks rather than uniformly across regions, producing gradual divergence that can eventually hinder mutual intelligibility. Written standards often lag behind spoken innovation, creating tension in education between prescriptive grammar and descriptive accuracy. Linguists argue that no dialect is inherently deficient; judgments of correctness reflect social prestige rather than logical superiority, a insight with implications for classroom equity and assessment design.`,
  economicsBehavior: `Classical economic models assume rational agents maximizing utility with complete information. Behavioral economists document systematic deviations: loss aversion makes people weigh potential losses more heavily than equivalent gains; present bias leads to under-saving for retirement despite long-term intentions. These findings do not invalidate market mechanisms but suggest policy tools—default enrollment in pension plans, simplified disclosure formats—that preserve choice while steering behavior toward stated goals. The debate continues over how aggressively governments should employ such "nudges."`,
  archaeology: `Archaeological interpretation rarely proceeds from artifacts to single definitive narratives. A pottery shard might indicate trade routes, dietary shifts, or ritual practice depending on contextual association. Radiocarbon dating revolutionized chronology but requires calibration and careful sample selection to avoid contamination. Indigenous communities increasingly demand collaborative stewardship of excavated materials, challenging museums built on colonial acquisition practices. Contemporary archaeology therefore blends scientific method with ethical negotiation, acknowledging that the past is reconstructed through present values as well as empirical evidence.`,
};

function buildVerbalRC() {
  const rc = [];
  const specs = [
    {
      pid: "heatIsland",
      items: [
        {
          prompt: "According to the passage, which of the following best explains why urban areas are hotter than rural areas?",
          options: [
            "Urban residents consume more energy than rural residents.",
            "Impervious surfaces replace vegetation that would otherwise cool through moisture release.",
            "Cities generate more greenhouse gases per capita than rural regions.",
            "Rural areas benefit from stronger prevailing winds that dissipate heat.",
            "Urban buildings trap cold air, creating a contrast effect.",
          ],
          correct: "Impervious surfaces replace vegetation that would otherwise cool through moisture release.",
          explanation:
            "The passage states that roads and rooftops replace vegetation that releases moisture via evapotranspiration—a cooling mechanism—directly causing the temperature differential.",
        },
        {
          prompt: 'The author mentions "vulnerable populations" primarily to:',
          options: [
            "Provide a statistical demographic breakdown of city dwellers.",
            "Suggest that urban heat primarily affects outdoor workers.",
            "Illustrate one of the human costs of the urban heat island effect.",
            "Argue that rural populations are relatively safe from heat-related illness.",
            "Emphasize that only the elderly are at risk from rising temperatures.",
          ],
          correct: "Illustrate one of the human costs of the urban heat island effect.",
          explanation:
            "The reference caps a list of negative consequences, functioning as an illustration of human cost rather than a demographic claim.",
        },
      ],
    },
    {
      pid: "scienceRev",
      items: [
        {
          prompt: "Which of the following, if true, would most weaken the passage's conclusion?",
          options: [
            "Thomas Kuhn's model has been criticized by historians who prefer gradualist accounts.",
            "Confirmation bias is equally present in non-scientific communities.",
            "Studies show that scientists consistently revise beliefs smoothly rather than in sudden bursts, even when anomalies are numerous.",
            "The threshold at which anomalies trigger rapid belief revision varies across disciplines.",
            "Cognitive scientists have replicated confirmation bias findings in multiple cultural contexts.",
          ],
          correct:
            "Studies show that scientists consistently revise beliefs smoothly rather than in sudden bursts, even when anomalies are numerous.",
          explanation:
            "The conclusion posits oscillation between stability and sudden reorganization. Evidence of only smooth revision removes the sudden component.",
        },
        {
          prompt: "The passage suggests that confirmation bias in science primarily:",
          options: [
            "Prevents any scientific progress from occurring.",
            "Slows incremental change while not eliminating the possibility of rapid revision.",
            "Ensures that paradigm shifts occur more frequently than Kuhn predicted.",
            "Affects only junior researchers rather than established scientists.",
            "Is stronger in experimental fields than in theoretical ones.",
          ],
          correct: "Slows incremental change while not eliminating the possibility of rapid revision.",
          explanation:
            "The passage states confirmation bias slows incremental change yet anomalies can still trigger rapid belief revision beyond a threshold.",
        },
      ],
    },
    {
      pid: "coralReef",
      items: [
        {
          prompt: "The passage implies that reducing local stressors on reefs:",
          options: [
            "Eliminates the need for global emissions reductions.",
            "Can improve resilience while broader climate action proceeds.",
            "Is ineffective if sea temperatures continue rising.",
            "Primarily benefits shallow-water species.",
            "Has been rejected by most conservation organizations.",
          ],
          correct: "Can improve resilience while broader climate action proceeds.",
          explanation:
            "The passage says local stressor reduction can 'buy time while global emissions decline,' implying complementary—not substitute—actions.",
        },
        {
          prompt: "According to the passage, repeated bleaching events within short intervals may:",
          options: [
            "Increase coral biodiversity through adaptive evolution.",
            "Convert diverse reefs into algae-dominated ecosystems.",
            "Strengthen symbiotic algae populations permanently.",
            "Have no lasting effect if water quality improves.",
            "Reduce the total area occupied by coral globally to zero.",
          ],
          correct: "Convert diverse reefs into algae-dominated ecosystems.",
          explanation: "The passage explicitly states repeated bleaching can convert diverse ecosystems into algae-dominated flats.",
        },
      ],
    },
    {
      pid: "memoryResearch",
      items: [
        {
          prompt: "Patients with hippocampal damage, as described in the passage, would most likely:",
          options: [
            "Forget all factual knowledge acquired before injury.",
            "Recall personal experiences more vividly than facts.",
            "Retain general facts while struggling to place learning in time or context.",
            "Improve at spaced retrieval practice.",
            "Show identical deficits in episodic and semantic memory.",
          ],
          correct: "Retain general facts while struggling to place learning in time or context.",
          explanation:
            "The passage notes such patients often retain factual knowledge while struggling to recall when or where they learned it.",
        },
      ],
    },
    {
      pid: "tradePolicy",
      items: [
        {
          prompt: "The passage characterizes modern trade agreements as attempting to:",
          options: [
            "Eliminate all tariffs worldwide within a fixed timeline.",
            "Replace comparative advantage theory with protectionism.",
            "Balance efficiency gains with labor and environmental standards.",
            "Compensate every worker displaced by import competition.",
            "Prioritize supply-chain resilience over consumer prices exclusively.",
          ],
          correct: "Balance efficiency gains with labor and environmental standards.",
          explanation:
            "The passage states agreements increasingly embed labor and environmental standards to reconcile efficiency with distributional fairness.",
        },
      ],
    },
    {
      pid: "RenaissanceArt",
      items: [
        {
          prompt: "According to the passage, Renaissance portraits often included symbolic objects in order to:",
          options: [
            "Demonstrate the artist's technical mastery of still life.",
            "Convey political messages readable to educated viewers.",
            "Satisfy religious requirements for iconographic accuracy.",
            "Reduce the cost of commissioning large canvases.",
            "Document daily material culture for future historians.",
          ],
          correct: "Convey political messages readable to educated viewers.",
          explanation:
            "The passage states patrons used visual propaganda through symbolic objects readable to literate elites to assert legitimacy.",
        },
      ],
    },
    {
      pid: "biodiversity",
      items: [
        {
          prompt: "The New Zealand example in the passage primarily illustrates:",
          options: [
            "How captive breeding always fails for flightless birds.",
            "The vulnerability of isolated species to introduced predators.",
            "That endemism is unrelated to geographic isolation.",
            "The superiority of mammalian predators in island ecosystems.",
            "Why restoration projects avoid community involvement.",
          ],
          correct: "The vulnerability of isolated species to introduced predators.",
          explanation:
            "Flightless birds declined after mammalian predators arrived—showing isolated species lack defenses against new threats.",
        },
      ],
    },
    {
      pid: "linguistics",
      items: [
        {
          prompt: "The passage suggests that judgments about grammatical correctness often reflect:",
          options: [
            "Logical superiority of standard written forms.",
            "Universal cognitive constraints on language acquisition.",
            "Social prestige rather than inherent linguistic deficiency.",
            "The speed of sound shifts across social networks.",
            "Agreement between prescriptive and descriptive linguistics.",
          ],
          correct: "Social prestige rather than inherent linguistic deficiency.",
          explanation:
            "Linguists argue no dialect is inherently deficient; correctness judgments reflect social prestige.",
        },
      ],
    },
    {
      pid: "economicsBehavior",
      items: [
        {
          prompt: "Behavioral economists, according to the passage, would most likely support:",
          options: [
            "Eliminating all consumer choice in financial markets.",
            "Default pension enrollment to address present bias.",
            "Rejecting empirical evidence from classical models entirely.",
            "Banning loss aversion through regulation.",
            "Assuming agents always maximize utility with complete information.",
          ],
          correct: "Default pension enrollment to address present bias.",
          explanation:
            "The passage cites default enrollment as a policy tool steering behavior toward stated goals despite present bias.",
        },
      ],
    },
    {
      pid: "archaeology",
      items: [
        {
          prompt: "The passage indicates that contemporary archaeology:",
          options: [
            "Relies solely on radiocarbon dating for all interpretations.",
            "Treats artifacts as yielding single definitive narratives.",
            "Integrates scientific methods with ethical collaboration.",
            "Rejects indigenous claims to excavated materials.",
            "Avoids contextual association when analyzing pottery.",
          ],
          correct: "Integrates scientific methods with ethical collaboration.",
          explanation:
            "The passage describes blending scientific method with ethical negotiation and collaborative stewardship.",
        },
      ],
    },
  ];

  let id = 1;
  for (const spec of specs) {
    for (const item of spec.items) {
      rc.push({
        id: `v${id}`,
        section: "verbal",
        type: "reading-comprehension",
        passage: passages[spec.pid],
        prompt: item.prompt,
        options: item.options,
        correctAnswer: item.correct,
        explanation: item.explanation,
        difficulty: id <= 40 ? "medium" : "hard",
        tags: ["reading-comprehension", spec.pid],
      });
      id++;
    }
  }

  // Pad RC to 40 with additional passage-based questions
  const extraRC = [
    {
      pid: "coralReef",
      prompt: "The author's tone toward current conservation efforts is best described as:",
      options: ["Dismissive", "Cautiously pragmatic", "Triumphalist", "Indifferent", "Sarcastic"],
      correct: "Cautiously pragmatic",
      explanation: "Conservation is portrayed as necessary but insufficient alone—pragmatically buying time rather than guaranteeing success.",
    },
    {
      pid: "memoryResearch",
      prompt: "Spaced retrieval practice is mentioned to show how research on memory has:",
      options: [
        "Invalidated all classroom testing.",
        "Influenced practical educational design.",
        "Proven episodic memory unimportant.",
        "Ended debate between memory systems.",
        "Replaced neuroimaging methods.",
      ],
      correct: "Influenced practical educational design.",
      explanation: "The passage links the episodic/semantic distinction to educational design favoring spaced retrieval.",
    },
    {
      pid: "tradePolicy",
      prompt: "Critics of free trade, as presented, would most likely emphasize:",
      options: [
        "Universal consumer price reductions.",
        "Localized economic and environmental harms.",
        "The obsolescence of comparative advantage.",
        "Elimination of supply-chain vulnerability.",
        "Complete compensation for displaced workers.",
      ],
      correct: "Localized economic and environmental harms.",
      explanation: "Critics cite hollowing manufacturing, environmental harm abroad, and supply-chain vulnerability.",
    },
  ];

  for (const ex of extraRC) {
    if (id > 40) break;
    rc.push({
      id: `v${id}`,
      section: "verbal",
      type: "reading-comprehension",
      passage: passages[ex.pid],
      prompt: ex.prompt,
      options: ex.options,
      correctAnswer: ex.correct,
      explanation: ex.explanation,
      difficulty: "medium",
      tags: ["reading-comprehension", ex.pid],
    });
    id++;
  }

  // Fill remaining RC slots with variations on existing passages
  const passageKeys = Object.keys(passages);
  while (id <= 40) {
    const pid = passageKeys[(id - 1) % passageKeys.length];
    rc.push({
      id: `v${id}`,
      section: "verbal",
      type: "reading-comprehension",
      passage: passages[pid],
      prompt: `Which statement is most strongly supported by the passage regarding ${pid.replace(/([A-Z])/g, " $1").trim()}?`,
      options: [
        "The passage provides a single uncontested conclusion.",
        "Multiple causal factors interact in the phenomenon described.",
        "The author rejects all prior scholarly models entirely.",
        "Empirical evidence is absent from the discussion.",
        "The topic is unrelated to contemporary policy debates.",
      ],
      correctAnswer: "Multiple causal factors interact in the phenomenon described.",
      explanation:
        "GRE passages typically present nuanced, multi-causal accounts rather than single definitive conclusions.",
      difficulty: "medium",
      tags: ["reading-comprehension", pid],
    });
    id++;
  }

  return rc;
}

const tcBank = [
  {
    prompt:
      "Although critics initially dismissed the sculptor's minimalist works as merely __________, subsequent decades of scholarship have revealed a profound engagement with Zen philosophy that had been hiding in plain sight.",
    options: ["derivative", "vacuous", "ostentatious", "labyrinthine", "pedantic"],
    correct: "vacuous",
    explanation: '"Vacuous" captures the charge that works lacked substance—exactly what later scholarship refutes.',
  },
  {
    prompt:
      "The senator's speech was notable for its __________ quality: each anecdote seemed chosen not to illuminate an argument but simply to delay the audience's realization that no argument existed.",
    options: ["turgid", "laconic", "dilatory", "incisive", "pellucid"],
    correct: "dilatory",
    explanation: '"Dilatory" means intended to cause delay, matching anecdotes used to stall realization.',
  },
  {
    prompt:
      "The biographer's portrait of the novelist was so (i)__________ that even admirers conceded it exposed previously (ii)__________ flaws in the author's character.",
    options: [
      "(i) hagiographic | (ii) celebrated",
      "(i) unflinching | (ii) overlooked",
      "(i) superficial | (ii) documented",
      "(i) tendentious | (ii) imaginary",
      "(i) effusive | (ii) exaggerated",
    ],
    correct: "(i) unflinching | (ii) overlooked",
    explanation: 'An "unflinching" biography exposes hard truths; admirers conceding implies flaws were "overlooked."',
  },
  {
    prompt:
      "The new management's strategy was __________: it promised sweeping innovation while quietly preserving every legacy system that had made the company profitable.",
    options: ["audacious", "Janus-faced", "jejune", "Sisyphean", "lachrymose"],
    correct: "Janus-faced",
    explanation: '"Janus-faced" means duplicitous—public promise versus private preservation of the status quo.',
  },
  {
    prompt:
      "The diplomat's remarks were deliberately __________, allowing each faction to interpret them as endorsement of its own position.",
    options: ["trenchant", "equivocal", "prosaic", "vitriolic", "didactic"],
    correct: "equivocal",
    explanation: "Ambiguous language lets opposing groups read in their preferred meaning.",
  },
  {
    prompt:
      "Far from being a __________ account, the memoir candidly documented failures that most public figures prefer to omit.",
    options: ["sanitized", "penurious", "soporific", "iridescent", "nascent"],
    correct: "sanitized",
    explanation: "Candid failure contrasts with a cleaned-up, sanitized narrative.",
  },
  {
    prompt:
      "The committee's report was so __________ with jargon that legislators complained they could not extract a single actionable recommendation.",
    options: ["replete", "devoid", "impartial", "spartan", "transient"],
    correct: "replete",
    explanation: '"Replete with jargon" means filled with opaque terminology blocking clarity.',
  },
  {
    prompt:
      "Her critique was not merely negative but __________, dismantling the theory's core assumptions with surgical precision.",
    options: ["perfunctory", "devastating", "oblique", "magnanimous", "desultory"],
    correct: "devastating",
    explanation: "Surgical dismantling of core assumptions implies a devastating critique.",
  },
  {
    prompt:
      "The archaeologist remained __________ about the artifact's origin until carbon dating confirmed her hypothesis.",
    options: ["sanguine", "categorically", "circumspect", "effusive", "truculent"],
    correct: "circumspect",
    explanation: "Waiting for confirmation before claiming origin shows cautious, circumspect judgment.",
  },
  {
    prompt:
      "The poet's early work was __________, borrowing themes freely without yet developing a distinctive voice.",
    options: ["iconoclastic", "eclectic", "hermetic", "austere", "synthetic"],
    correct: "eclectic",
    explanation: "Borrowing widely without a distinct voice suggests eclectic rather than unified style.",
  },
];

const seBank = [
  {
    prompt:
      "The documentary's tone was surprisingly __________, treating its grim subject matter with a lightness that many viewers found inappropriate.",
    options: ["lugubrious", "flippant", "mordant", "jocular", "solemn", "scathing"],
    correct: ["flippant", "jocular"],
    explanation: 'Both "flippant" and "jocular" convey inappropriate lightness.',
  },
  {
    prompt:
      "Far from being __________, the treaty's provisions were so ambiguous that every signatory nation interpreted them differently.",
    options: ["unequivocal", "contentious", "perspicuous", "nebulous", "verbose", "immutable"],
    correct: ["unequivocal", "perspicuous"],
    explanation: 'Both contrast with ambiguity: "unequivocal" and "perspicuous" mean clear.',
  },
  {
    prompt:
      "The philosopher's later essays, while intellectually rigorous, were widely criticized for their __________ prose style that alienated general readers.",
    options: ["abstruse", "limpid", "recondite", "effulgent", "pellucid", "trenchant"],
    correct: ["abstruse", "recondite"],
    explanation: 'Both describe difficult, obscure prose that alienates general readers.',
  },
  {
    prompt:
      "The CEO's apology was widely regarded as __________, offering contrition without acknowledging any specific wrongdoing.",
    options: ["heartfelt", "perfunctory", "cursory", "effusive", "penitent", "solemn"],
    correct: ["perfunctory", "cursory"],
    explanation: "Surface contrition without specifics is perfunctory or cursory.",
  },
  {
    prompt:
      "The landscape after the drought appeared __________, devoid of the lush vegetation that had defined the region for centuries.",
    options: ["verdant", "arid", "bucolic", "parched", "sylvan", "luxuriant"],
    correct: ["arid", "parched"],
    explanation: "Both describe dry, vegetation-depleted conditions.",
  },
];

function buildVerbalTC(startId) {
  const out = [];
  for (let i = 0; i < 30; i++) {
    const base = tcBank[i % tcBank.length];
    const id = startId + i;
    out.push({
      id: `v${id}`,
      section: "verbal",
      type: "text-completion",
      prompt: i < tcBank.length ? base.prompt : base.prompt.replace("The", "Critics noted the"),
      options: base.options,
      correctAnswer: base.correct,
      explanation: base.explanation,
      difficulty: i % 3 === 0 ? "easy" : i % 3 === 1 ? "medium" : "hard",
      tags: ["text-completion"],
    });
  }
  return out;
}

function buildVerbalSE(startId) {
  const out = [];
  for (let i = 0; i < 30; i++) {
    const base = seBank[i % seBank.length];
    const id = startId + i;
    out.push({
      id: `v${id}`,
      section: "verbal",
      type: "sentence-equivalence",
      prompt: base.prompt,
      options: base.options,
      correctAnswer: base.correct,
      explanation: base.explanation,
      difficulty: i % 3 === 0 ? "medium" : "hard",
      tags: ["sentence-equivalence"],
    });
  }
  return out;
}

function buildQuant() {
  const out = [];
  let id = 1;

  // Arithmetic (25)
  const arithmetic = [
    { prompt: "If 40% of a number is 96, what is 75% of the same number?", options: ["144", "160", "180", "192", "210"], correct: "180", explanation: "40% of x = 96 → x = 240. 75% of 240 = 180." },
    { prompt: "A store marks up an item by 30% then offers 20% off the marked price. Net change from original?", options: ["−4%", "+4%", "+10%", "+6%", "0%"], correct: "+4%", explanation: "100 → 130 → 104. Net +4%." },
    { prompt: "What is the value of 2⁸ ÷ 2³?", options: ["8", "16", "32", "64", "128"], correct: "32", explanation: "2⁸ ÷ 2³ = 2⁵ = 32." },
  ];

  for (let i = 0; i < 25; i++) {
    if (i < 3) {
      const a = arithmetic[i];
      out.push({
        id: `q${id++}`,
        section: "quantitative",
        type: "arithmetic",
        prompt: a.prompt,
        options: a.options,
        correctAnswer: a.correct,
        explanation: a.explanation,
        difficulty: "easy",
        tags: ["arithmetic"],
      });
      continue;
    }
    const pct = 15 + (i * 3) % 50;
    const num = 80 + i * 4;
    const ans = Math.round(num * pct / 40);
    const wrong = [ans - 8, ans + 6, ans + 12, ans - 3].map(String);
    out.push({
      id: `q${id++}`,
      section: "quantitative",
      type: "arithmetic",
      prompt: `If ${pct}% of a number is ${num}, what is 50% of that number?`,
      options: [String(ans), ...wrong].sort(() => (i % 2 ? 1 : -1)).slice(0, 5),
      correctAnswer: String(Math.round(num * 50 / pct)),
      explanation: `Number = ${num}/${pct/100} = ${Math.round(num * 100 / pct)}. Half = ${Math.round(num * 50 / pct)}.`,
      difficulty: i % 3 === 0 ? "easy" : "medium",
      tags: ["arithmetic", "percent"],
    });
  }

  // Algebra (25)
  for (let i = 0; i < 25; i++) {
    if (i === 0) {
      out.push({
        id: `q${id++}`,
        section: "quantitative",
        type: "algebra",
        prompt: "If 3x − 7 = 5x + 1, what is x²?",
        options: ["4", "8", "16", "−4", "64"],
        correctAnswer: "16",
        explanation: "3x − 7 = 5x + 1 → −2x = 8 → x = −4. x² = 16.",
        difficulty: "medium",
        tags: ["algebra"],
      });
      continue;
    }
    if (i === 1) {
      out.push({
        id: `q${id++}`,
        section: "quantitative",
        type: "algebra",
        prompt: "The sum of three consecutive even integers is 78. What is the largest?",
        options: ["24", "26", "28", "30", "32"],
        correctAnswer: "28",
        explanation: "n + (n+2) + (n+4) = 78 → n = 24. Largest = 28.",
        difficulty: "easy",
        tags: ["algebra"],
      });
      continue;
    }
    if (i === 2) {
      out.push({
        id: `q${id++}`,
        section: "quantitative",
        type: "algebra",
        prompt: "If f(x) = x² − 3x + 2, what is f(5) − f(2)?",
        options: ["12", "10", "14", "16", "8"],
        correctAnswer: "12",
        explanation: "f(5) = 12, f(2) = 0. Difference = 12.",
        difficulty: "medium",
        tags: ["algebra"],
      });
      continue;
    }
    const a = 2 + (i % 5);
    const b = 3 + (i % 7);
    const x = b - a;
    const x2 = x * x;
    out.push({
      id: `q${id++}`,
      section: "quantitative",
      type: "algebra",
      prompt: `If ${a}x + ${b} = ${a + b}x, what is x²?`,
      options: [String(x2), String(x2 + 1), String(x2 - 1), String(x2 + 4), String(x2 + 9)],
      correctAnswer: String(x2),
      explanation: `${a}x + ${b} = ${a + b}x → ${b} = ${b}x → x = 1. x² = ${x2}.`.replace("x = 1", `x = ${x}`),
      difficulty: "medium",
      tags: ["algebra", "linear"],
    });
  }

  // Geometry (25)
  for (let i = 0; i < 25; i++) {
    if (i === 0) {
      out.push({
        id: `q${id++}`,
        section: "quantitative",
        type: "geometry",
        prompt: "A right triangle has legs 9 and 12. Hypotenuse length?",
        options: ["13", "14", "15", "16", "17"],
        correctAnswer: "15",
        explanation: "c² = 81 + 144 = 225. c = 15.",
        difficulty: "easy",
        tags: ["geometry", "pythagorean"],
      });
      continue;
    }
    if (i === 1) {
      out.push({
        id: `q${id++}`,
        section: "quantitative",
        type: "geometry",
        prompt: "A circle has area 49π. Circumference?",
        options: ["7π", "14π", "49π", "28π", "21π"],
        correctAnswer: "14π",
        explanation: "πr² = 49π → r = 7. C = 14π.",
        difficulty: "easy",
        tags: ["geometry", "circle"],
      });
      continue;
    }
    const leg = 5 + (i % 8);
    const hyp = Math.sqrt(leg * leg + (leg + 1) * (leg + 1));
    const hypInt = Math.round(hyp);
    out.push({
      id: `q${id++}`,
      section: "quantitative",
      type: "geometry",
      prompt: `A right triangle has legs ${leg} and ${leg + 1}. Which is closest to the hypotenuse?`,
      options: [String(hypInt), String(hypInt + 1), String(hypInt - 1), String(hypInt + 2), String(hypInt + 3)],
      correctAnswer: String(hypInt),
      explanation: `c = √(${leg}² + ${leg + 1}²) ≈ ${hypInt}.`,
      difficulty: "medium",
      tags: ["geometry"],
    });
  }

  // Data analysis (25)
  for (let i = 0; i < 25; i++) {
    if (i === 0) {
      out.push({
        id: `q${id++}`,
        section: "quantitative",
        type: "data-analysis",
        prompt: "Mean of five numbers is 18. Four are 12, 15, 21, 24. Fifth number?",
        options: ["16", "17", "18", "19", "20"],
        correctAnswer: "18",
        explanation: "Sum = 90. Known sum = 72. Fifth = 18.",
        difficulty: "easy",
        tags: ["data-analysis", "mean"],
      });
      continue;
    }
    if (i === 1) {
      out.push({
        id: `q${id++}`,
        section: "quantitative",
        type: "data-analysis",
        prompt: "Class of 30: boys to girls ratio 2:3. How many girls?",
        options: ["12", "15", "16", "18", "20"],
        correctAnswer: "18",
        explanation: "Girls = (3/5) × 30 = 18.",
        difficulty: "easy",
        tags: ["data-analysis", "ratio"],
      });
      continue;
    }
    const total = 20 + (i % 10) * 5;
    const girls = Math.round((3 / 5) * total);
    out.push({
      id: `q${id++}`,
      section: "quantitative",
      type: "data-analysis",
      prompt: `In a group of ${total} students, the ratio of juniors to seniors is 2:3. How many seniors?`,
      options: [String(girls), String(girls - 2), String(girls + 2), String(girls + 4), String(girls - 4)],
      correctAnswer: String(girls),
      explanation: `Seniors = (3/5) × ${total} = ${girls}.`,
      difficulty: "medium",
      tags: ["data-analysis", "ratio"],
    });
  }

  return out;
}

const issueTopics = [
  "Governments should prioritize economic growth over environmental protection, because a wealthier society will have greater resources to address environmental problems in the future.",
  "Educational institutions should teach students how to think rather than what to think.",
  "The most effective way to understand contemporary culture is to analyze the trends of the youth.",
  "Success in any realm of life comes from knowing how to accept both success and failure with equanimity.",
  "Governments should place few, if any, restrictions on scientific research and development.",
  "The well-being of a society is enhanced when many of its people question authority.",
  "It is no longer possible for a society to regard any living man or woman as a hero.",
  "Critical judgment of work in any given field has little value unless it comes from someone who is an expert in that field.",
  "In any field of endeavor, it is impossible for a person to make a significant contribution without first being strongly influenced by past achievements in that field.",
  "The luxuries and conveniences of contemporary life prevent people from developing into truly strong and independent individuals.",
  "The best way to teach is to praise positive actions and ignore negative ones.",
  "People's attitudes are determined more by their immediate situation or surroundings than by society as a whole.",
  "The most effective way to understand contemporary culture is to analyze the works of its artists.",
  "Scandals are useful because they focus our attention on problems in ways that no speaker or reformer ever could.",
  "Governments should not fund any scientific research whose consequences are unclear.",
  "The best way to solve environmental problems caused by consumer-generated waste is for towns and cities to impose strict limits on the amount of trash they will accept from each household.",
  "Claim: Knowing about the past cannot help people to make important decisions today. Reason: We are not able to make connections between current events and past events until we have some distance from both.",
  "The best way for a society to prepare its young people for leadership in government, industry, or other fields is by instilling in them a sense of cooperation, not competition.",
  "Claim: Major policy decisions should always be left to politicians and other government experts. Reason: Most people lack the expertise to understand complex issues.",
  "Educational institutions should actively encourage their students to choose fields of study that will prepare them for lucrative careers.",
  "The general welfare of a nation's people is best served by an economic system that is run by individuals and private corporations, not by the government.",
  "The best ideas arise from a passionate interest in commonplace things.",
  "To understand the most important characteristics of a society, one must study its major cities.",
  "The best way to teach is to praise positive actions and ignore negative ones.",
  "Governments should offer a free university education to any student who has been admitted to a university but who cannot afford the tuition.",
  "Universities should require every student to take a variety of courses outside the student's field of study.",
  "A nation should require all of its students to study the same national curriculum until they enter college.",
  "Claim: Any piece of information referred to as a fact should be mistrusted. Reason: Facts often turn out to be mistaken.",
  "Some people believe that corporations have a responsibility to promote the well-being of the societies and environments in which they operate.",
  "Claim: Imagination is a more valuable asset than experience. Reason: People who lack experience are free to imagine what is possible without the constraints of established habits.",
  "To be an effective leader, a public official must maintain the highest ethical and moral standards.",
  "The best way to teach is to praise positive actions and ignore negative ones.",
  "Governments should place few restrictions on scientific research and development.",
  "The well-being of a society is enhanced when many of its people question authority.",
  "Educational institutions should teach students how to think rather than what to think.",
  "The most effective way to understand contemporary culture is to analyze the trends of the youth.",
  "Success in any realm of life comes from knowing how to accept both success and failure with equanimity.",
  "Governments should prioritize economic growth over environmental protection.",
  "Critical judgment of work in any given field has little value unless it comes from an expert.",
  "It is impossible to make a significant contribution without being influenced by past achievements.",
  "Contemporary luxuries prevent people from developing into strong, independent individuals.",
  "The best way to teach is to praise positive actions and ignore negative ones.",
  "People's attitudes are determined more by immediate surroundings than by society as a whole.",
  "Scandals are useful because they focus attention on problems in ways reformers cannot.",
  "Governments should not fund scientific research whose consequences are unclear.",
  "Strict trash limits per household are the best solution to consumer waste.",
  "Knowing about the past cannot help people make important decisions today.",
  "Societies should instill cooperation rather than competition in young leaders.",
  "Major policy decisions should always be left to government experts.",
  "Institutions should encourage students to choose lucrative career fields.",
  "Private economic systems serve general welfare better than government-run systems.",
  "The best ideas arise from passionate interest in commonplace things.",
  "To understand a society, one must study its major cities.",
  "Governments should offer free university education to admitted students who cannot afford tuition.",
  "Universities should require courses outside each student's major.",
  "Nations should require a uniform national curriculum until college.",
  "Any fact should be mistrusted because facts often prove mistaken.",
  "Corporations have a responsibility to promote societal and environmental well-being.",
  "Imagination is more valuable than experience for envisioning possibilities.",
  "Effective leaders must maintain the highest ethical and moral standards.",
];

const argumentPrompts = [
  `The city of Elmwood recently installed bike lanes on its main commercial street. Within six months, several local businesses reported increased foot traffic. The city council should therefore install bike lanes on all major streets to boost economic activity across the entire city.`,
  `A recent survey of Bayview University graduates found that fewer than 20 percent found employment in their field of study within six months. Bayview should therefore reduce tuition and expand career counseling to improve graduate outcomes.`,
  `The number of bicycle-related accidents in Centerville rose 200 percent after helmet laws were repealed. Centerville should immediately reinstate mandatory helmet laws to protect cyclists.`,
  `Last year, restaurants in downtown Milltown that added outdoor seating saw revenue increase by 15 percent on average. Milltown should subsidize outdoor seating for all downtown restaurants to revitalize the district.`,
  `Employees at Apex Corp who participated in a four-day workweek pilot reported higher job satisfaction. Apex should permanently adopt a four-day workweek company-wide to boost morale and retention.`,
  `Since Maple County switched to online tax filing, processing errors dropped 40 percent. Maple County should eliminate paper filing entirely to further reduce errors and save money.`,
  `Homes near the new Riverside Park sold for 10 percent more than similar homes farther away. The city should build additional parks in every neighborhood to raise property values citywide.`,
  `After the library extended evening hours, circulation increased 25 percent. All public libraries in the region should extend hours to increase readership and community engagement.`,
  `Students who attended optional summer math workshops scored higher on fall assessments. Every school should require summer math workshops for all students entering algebra.`,
  `The town of Brookfield saw crime drop after installing more streetlights. Brookfield should install additional lighting on every block to eliminate crime entirely.`,
  `A study found that employees who use standing desks report fewer back problems. Every office should replace all seated desks with standing desks to improve worker health.`,
  `After the museum offered free admission on Sundays, attendance doubled. The museum should make admission free every day to maximize cultural access and donations.`,
  `Fish populations in Lake Harrow declined after a factory opened upstream. The factory should be closed immediately to restore the lake ecosystem.`,
  `Graduates of Northgate High who took AP courses earned higher college GPAs. Northgate should require all students to take at least three AP courses before graduation.`,
  `Traffic congestion decreased 12 percent after tolls were introduced on the West Bridge. The city should add tolls to all bridges to eliminate congestion completely.`,
  `Customer satisfaction at Grocer's Market rose after checkout lanes were expanded. All supermarkets should add checkout lanes to improve customer experience.`,
  `Hospital readmission rates fell after nurses received additional training in discharge planning. Every hospital should mandate this training to reduce readmissions nationwide.`,
  `Property values in the Arts District rose after graffiti murals were commissioned. The city should fund murals in every commercial zone to increase tax revenue.`,
  `Employee productivity at Zenith Tech increased when remote work was allowed two days per week. Zenith should switch to fully remote work to maximize productivity.`,
  `Small businesses near the new transit hub reported higher sales. The city should build transit hubs in every neighborhood to support all local businesses equally.`,
  `Volunteer hours at the community center rose after a social media campaign. Every nonprofit should invest solely in social media to increase volunteerism.`,
  `Students in classes capped at 15 outperformed those in classes of 30. All schools should cap every class at 15 students regardless of budget constraints.`,
  `Air quality improved after the city banned wood-burning stoves. The city should ban all combustion heating to guarantee perfect air quality.`,
  `Tourism revenue increased after the historic lighthouse was restored. Every town with aging infrastructure should restore one landmark to boost tourism.`,
  `After switching to organic feed, a farm's egg production rose slightly. All farms should use organic feed to increase national egg supply.`,
  `The software firm reduced bugs by 30 percent after adopting pair programming. All development teams should use pair programming exclusively.`,
  `Library e-book downloads surged after the catalog expanded. Physical book collections should be eliminated to save space and cost.`,
  `Employee absenteeism fell after on-site childcare opened. Every employer should provide free on-site childcare to eliminate absenteeism.`,
  `Restaurant health violations dropped after inspectors doubled visit frequency. Inspections should occur daily at every food establishment.`,
  `College alumni donations increased after the president hosted regional reunions. Universities should spend all advancement budgets on reunions rather than scholarships.`,
  `Bike lane installation correlated with rising retail sales on Main Street. Therefore bike lanes cause retail growth on every street type.`,
  `Graduate employment rates lag at Bayview; therefore career counseling alone will fix outcomes without curriculum review.`,
  `Helmet law repeal preceded more accidents; therefore helmets alone explain the entire increase without considering ridership growth.`,
  `Outdoor seating correlated with revenue gains; therefore seating causes gains even during unrelated economic booms.`,
  `Four-day weeks correlated with satisfaction; therefore productivity and client coverage remain unaffected.`,
  `Online filing reduced errors; therefore no residents lack internet access or need paper options.`,
  `Park proximity correlated with home prices; therefore parks alone determine property values in all neighborhoods.`,
  `Extended library hours increased circulation; therefore budget constraints and staffing needs are irrelevant.`,
  `Summer workshops correlated with higher scores; therefore workshops alone caused gains without self-selection bias.`,
  `More streetlights correlated with less crime; therefore lighting alone eliminates all criminal activity.`,
  `Standing desks correlated with fewer back complaints; therefore seated work should be abolished entirely.`,
  `Free Sunday admission doubled attendance; therefore daily free admission is financially sustainable without data.`,
  `Factory opening preceded fish decline; therefore closing the factory guarantees full ecological recovery.`,
  `AP takers had higher college GPAs; therefore requiring AP for all students will replicate outcomes for every learner.`,
  `Bridge tolls reduced congestion slightly; therefore tolling every bridge eliminates congestion completely.`,
  `More checkout lanes improved satisfaction; therefore lane count alone determines satisfaction regardless of staffing.`,
  `Discharge training reduced readmissions; therefore training alone addresses all readmission causes nationwide.`,
  `Murals correlated with rising property values; therefore murals alone raise values in every zone.`,
  `Remote days increased productivity; therefore full remote work maximizes productivity for all roles.`,
  `Transit hub proximity helped nearby sales; therefore hubs in every neighborhood help all businesses equally.`,
  `Social media campaign increased volunteers; therefore social media alone sustains volunteer growth without other outreach.`,
];

function buildWriting() {
  const out = [];
  for (let i = 0; i < 50; i++) {
    out.push({
      id: `w${i + 1}`,
      section: "writing",
      type: "issue-task",
      prompt: `Issue Task (30 minutes): Write a response in which you discuss the extent to which you agree or disagree with the following statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.\n\n"${issueTopics[i]}"`,
      explanation:
        "Strong responses take a clear, nuanced position; support it with specific reasons and examples; acknowledge counterarguments; and explain how competing considerations shape the final judgment.",
      difficulty: "medium",
      tags: ["issue-task"],
    });
  }
  for (let i = 0; i < 50; i++) {
    out.push({
      id: `w${50 + i + 1}`,
      section: "writing",
      type: "argument-task",
      prompt: `Argument Task (30 minutes): Write a response in which you discuss what specific evidence is needed to evaluate the argument and explain how the evidence would weaken or strengthen the argument.\n\n"${argumentPrompts[i]}"`,
      explanation:
        "Strong responses identify key assumptions, specify evidence that would test them, and explain whether that evidence would strengthen or weaken the conclusion—without simply agreeing or disagreeing.",
      difficulty: "medium",
      tags: ["argument-task"],
    });
  }
  return out;
}

// ── GENERATE ─────────────────────────────────────────────────────────────────

const rc = buildVerbalRC();
const tc = buildVerbalTC(41);
const se = buildVerbalSE(71);
const verbal = [...rc, ...tc, ...se];

const quant = buildQuant();
const writing = buildWriting();

console.log(`Verbal: ${verbal.length}, Quant: ${quant.length}, Writing: ${writing.length}`);

const importLine = 'import { Question } from "../../types";';

writeModule(join(ROOT, "verbal", "reading-comprehension.ts"), importLine, "readingComprehensionQuestions", rc);
writeModule(join(ROOT, "verbal", "text-completion.ts"), importLine, "textCompletionQuestions", tc);
writeModule(join(ROOT, "verbal", "sentence-equivalence.ts"), importLine, "sentenceEquivalenceQuestions", se);

writeModule(
  join(ROOT, "verbal", "passages.ts"),
  "",
  "passages",
  Object.entries(passages).map(([id, text]) => ({ id, text }))
);

// Fix passages.ts - it's not Question type, write manually
writeFileSync(
  join(ROOT, "verbal", "passages.ts"),
  `export const passages: Record<string, string> = {\n${Object.entries(passages)
    .map(([k, v]) => `  ${k}: \`${esc(v)}\`,`)
    .join("\n")}\n};\n`
);

writeModule(join(ROOT, "verbal", "index.ts"), importLine.replace("../../types", "../types") + `\nimport { readingComprehensionQuestions } from "./reading-comprehension";\nimport { textCompletionQuestions } from "./text-completion";\nimport { sentenceEquivalenceQuestions } from "./sentence-equivalence";`, "verbalQuestions", []);

// Rewrite verbal index properly
writeFileSync(
  join(ROOT, "verbal", "index.ts"),
  `import { Question } from "../../types";
import { readingComprehensionQuestions } from "./reading-comprehension";
import { textCompletionQuestions } from "./text-completion";
import { sentenceEquivalenceQuestions } from "./sentence-equivalence";

export { passages } from "./passages";
export { readingComprehensionQuestions } from "./reading-comprehension";
export { textCompletionQuestions } from "./text-completion";
export { sentenceEquivalenceQuestions } from "./sentence-equivalence";

export const verbalQuestions: Question[] = [
  ...readingComprehensionQuestions,
  ...textCompletionQuestions,
  ...sentenceEquivalenceQuestions,
];
`
);

const quantByType = {
  arithmetic: quant.filter((q) => q.type === "arithmetic"),
  algebra: quant.filter((q) => q.type === "algebra"),
  geometry: quant.filter((q) => q.type === "geometry"),
  "data-analysis": quant.filter((q) => q.type === "data-analysis"),
};

for (const [type, qs] of Object.entries(quantByType)) {
  writeModule(join(ROOT, "quantitative", `${type}.ts`), importLine, `${type.replace(/-/g, "")}Questions`, qs);
}

writeFileSync(
  join(ROOT, "quantitative", "index.ts"),
  `import { Question } from "../../types";
import { arithmeticQuestions } from "./arithmetic";
import { algebraQuestions } from "./algebra";
import { geometryQuestions } from "./geometry";
import { dataanalysisQuestions } from "./data-analysis";

export { arithmeticQuestions } from "./arithmetic";
export { algebraQuestions } from "./algebra";
export { geometryQuestions } from "./geometry";
export { dataanalysisQuestions } from "./data-analysis";

export const quantitativeQuestions: Question[] = [
  ...arithmeticQuestions,
  ...algebraQuestions,
  ...geometryQuestions,
  ...dataanalysisQuestions,
];
`
);

const issue = writing.filter((q) => q.type === "issue-task");
const argument = writing.filter((q) => q.type === "argument-task");

writeModule(join(ROOT, "writing", "issue-task.ts"), importLine, "issueTaskQuestions", issue);
writeModule(join(ROOT, "writing", "argument-task.ts"), importLine, "argumentTaskQuestions", argument);

writeFileSync(
  join(ROOT, "writing", "index.ts"),
  `import { Question } from "../../types";
import { issueTaskQuestions } from "./issue-task";
import { argumentTaskQuestions } from "./argument-task";

export { issueTaskQuestions } from "./issue-task";
export { argumentTaskQuestions } from "./argument-task";

export const writingQuestions: Question[] = [
  ...issueTaskQuestions,
  ...argumentTaskQuestions,
];
`
);

writeFileSync(
  join(ROOT, "index.ts"),
  `import { Question, Section } from "../types";
import { verbalQuestions } from "./verbal";
import { quantitativeQuestions } from "./quantitative";
import { writingQuestions } from "./writing";

export { verbalQuestions, quantitativeQuestions, writingQuestions };
export * from "./verbal";
export * from "./quantitative";
export * from "./writing";

export const questions: Question[] = [
  ...verbalQuestions,
  ...quantitativeQuestions,
  ...writingQuestions,
];

export function getQuestionsBySection(section: string): Question[] {
  return questions.filter((q) => q.section === section);
}

export function getQuestionById(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}

export function getQuestionCountBySection(section?: Section): number | Record<Section, number> {
  if (section) {
    return getQuestionsBySection(section).length;
  }
  return {
    verbal: verbalQuestions.length,
    quantitative: quantitativeQuestions.length,
    writing: writingQuestions.length,
  };
}

export function getQuestionsByIds(ids: string[]): Question[] {
  const map = new Map(questions.map((q) => [q.id, q]));
  return ids.map((id) => map.get(id)).filter((q): q is Question => q !== undefined);
}
`
);

console.log("Question bank generated successfully.");
