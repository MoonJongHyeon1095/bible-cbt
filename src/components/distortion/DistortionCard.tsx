// // src/components/distortion/DistortionCard.tsx
// "use client";

// import { Button } from "../ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../ui/card";
// import { Textarea } from "../ui/textarea";

// type Props = {
//   value: string;
//   onChange: (v: string) => void;
//   onReset: () => void;

//   isLoading?: boolean;
//   onRequestAnalysis?: () => void;
// };

// export function DistortionCard({
//   value,
//   onChange,
//   onReset,
//   isLoading,
//   onRequestAnalysis,
// }: Props) {
//   const handleReset = () => {
//     if (!value) return;
//     onReset();
//   };

//   return (
//     <Card className="h-full border-orange-100 bg-orange-50/40 shadow-sm">
//       <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//         <div className="space-y-1">
//           <CardTitle className="text-base font-semibold text-slate-900">
//             왜곡된 생각 적어보기
//           </CardTitle>
//           <CardDescription className="text-xs text-slate-600 leading-relaxed">
//             자동사고 속에서 특히 왜곡되었다고 느껴지는 부분만 간단히 적어보세요.
//           </CardDescription>
//         </div>

//         <div className="flex flex-col items-end gap-1 text-xs sm:text-[13px]">
//           {onRequestAnalysis && (
//             <Button
//               type="button"
//               variant="secondary"
//               size="sm"
//               className="rounded-full border-slate-200 bg-white/90 px-3 py-1 text-[11px] text-slate-700 hover:bg-slate-50 disabled:opacity-60"
//               onClick={onRequestAnalysis}
//               disabled={isLoading}
//             >
//               {isLoading ? "분석 중..." : "자동 분석으로 채우기"}
//             </Button>
//           )}

//           <Button
//             type="button"
//             variant="ghost"
//             size="sm"
//             className="px-0 text-[11px] text-slate-500 hover:text-slate-700 hover:bg-transparent"
//             onClick={handleReset}
//             disabled={!value}
//           >
//             초기화
//           </Button>
//         </div>
//       </CardHeader>

//       <CardContent>
//         <Textarea
//           className="h-72 rounded-2xl bg-white/80 text-sm leading-relaxed"
//           placeholder='예) "난 항상 실패해. 아무리 해도 소용없어."라는 생각 속에, "이번 한 번의 실패를 인생 전체로 일반화하고 있는 것 같다."'
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//         />
//       </CardContent>
//     </Card>
//   );
// }
