export interface CropStageInfo {
  id: string;
  name: string;
  nameTe: string;
  dayStart: number;
  dayEnd: number;
  activitiesTe: string[];
  monitoringTe: string[];
}

export const groundnutStages: CropStageInfo[] = [
  {
    id: "sowing",
    name: "Sowing",
    nameTe: "విత్తనం వేయడం",
    dayStart: 0,
    dayEnd: 10,
    activitiesTe: ["విత్తన శుద్ధి (ట్రైకోడెర్మా విరిడే)", "సాలుకు సాలుకు 30 సెం.మీ దూరం"],
    monitoringTe: ["నేలలో తగినంత తేమ", "విత్తనం నాటే లోతు (5 సెం.మీ మించకూడదు)"],
  },
  {
    id: "vegetative",
    name: "Vegetative Growth",
    nameTe: "శాకీయ ఎదుగుదల",
    dayStart: 11,
    dayEnd: 30,
    activitiesTe: ["అంతరకృషి మరియు కలుపు నివారణ", "మొదటి దఫా తేలికపాటి తడి"],
    monitoringTe: ["రసం పీల్చే పురుగులు", "ఆకుల రంగు"],
  },
  {
    id: "flowering",
    name: "Flowering",
    nameTe: "పూత దశ (ప్రస్తుతం)",
    dayStart: 31,
    dayEnd: 50,
    activitiesTe: ["జిప్సం ఎకరానికి 200 కిలోలు వేయడం", "కలుపు లేకుండా శుభ్రం చేయడం"],
    monitoringTe: ["టిక్కా ఆకుమచ్చ తెగులు", "పూత రాలడం లేకుండా చూడటం"],
  },
  {
    id: "pegging",
    name: "Pegging",
    nameTe: "ఊడలు దిగే దశ",
    dayStart: 51,
    dayEnd: 70,
    activitiesTe: ["నేలలో స్థిరమైన తేమ నిర్వహణ", "మట్టి కదల్చకుండా జాగ్రత్తపడటం"],
    monitoringTe: ["పై 2 అంగుళాల మట్టి తేమ", "ఊడలు సులువుగా దిగుతున్నాయా లేదా"],
  },
  {
    id: "pod_dev",
    name: "Pod Development",
    nameTe: "కాయ అభివృద్ధి",
    dayStart: 71,
    dayEnd: 100,
    activitiesTe: ["పొటాష్ మరియు బోరాన్ పోషకాలు", "క్రమబద్ధమైన తడులు"],
    monitoringTe: ["వేరు పురుగు (White grub)", "కాయ నాణ్యత"],
  },
  {
    id: "harvest",
    name: "Harvest",
    nameTe: "పంట కోత దశ",
    dayStart: 101,
    dayEnd: 120,
    activitiesTe: ["మొక్కలు పీకి ఆరబెట్టడం", "కాయలను వేరు చేయడం"],
    monitoringTe: ["కాయ గట్టిపడటం", "తేమ శాతం (8-9%)"],
  },
];
