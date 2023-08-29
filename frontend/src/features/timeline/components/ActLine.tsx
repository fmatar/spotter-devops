import {
  FC,
  MouseEvent as RMouseEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import styles from "./ActLine.module.css";
import { convertPositionToTimeRange, positionToTime } from "@/util/time";

const STARTING_BUTTON_WIDTH = 32;

type Props = {
  totalTime: number;
  startTime: string;
  onRangeCreate: (timeRange: string) => void;
};

type StyleObject = {
  width: number;
  left: number;
};

const createStyleOnMove = (
  styles: StyleObject,
  rect: DOMRect,
  clientX: number,
): StyleObject => {
  const x = clientX - rect.left;
  const maxWidth = rect.width - styles.left;
  if (x > styles.left) {
    return {
      ...styles,
      width: Math.min(
        Math.max(x - styles.left, STARTING_BUTTON_WIDTH),
        maxWidth,
      ),
    };
  } else {
    return {
      ...styles,
      width: STARTING_BUTTON_WIDTH,
    };
  }
};

const ActLine: FC<Props> = ({ totalTime, startTime, onRangeCreate }) => {
  const [buttonStyle, setButtonStyle] = useState<StyleObject>({
    width: STARTING_BUTTON_WIDTH,
    left: 0,
  });
  const [isPositionMode, setIsPositionMode] = useState<boolean>(true);
  const [slidingTime, setSlidingTime] = useState<string>("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Why this doesnt use useCallback
  // Usecallback works by continually refreshing the callback function, this doesn't fix the binding issue created by these event handlers
  // This can be fixed a variety of ways: by binding in unbinding in useEffect, by using a ref instead of state
  // Since in the ui i've designed the left value stays fixed after mouse down, I felt the simples way was just to recalculate the width in both handlers

  const bodyMoveListener = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      return setButtonStyle(createStyleOnMove(buttonStyle, rect, e.clientX));
    }
    document.removeEventListener("mouseup", bodyMouseUp);
    document.addEventListener("mouseup", bodyMouseUp);
  };

  const bodyMouseUp = (e: MouseEvent) => {
    document.removeEventListener("mousemove", bodyMoveListener);
    document.removeEventListener("mouseup", bodyMouseUp);
    setIsPositionMode(true);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newStyle = createStyleOnMove(buttonStyle, rect, e.clientX);
      const newRange = convertPositionToTimeRange(
        {
          total: rect.width,
          start: newStyle.left + 16,
          length: newStyle.width + 16,
        },
        totalTime,
        startTime,
      );
      onRangeCreate(newRange);
    }
    setButtonStyle({ ...buttonStyle, width: STARTING_BUTTON_WIDTH });
  };

  const onMouseMove = (e: RMouseEvent<HTMLDivElement>) => {
    if (isPositionMode && containerRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.min(
        Math.max(e.clientX - rect.left - 16, 0),
        containerRef.current.offsetWidth - 16,
      ); // 16 is the button radius
      setSlidingTime(
        positionToTime(
          rect.width,
          Math.max(Math.min(x, rect.width), 0),
          totalTime,
          startTime,
        ),
      );
      setButtonStyle({
        ...buttonStyle,
        left: x,
      });
    }
  };

  const onMouseDown = (e: RMouseEvent<HTMLDivElement>) => {
    setIsPositionMode(false);
    document.addEventListener("mousemove", bodyMoveListener);
    document.addEventListener("mouseup", bodyMouseUp);
  };

  return (
    <div
      className={styles.lineContainer}
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
    >
      <div className={styles.line}>
        <div className={styles.addButton} style={buttonStyle}>
          +
          <div
            className={styles.slidingTime}
            style={{ visibility: isPositionMode ? "visible" : "hidden" }}
          >
            {slidingTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActLine;
