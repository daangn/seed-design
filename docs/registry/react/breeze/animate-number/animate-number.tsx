"use client";

import { AnimatePresence, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";
import * as React from "react";
import styles from "./animate-number.module.css";

// 상수로 정의하여 매번 재생성 방지
const DIGIT_NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const SPRING_CONFIG = { stiffness: 300, damping: 30 } as const;
const ANIMATION_CONFIG = { duration: 0.3, ease: "easeInOut" } as const;

interface DigitProps {
  place: number;
  value: number;
  height: number;
}

// 개별 숫자 컴포넌트
const SingleNumber = React.memo(
  ({
    animatedValue,
    number,
    height,
  }: {
    animatedValue: ReturnType<typeof useSpring>;
    number: number;
    height: number;
  }) => {
    const y = useTransform(animatedValue, (latest: number) => {
      const placeValue = latest % 10;
      const offset = (10 + number - placeValue) % 10;
      let yPosition = offset * height;
      if (offset > 5) {
        yPosition -= 10 * height;
      }
      return yPosition;
    });

    return (
      <m.span
        className={styles.number}
        style={{
          y,
          height: `${height}px`,
          lineHeight: `${height}px`,
        }}
      >
        {number}
      </m.span>
    );
  },
);

// 최적화된 Digit 컴포넌트
const Digit = React.memo(({ place, value, height }: DigitProps) => {
  const absValue = Math.abs(value);
  const digitValue = Math.floor(absValue / place) % 10;
  const animatedValue = useSpring(digitValue, SPRING_CONFIG);

  React.useEffect(() => {
    animatedValue.set(digitValue);
  }, [animatedValue, digitValue]);

  return (
    <m.div
      className={styles.digit}
      style={{ height: `${height}px` }}
      layout
      initial={{ width: 0, opacity: 0, x: -20, scale: 0.8 }}
      animate={{ width: "1ch", opacity: 1, x: 0, scale: 1 }}
      exit={{ width: 0, opacity: 0, x: -20, scale: 0.8 }}
      transition={ANIMATION_CONFIG}
      aria-hidden="true"
    >
      {DIGIT_NUMBERS.map((num) => (
        <SingleNumber
          key={`${place}-${num}`}
          animatedValue={animatedValue}
          number={num}
          height={height}
        />
      ))}
    </m.div>
  );
});

export interface AnimateNumberProps {
  /**
   * 표시할 숫자 값
   */
  value: number;

  /**
   * 폰트 크기
   * @default 48
   */
  fontSize?: number | string;

  /**
   * 폰트 굵기
   * @default "bold"
   */
  fontWeight?: React.CSSProperties["fontWeight"];

  /**
   * 텍스트 색상
   * @default "currentColor"
   */
  color?: string;

  /**
   * 천 단위 구분 쉼표 표시
   * @default false
   */
  showComma?: boolean;

  /**
   * 위아래 그라디언트 마스크 표시
   * @default false
   */
  showGradient?: boolean;

  /**
   * 그라디언트 마스크 높이 (px)
   * @default 20
   */
  gradientHeight?: number;

  /**
   * 컨테이너 스타일
   */
  containerStyle?: React.CSSProperties;

  /**
   * 추가 클래스명
   */
  className?: string;
}

export default function AnimateNumber({
  value,
  fontSize = 48,
  fontWeight = "bold",
  color = "currentColor",
  showComma = false,
  showGradient = false,
  gradientHeight = 20,
  containerStyle,
  className,
}: AnimateNumberProps) {
  // fontSize를 픽셀로 변환
  const fontSizeNumber = React.useMemo(() => {
    if (typeof fontSize === "number") return fontSize;

    const match = fontSize.match(/(\d+(?:\.\d+)?)/);
    if (!match) return 48;

    const num = Number.parseFloat(match[1]);
    if (fontSize.includes("rem")) {
      return num * 16; // 기본 16px 기준
    }
    return num;
  }, [fontSize]);

  const height = fontSizeNumber * 1.2;

  // 실제로 표시할 자리수 계산(상위 자리부터 1까지)
  const displayPlaces = React.useMemo(() => {
    const abs = Math.abs(value);
    if (!Number.isFinite(abs) || abs === 0) return [1];
    const places: number[] = [];
    let p = 1;
    while (p <= abs) p *= 10;
    for (p = Math.floor(p / 10); p >= 1; p = Math.floor(p / 10)) {
      places.push(p);
    }
    return places;
  }, [value]);

  // 마스크 스타일
  const maskStyle: React.CSSProperties = showGradient
    ? {
        maskImage: `linear-gradient(to bottom, transparent 0px, black ${gradientHeight}px, black calc(100% - ${gradientHeight}px), transparent 100%)`,
        WebkitMaskImage: `linear-gradient(to bottom, transparent 0px, black ${gradientHeight}px, black calc(100% - ${gradientHeight}px), transparent 100%)`,
      }
    : {};

  return (
    <div className={`${styles.container} ${className || ""}`} style={containerStyle}>
      <div
        className={styles.counter}
        style={{
          fontSize,
          fontWeight,
          color,
          ...maskStyle,
        }}
      >
        <AnimatePresence mode="popLayout">
          {value < 0 && (
            <m.span
              key="minus"
              className={styles.minus}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              aria-hidden="true"
            >
              -
            </m.span>
          )}
          {displayPlaces.map((place, index) => {
            const showCommaAfter =
              showComma &&
              displayPlaces.length > 1 &&
              index < displayPlaces.length - 1 &&
              (displayPlaces.length - index - 1) % 3 === 0;

            return [
              <Digit key={`digit-${place}`} place={place} value={value} height={height} />,
              showCommaAfter && (
                <m.span
                  key={`comma-${place}`}
                  className={styles.comma}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                >
                  ,
                </m.span>
              ),
            ].filter(Boolean);
          })}
        </AnimatePresence>
        {/* Live region for screen readers */}
        <output
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: "absolute",
            left: "-10000px",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
        >
          {showComma ? value.toLocaleString() : value.toString()}
        </output>
      </div>
    </div>
  );
}
