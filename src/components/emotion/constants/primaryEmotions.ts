// src/components/emotion/constants/primaryEmotions.ts
export type PrimaryEmotion = {
  id: string;
  name: string;
  category: "basic" | "relation" | "self";
  description: string;
  physical: string;
  color: string; // tailwind 클래스 (bg + border)
  positive: string[];
  caution: string[];
};

export const PRIMARY_EMOTIONS: PrimaryEmotion[] = [
  // 기본 정서
  {
    id: "joy",
    name: "기쁨",
    category: "basic",
    description: "반가움, 즐거움, 감사함 등",
    physical: "얼굴에 미소가 떠오르고 몸이 가벼워지는 느낌",
    color: "bg-emerald-50 border-emerald-300 hover:border-emerald-500",
    positive: [
      "기쁨은 삶에서 소중한 것을 잘 보고 있다는 신호입니다.",
      "즐거움을 느낄 때 에너지가 회복되고 관계도 더 친밀해집니다.",
    ],
    caution: [
      "기쁨을 잃지 않기 위해 감정을 억지로 유지하려 하면 오히려 지칠 수 있습니다.",
    ],
  },
  {
    id: "sad",
    name: "슬픔",
    category: "basic",
    description: "상실감, 눈물이 날 것 같은 느낌 등",
    physical: "가슴이 답답하고, 목이 메이며, 눈물이 나옴",
    color: "bg-blue-50 border-blue-300 hover:border-blue-500",
    positive: [
      "슬픔은 상실의 가치를 인정하는 신호입니다. 소중했던 것을 알게 해줍니다.",
      "눈물은 치유의 시작입니다. 감정을 표현하는 것이 회복의 첫걸음입니다.",
      "슬픔을 통해 우리는 더 깊은 공감 능력을 갖게 됩니다.",
    ],
    caution: [
      "지나친 슬픔에 빠지면 일상생활이 어려워질 수 있습니다.",
      "오랜 기간 지속되면 우울증으로 발전할 수 있으니 주의가 필요합니다.",
    ],
  },
  {
    id: "anger",
    name: "분노",
    category: "basic",
    description: "억울함, 화가 치밀어 오르는 느낌 등",
    physical: "심장이 빠르게 뛰고, 얼굴이 화끈거리며, 주먹이 쥐어짐",
    color: "bg-red-50 border-red-300 hover:border-red-500",
    positive: [
      "분노는 경계가 침해되었음을 알려주는 신호입니다.",
      "정당한 분노는 변화와 정의를 위한 에너지가 됩니다.",
      "자신의 가치를 지키려는 건강한 반응일 수 있습니다.",
    ],
    caution: [
      "분노를 억누르거나 폭발시키면 관계가 손상될 수 있습니다.",
      "분노 뒤에 숨은 두려움이나 상처를 살펴볼 필요가 있습니다.",
    ],
  },
  {
    id: "fear",
    name: "두려움",
    category: "basic",
    description: "불안, 위협을 감지하는 느낌 등",
    physical: "온몸이 경직되고, 식은땀이 나며, 심장이 두근거림",
    color: "bg-purple-50 border-purple-300 hover:border-purple-500",
    positive: [
      "두려움은 위험을 미리 감지하는 보호 기능입니다.",
      "신중함과 준비를 하게 만들어 더 안전하게 만듭니다.",
      "용기는 두려움이 없는 것이 아니라, 두려움에도 불구하고 나아가는 것입니다.",
    ],
    caution: [
      "과도한 두려움은 회피 행동으로 이어져 삶이 제한될 수 있습니다.",
      "불안장애로 발전하지 않도록 현실적인 위험 평가가 필요합니다.",
    ],
  },
  {
    id: "disgust",
    name: "혐오",
    category: "basic",
    description: "꺼리고 피하고 싶은 느낌 등",
    physical: "속이 메스껍고, 얼굴을 찡그리며, 몸을 움츠림",
    color: "bg-green-50 border-green-300 hover:border-green-500",
    positive: [
      "혐오감은 건강하지 못한 것으로부터 자신을 지키는 본능입니다.",
      "부적절한 상황이나 관계를 구분하는 데 도움을 줍니다.",
      "자기 보호의 건강한 신호일 수 있습니다.",
    ],
    caution: [
      "과도한 혐오감은 타인과의 건강한 관계를 방해할 수 있습니다.",
      "자신에 대한 혐오로 이어지지 않도록 주의가 필요합니다.",
    ],
  },
  {
    id: "surprise",
    name: "놀람",
    category: "basic",
    description: "예상치 못한 일에 당황한 느낌 등",
    physical: "심장이 순간 철렁하고, 몸이 움찔하거나 멈칫함",
    color: "bg-sky-50 border-sky-300 hover:border-sky-500",
    positive: [
      "놀람은 뇌가 새로운 정보를 빠르게 처리하고 있다는 신호입니다.",
      "예상 밖의 일에서 배움과 통찰이 나올 수 있습니다.",
    ],
    caution: ["지속적인 놀람과 긴장은 만성 스트레스로 이어질 수 있습니다."],
  },

  // 관계·도덕 정동
  {
    id: "shame",
    name: "수치심",
    category: "relation",
    description: "남 앞에서 부끄럽고 숨고 싶은 느낌",
    physical: "얼굴이 붉어지고, 고개가 숙여지며, 시선을 피하게 됨",
    color: "bg-rose-50 border-rose-300 hover:border-rose-500",
    positive: [
      "수치심은 사회적 규범을 배우고 성장하게 만듭니다.",
      "겸손함과 자기 성찰의 기회를 제공합니다.",
      "타인을 배려하는 마음에서 비롯될 수 있습니다.",
    ],
    caution: [
      "만성적인 수치심은 자존감을 크게 떨어뜨립니다.",
      "“나는 나쁜 사람”이 아니라 “실수를 했다”로 구분하는 연습이 필요합니다.",
    ],
  },
  {
    id: "guilt",
    name: "죄책감",
    category: "relation",
    description: "내가 잘못했다는 자책, 미안함",
    physical: "가슴이 무겁고, 어깨가 처지며, 한숨이 나옴",
    color: "bg-pink-50 border-pink-300 hover:border-pink-500",
    positive: [
      "죄책감은 양심이 살아있다는 증거입니다.",
      "잘못을 인정하고 관계를 회복할 기회를 줍니다.",
      "더 나은 사람이 되려는 동기가 됩니다.",
    ],
    caution: [
      "과도한 죄책감은 자기 비난으로 이어져 우울을 유발할 수 있습니다.",
      "자신의 책임이 아닌 일까지 떠안지 않도록 경계가 필요합니다.",
    ],
  },
  {
    id: "lonely",
    name: "외로움",
    category: "relation",
    description: "연결되지 못한 느낌, 혼자인 느낌",
    physical: "가슴이 텅 빈 느낌, 몸이 차갑고, 기력이 없음",
    color: "bg-indigo-50 border-indigo-300 hover:border-indigo-500",
    positive: [
      "외로움은 연결이 필요하다는 신호입니다. 관계의 중요성을 일깨웁니다.",
      "자기 자신과 깊이 만날 수 있는 시간이 됩니다.",
      "진정한 친밀감을 갈망하게 만들어 의미 있는 관계를 추구하게 합니다.",
    ],
    caution: [
      "장기간 외로움은 우울과 불안으로 이어질 수 있습니다.",
      "회피가 아닌 작은 연결부터 시도하는 것이 중요합니다.",
    ],
  },

  // 자기 관련 정동
  {
    id: "achievement",
    name: "성취감",
    category: "self",
    description: "해냈다는 뿌듯함과 만족",
    physical: "가슴이 벅차고, 어깨가 펴지고, 에너지가 올라감",
    color: "bg-lime-50 border-lime-300 hover:border-lime-500",
    positive: [
      "성취감은 노력과 성장이 연결되었다는 신호입니다.",
      "자신에 대한 신뢰와 자기 효능감을 키웁니다.",
    ],
    caution: [
      "성취만을 기준으로 자신을 평가하면, 실패 시 자존감이 크게 흔들릴 수 있습니다.",
    ],
  },
  {
    id: "satisfaction",
    name: "만족감",
    category: "self",
    description: "지금 상태에 대한 편안함",
    physical: "몸과 마음이 느긋하고, 긴장이 풀리는 느낌",
    color: "bg-teal-50 border-teal-300 hover:border-teal-500",
    positive: [
      "만족감은 현재를 누리고 쉼을 허용하게 합니다.",
      "과도한 경쟁에서 한 걸음 물러나 균형을 잡게 해줍니다.",
    ],
    caution: ["지나치게 안주하면 필요한 변화를 미루게 될 수 있습니다."],
  },
  {
    id: "despair",
    name: "절망",
    category: "self",
    description: "희망이 없고 막막한 느낌",
    physical: "온몸에 힘이 빠지고, 숨쉬기 힘들며, 모든 게 무기력함",
    color: "bg-slate-50 border-slate-400 hover:border-slate-600",
    positive: [
      "절망은 근본적인 변화가 필요하다는 강력한 신호입니다.",
      "인생의 바닥을 경험한 후 새로운 시작을 할 수 있습니다.",
      "더 이상 내려갈 곳이 없다면, 이제는 올라갈 일만 남았습니다.",
    ],
    caution: [
      "절망감이 지속되면 자해나 자살 충동으로 이어질 수 있어 즉각적인 도움이 필요할 수 있습니다.",
      "혼자 견디지 말고, 안전한 사람과 전문가의 도움을 구하는 것이 중요합니다.",
    ],
  },
  {
    id: "stuck",
    name: "답답함",
    category: "self",
    description: "막혀 있고 풀리지 않는 느낌",
    physical: "가슴이 답답하고, 한숨이 나오며, 안절부절못함",
    color: "bg-amber-50 border-amber-300 hover:border-amber-500",
    positive: [
      "답답함은 현재 방법이 효과가 없다는 신호입니다. 새로운 접근이 필요함을 알려줍니다.",
      "문제 해결을 위한 창의적 사고를 자극합니다.",
      "인내심과 끈기를 기르는 과정이 될 수 있습니다.",
    ],
    caution: [
      "지속적인 답답함은 포기나 무기력으로 이어질 수 있습니다.",
      "작은 성공 경험을 쌓으며 한 걸음씩 나아가는 것이 중요합니다.",
    ],
  },
];
