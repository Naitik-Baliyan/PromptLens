import React, { useState } from 'react';
import { Download, Code2, FileJson, FileText, Copy, Check } from 'lucide-react';

const SAMPLE_PROMPT = `You are an expert data analyst. Your task is to analyze the provided dataset and return a structured JSON report.

Rules:
- Always return valid JSON
- Include a "summary" field with a one-sentence overview
- Include a "insights" array with 3-5 key findings
- Keep your tone professional and concise`;

const CODE_TEMPLATES = {
  python: `import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

completion = client.chat.completions.create(
    model="llama3-8b-8192",
    messages=[
        {
            "role": "system",
            "content": """${SAMPLE_PROMPT}"""
        },
        {
            "role": "user",
            "content": "Analyze this dataset: ..."
        }
    ]
)

print(completion.choices[0].message.content)`,

  nodejs: `import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const completion = await client.chat.completions.create({
  model: "llama3-8b-8192",
  messages: [
    {
      role: "system",
      content: \`${SAMPLE_PROMPT}\`,
    },
    { role: "user", content: "Analyze this dataset: ..." },
  ],
});

console.log(completion.choices[0].message.content);`,

  langchain: `from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage

llm = ChatGroq(model="llama3-8b-8192")

messages = [
    SystemMessage(content="""${SAMPLE_PROMPT}"""),
    HumanMessage(content="Analyze this dataset: ..."),
]

response = llm.invoke(messages)
print(response.content)`,
};

const TABS = [
  { key: 'python',   label: 'Python',    icon: Code2 },
  { key: 'nodejs',   label: 'Node.js',   icon: Code2 },
  { key: 'langchain',label: 'LangChain', icon: Code2 },
];

export default function ExportPanel() {
  const [activeTab, setActiveTab] = useState('python');
  const [copied, setCopied]       = useState(false);
  const [exportFormat, setExportFormat] = useState('json');

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_TEMPLATES[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const content = exportFormat === 'json'
      ? JSON.stringify({ prompt: SAMPLE_PROMPT, model: 'llama3-8b-8192', scores: { clarity: 7, specificity: 5, constraints: 3, predictability: 8 } }, null, 2)
      : `# PromptLens Export\n\n## Prompt\n\n\`\`\`\n${SAMPLE_PROMPT}\n\`\`\`\n\n## Scores\n- Clarity: 7/10\n- Specificity: 5/10\n- Constraint Quality: 3/10\n- Output Predictability: 8/10`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `promptlens-export.${exportFormat}`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Export & Prompt Cards</h2>
          <p className="text-neutral-400 mt-1 text-sm">Export prompts as code snippets or shareable prompt cards.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-white/10 rounded-md overflow-hidden">
            <button
              onClick={() => setExportFormat('json')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs transition-colors ${exportFormat === 'json' ? 'bg-white text-black font-medium' : 'text-neutral-400 hover:text-white'}`}
            >
              <FileJson className="w-3.5 h-3.5" /> JSON
            </button>
            <button
              onClick={() => setExportFormat('md')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs transition-colors border-l border-white/10 ${exportFormat === 'md' ? 'bg-white text-black font-medium' : 'text-neutral-400 hover:text-white'}`}
            >
              <FileText className="w-3.5 h-3.5" /> Markdown
            </button>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-md font-medium transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Prompt Card Preview */}
      <div className="p-6 rounded-lg border border-white/10 bg-[#0A0A0A]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white">Prompt Card Preview</h3>
          <span className="text-xs text-neutral-500 font-mono">llama3-8b-8192 · Groq</span>
        </div>
        <pre className="font-mono text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap bg-white/3 rounded-md p-4 border border-white/5">
          {SAMPLE_PROMPT}
        </pre>
        {/* Score strip */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: 'Clarity',      score: 7, color: 'text-blue-400' },
            { label: 'Specificity',  score: 5, color: 'text-violet-400' },
            { label: 'Constraints',  score: 3, color: 'text-amber-400' },
            { label: 'Predictability', score: 8, color: 'text-emerald-400' },
          ].map((d) => (
            <div key={d.label} className="p-2 rounded-md border border-white/5 bg-white/3 text-center">
              <div className={`text-lg font-bold tabular-nums ${d.color}`}>{d.score}</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Code Snippet Exporter */}
      <div className="rounded-lg border border-white/10 bg-[#0A0A0A] overflow-hidden">
        {/* Tab bar */}
        <div className="flex items-center border-b border-white/5 bg-[#111111]">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 text-sm transition-colors flex items-center gap-2 ${activeTab === tab.key ? 'text-white border-b border-white' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
          <button
            onClick={handleCopy}
            className="ml-auto mr-3 flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-white/5"
          >
            {copied ? <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Copied</span></> : <><Copy className="w-3.5 h-3.5" />Copy</>}
          </button>
        </div>
        <pre className="font-mono text-xs text-neutral-300 p-5 overflow-x-auto leading-relaxed">
          {CODE_TEMPLATES[activeTab]}
        </pre>
      </div>
    </div>
  );
}
