// src/components/emotion/hooks/useDragSegmentEdge.ts
"use client";

import { useState, type MouseEventHandler } from "react";
import type { EmotionInputSegment } from "../types/emotion.types";
import { findNearestIndex } from "../utils/findNearestIndex";
import { RelativeRect } from "../utils/splitToCharRects";

type UseDragSegmentEdgeParams = {
  // 각 글자(span)의 위치 정보 배열
  charRects: RelativeRect[];

  // 지금은 사용 안 하지만, 나중에 세그먼트 전체를 보고 로직을 바꿀 수 있어서
  // 시그니처에만 남겨둔 상태
  segments: EmotionInputSegment[];

  // 실제 segment의 start/end를 바꾸는 함수 (useSegments에서 내려줌)
  updateSegmentBoundary: (
    segmentId: string,
    edge: "start" | "end",
    idx: number
  ) => void;
};

/**
 * 세그먼트의 양 끝(핸들)을 드래그해서 경계를 움직이게 해주는 훅.
 *
 * - 드래그 흐름:
 *   1) SegmentOverlay.Handles에서 핸들을 mousedown → startDrag(segmentId, edge)
 *   2) SegmentEditor의 onMouseMove → handleMouseMove
 *      - 현재 마우스 좌표를 텍스트 영역 안 상대 좌표로 변환
 *      - 가장 가까운 글자 인덱스를 findNearestIndex로 구함
 *      - updateSegmentBoundary(segmentId, edge, idx) 호출
 *   3) onMouseUp → handleMouseUp → dragInfo 초기화
 *
 * 이 훅은 "어느 세그먼트의 어느 edge를 드래그 중인가" 상태만 갖고 있고,
 * 실제 인덱스 변경은 useSegments 쪽으로 위임한다.
 */
export function useDragSegmentEdge({
  charRects,
  updateSegmentBoundary,
}: UseDragSegmentEdgeParams) {
  /**
   * dragInfo: 현재 드래그 중인 세그먼트 정보
   *
   * - null이면 드래그 안 하는 상태
   * - { segmentId, edge } 형태:
   *   - segmentId: 어느 세그먼트인지
   *   - edge: "start" | "end" (왼쪽/오른쪽 핸들)
   */
  const [dragInfo, setDragInfo] = useState<{
    segmentId: string;
    edge: "start" | "end";
  } | null>(null);

  /**
   * 드래그 시작 핸들러
   *
   * - SegmentOverlay.Handles 안의 핸들 컴포넌트에서
   *   onMouseDown(또는 onPointerDown) 시점에 호출한다.
   * - 이후 마우스를 움직이는 동안 handleMouseMove가
   *   이 dragInfo를 참고해서 어떤 segment를 업데이트해야 할지 알 수 있다.
   */
  const startDrag = (segmentId: string, edge: "start" | "end") => {
    setDragInfo({ segmentId, edge });
  };

  /**
   * 드래그 중에 마우스를 움직일 때 호출되는 핸들러.
   *
   * - SegmentEditor에서 전체 컨테이너 div에 onMouseMove로 연결.
   * - dragInfo가 없으면(드래그 중이 아니면) 아무 것도 안 함.
   * - charRects가 없으면(아직 텍스트 위치 계산 전) 아무 것도 안 함.
   *
   * 동작 순서:
   * 1) e.currentTarget.getBoundingClientRect()로 컨테이너의 화면 좌표 얻기
   * 2) 마우스 좌표(clientX, clientY)를 컨테이너 내부 상대 좌표(x, y)로 변환
   * 3) findNearestIndex(charRects, x, y)로 "이 좌표에서 제일 가까운 글자 인덱스" 찾기
   * 4) updateSegmentBoundary(dragInfo.segmentId, dragInfo.edge, idx) 호출
   *    → 실질적인 segment start/end 갱신은 useSegments가 처리
   */
  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    // 드래그 중이 아니면 무시
    if (!dragInfo) return;
    // 텍스트 위치 정보가 없으면 계산 불가
    if (charRects.length === 0) return;

    // 현재 마우스를 올리고 있는 div(= SegmentEditor 컨테이너)의
    // 브라우저 내 절대 위치.
    const containerRect = e.currentTarget.getBoundingClientRect();

    // 마우스 좌표를 "컨테이너 내부에서의 상대 좌표"로 변환.
    // - clientX/Y는 viewport 기준, containerRect.left/top을 빼서 내부 좌표로 만든다.
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;

    // 이제 (x, y)에 가장 가까운 글자 인덱스를 찾는다.
    // - charRects[i]에는 각 글자 span의 left/right/top/height 정보가 들어있다고 가정.
    // - findNearestIndex는 y(줄 위치)와 x(가로 위치)를 대략 고려해서
    //   "여기가 이 글자 주변이겠지"라고 인덱스를 추정해주는 함수.
    const idx = findNearestIndex(charRects, x, y);

    // 실제 segment 업데이트는 useSegments의 updateSegmentBoundary가 담당.
    updateSegmentBoundary(dragInfo.segmentId, dragInfo.edge, idx);
  };

  /**
   * 드래그 종료 핸들러 (마우스 버튼을 뗐을 때)
   *
   * - onMouseUp / onMouseLeave 등에 연결해서
   *   "더 이상 드래그 상태가 아니다"라고 dragInfo를 초기화한다.
   * - 이걸 해줘야 다음 마우스 이동에서 업데이트가 멈춘다.
   */
  const handleMouseUp: MouseEventHandler<HTMLDivElement> = () => {
    setDragInfo(null);
  };

  return {
    startDrag,
    handleMouseMove,
    handleMouseUp,
  };
}
