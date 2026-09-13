import { GoogleGenAI } from "@google/genai";
import { FarmerContextData, buildFarmerSystemPrompt } from "./contextBuilder";

export async function askAgriAI(
  userQuestion: string,
  contextData: FarmerContextData
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  // If API key is provided, execute live Gemini call
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = buildFarmerSystemPrompt(contextData);
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemInstruction}\n\nFarmer's Question: ${userQuestion}` }] }
        ],
      });

      if (response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to local advisory engine:", err);
    }
  }

  // Fallback engine: Context-aware responses for Groundnut, Mosambi & Pomegranate
  const crop = contextData.crop?.name?.toLowerCase();
  const q = userQuestion.toLowerCase();

  if (crop === "groundnut" || q.includes("groundnut") || q.includes("వేరుశనగ")) {
    return `🎯 **నేను అర్థం చేసుకున్నది (What I Understand):**
మీ వేరుశనగ పంట (${contextData.crop?.variety || "కదిరి-6"}) ప్రస్తుతం 42 రోజుల వయస్సులో పూత మరియు ఊడలు దిగే (Pegging) అత్యంత కీలకమైన దశలో ఉంది.

🔍 **సాధ్యమైన పరిస్థితి (Context):**
శ్రీ సత్యసాయి జిల్లాలోని ఎర్ర ఇసుక నేలల్లో ఈ దశలో తేమ ఆరిపోతే ఊడలు నేలలోకి సరిగ్గా చొచ్చుకుపోలేవు. దీనివల్ల కాయలు ఏర్పడటం గణనీయంగా తగ్గుతుంది.

📋 **పొలంలో ఏమి పరిశీలించాలి? (What to Inspect):**
1. చేనులో పై 2 అంగుళాల మట్టిని చేత్తో పట్టుకుని చూడండి - మట్టి ఉండకట్టకపోతే తేమ తక్కువగా ఉన్నట్లు.
2. ఆకుల అడుగు భాగాన టిక్కా ఆకుమచ్చ (Tikka Leaf Spot) లేదా లద్దెపురుగు గుడ్లు ఉన్నాయా గమనించండి.

💡 **తదుపరి చేయవలసిన పని (Recommended Next Step):**
- వెంటనే తేలికపాటి తడి అందించండి (భారీగా నీరు నిల్వ ఉండకూడదు).
- జిప్సం వేయకపోతే, ఎకరానికి 200 కిలోల జిప్సం ఊడలు దిగే ప్రాంతంలో వేసి తేలికపాటి తడి ఇవ్వండి.

⚠️ **గమనిక (Important):**
ఆకులపై నల్లటి మచ్చలు వేగంగా విస్తరిస్తే స్థానిక వ్యవసాయ అధికారిని లేదా శాస్త్రవేత్తను సంప్రదించండి.`;
  }

  if (crop === "mosambi" || q.includes("mosambi") || q.includes("బత్తాయి")) {
    return `🎯 **నేను అర్థం చేసుకున్నది (What I Understand):**
మీ 4 సంవత్సరాల బత్తాయి తోట (${contextData.crop?.variety || "సాత్గుడి"}) ప్రస్తుతం కాయ ఎదుగుదల (Fruit Development) దశలో ఉంది.

🔍 **సాధ్యమైన పరిస్థితి (Context):**
కాయ లావు ఎక్కే ఈ సమయంలో నీటి హెచ్చుతగ్గులు జరిగితే కాయ పగుళ్లు (Fruit Splitting) మరియు రాలిపోవడం జరిగే అవకాశం ఉంది.

📋 **తోటలో ఏమి పరిశీలించాలి? (What to Inspect):**
1. డ్రిప్ డ్రిప్పర్లు ఉప్పు పేరుకుపోయి మూసుకుపోయాయేమో పరిశీలించండి.
2. కాయ తొడిమ వద్ద రంగు మారడం లేదా రసం పీల్చే పురుగుల ప్రభావం గమనించండి.

💡 **తదుపరి చేయవలసిన పని (Recommended Next Step):**
- డ్రిప్ ద్వారా క్రమబద్ధమైన సమయాల్లో మాత్రమే నీరు అందించండి.
- కాయ పరిమాణం, నాణ్యత పెరగడానికి పొటాషియం నైట్రేట్ (13-0-45) 10 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయవచ్చు.

⚠️ **గమనిక (Important):**
చెట్ల మొదళ్ల వద్ద జిగురు కారడం (Gummosis) కనిపిస్తే తక్షణమే నిపుణులను సంప్రదించండి.`;
  }

  return `🎯 **నేను అర్థం చేసుకున్నది (What I Understand):**
మీరు అడిగిన ప్రశ్న మీ వ్యవసాయ క్షేత్రం (${contextData.farm.name}) నిర్వహణకు సంబంధించినది.

🔍 **సాధ్యమైన అంశం (Context):**
శ్రీ సత్యసాయి జిల్లా వాతావరణ పరిస్థితులకు అనుగుణంగా క్రమబద్ధమైన క్షేత్ర పరిశీలన ఎంతో ముఖ్యం.

📋 **క్షేత్రంలో ఏమి పరిశీలించాలి? (What to Inspect):**
1. నేలలోని తేమ శాతం మరియు వేరు మండల ఆరోగ్యం.
2. మొక్కల ఆకుల రంగు మరియు క్రిమికీటకాల ఉనికి.

💡 **తదుపరి చేయవలసిన పని (Recommended Next Step):**
- ఉదయం లేదా సాయంత్రం వేళల్లో చేనును గమనించి తగినంత రక్షణ చర్యలు చేపట్టండి.

⚠️ **గమనిక (Important):**
సమస్య తీవ్రత ఎక్కువగా ఉంటే స్థానిక రైతు భరోసా కేంద్రం (RBK) వ్యవసాయ సహాయకుడిని సంప్రదించండి.`;
}
