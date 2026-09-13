"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bot, Send, Sparkles, User, HelpCircle, ShieldAlert } from "lucide-react";
import { submitFarmerQuestion } from "@/features/ai/actions";
import { BottomNav } from "@/components/layout/BottomNav";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export default function AskAIPage() {
  const [selectedCrop, setSelectedCrop] = useState<string>("groundnut");
  const [inputQuestion, setInputQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      text: `నమస్కారం రమేష్ గారు! 🙏\nనేను మీ వ్యక్తిగత AI ఫార్మ్ మేనేజర్‌ని. మీ వేరుశనగ, బత్తాయి లేదా దానిమ్మ పంటల సంరక్షణ గురించి నన్ను ఏదైనా అడగవచ్చు.`,
    },
  ]);

  const promptSuggestions = [
    { label: "నీరు ఎప్పుడు ఇవ్వాలి?", q: "నా పంటకు నీరు ఎప్పుడు మరియు ఎంత ఇవ్వాలి?" },
    { label: "ఆకులు పసుపు రంగులోకి మారాయి", q: "నా పంట ఆకులు పసుపు రంగులోకి మారుతున్నాయి, కారణం ఏమిటి?" },
    { label: "పూత దశలో తీసుకోవాల్సిన జాగ్రత్తలు", q: "ప్రస్తుత పూత దశలో ఏ ఎరువులు లేదా జాగ్రత్తలు పాటించాలి?" },
    { label: "ఈ రోజు ఏమి గమనించాలి?", q: "ఈ రోజు పొలంలో నేను ప్రధానంగా ఏ సమస్యలు పరిశీలించాలి?" },
  ];

  const handleSend = async (questionToSend?: string) => {
    const q = questionToSend || inputQuestion;
    if (!q.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion("");
    setIsLoading(true);

    try {
      const res = await submitFarmerQuestion(selectedCrop, q);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", text: res.answer };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: "క్షమించండి, సమాచారం పొందడంలో అంతరాయం ఏర్పడింది. దయచేసి కాసేపటి తర్వాత ప్రయత్నించండి.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-24 max-w-md mx-auto font-sans flex flex-col">
      {/* Top Header */}
      <header className="bg-emerald-800 text-white px-4 pt-6 pb-4 rounded-b-3xl shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-bold text-emerald-900 bg-white px-3 py-1.5 rounded-full shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>హోమ్</span>
          </Link>
          <div className="flex items-center gap-1.5 bg-emerald-700/80 px-3 py-1 rounded-full text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-emerald-100">AI Farm Manager ఆన్‌లైన్</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-inner">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-lg font-black leading-tight">వ్యవసాయ AI సహాయకుడు</h1>
            <p className="text-[11px] text-emerald-200">శ్రీ సత్యసాయి జిల్లా వాతావరణం & నేలల ఆధారంగా</p>
          </div>
        </div>

        {/* Crop Selection Bar */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-emerald-700/60 overflow-x-auto pb-1">
          {[
            { id: "groundnut", name: "వేరుశనగ (42 రోజులు)", emoji: "🥜" },
            { id: "mosambi", name: "బత్తాయి (4 సం.)", emoji: "🍊" },
            { id: "pomegranate", name: "దానిమ్మ (3 సం.)", emoji: "❤️" },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCrop(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCrop === c.id
                  ? "bg-white text-emerald-900 shadow-md"
                  : "bg-emerald-700/60 text-emerald-100 hover:bg-emerald-700"
              }`}
            >
              <span>{c.emoji}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Safety Banner */}
      <div className="mx-4 mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-[10px] text-amber-800">
        <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>ఇది ప్రాథమిక AI సలహా మాత్రమే. ముఖ్యమైన నిర్ణయాలకు స్థానిక అధికారులను సంప్రదించండి.</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-emerald-700 text-white font-medium rounded-tr-none shadow-sm"
                  : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm whitespace-pre-line"
              }`}
            >
              {m.text}
            </div>
            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 italic bg-white p-3 rounded-2xl border border-slate-200 max-w-[70%]">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>AI సమాధానం సిద్ధం చేస్తోంది...</span>
          </div>
        )}
      </div>

      {/* Quick Suggestion Pills */}
      <div className="px-4 py-2 overflow-x-auto flex gap-1.5 scrollbar-none">
        {promptSuggestions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(item.q)}
            className="text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm hover:bg-emerald-50 hover:border-emerald-300 transition-colors flex-shrink-0"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <div className="px-4 pt-1 pb-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-300 shadow-md focus-within:ring-2 focus-within:ring-emerald-600"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="మీ పంట గురించి ప్రశ్న అడగండి..."
            className="flex-1 px-3 py-2 text-xs text-slate-900 bg-transparent focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center disabled:opacity-40 active:scale-95 transition-transform shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      <BottomNav />
    </main>
  );
}
