import { useEffect, useState } from "react";

interface Breakpoints {
  default: string | number | string[] | number[] | null;
  sm: string | number | string[] | number[];
  md: string | number | string[] | number[];
  gtMd: string | number | string[] | number[];
  lg: string | number | string[] | number[];
  xl: string | number | string[] | number[];
  gtXl: string | number | string[] | number[];
}

type ResponsiveStyle<T> = T extends Breakpoints ? T[keyof T] : never;

export const useResponsiveStyle = <T extends Breakpoints>(
  breakpoints: T,
  width: number,
): ResponsiveStyle<T> => {
  if (!breakpoints) throw new Error("No breakpoints provided");
  const [results, setResults] = useState<ResponsiveStyle<T>>(
    breakpoints.default as ResponsiveStyle<T>,
  );
  useEffect(() => {
    switch (true) {
      case width > 1536:
        setResults(breakpoints.gtXl as ResponsiveStyle<T>);
        break;
      case width > 1280:
        setResults(breakpoints.xl as ResponsiveStyle<T>);
        break;
      case width > 1024:
        setResults(breakpoints.lg as ResponsiveStyle<T>);
        break;
      case width > 768:
        setResults(breakpoints.gtMd as ResponsiveStyle<T>);
        break;
      case width > 430:
        setResults(breakpoints.md as ResponsiveStyle<T>);
        break;
      case width < 425:
        setResults(breakpoints.sm as ResponsiveStyle<T>);
        break;
      default:
        setResults(breakpoints.default as ResponsiveStyle<T>);
    }
  }, [width, breakpoints]);
  return results;
};
