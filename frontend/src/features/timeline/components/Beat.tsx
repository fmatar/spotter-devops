import { Beat as BeatType } from "@/types";
import { TimeRangeObject } from "../hooks/useTimeline";
import styles from "./Beat.module.css";
import { FC, useContext, useEffect, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useDebounce } from "use-debounce";
import useRemoveBeat from "../hooks/useRemoveBeat";
import ActContext from "../context";

type Props = {
  beat: BeatType;
  positionData: TimeRangeObject;
};

const Beat: FC<Props> = ({ beat, positionData }) => {
  const actContext = useContext(ActContext);
  const removeMutation = useRemoveBeat(actContext.actId);
  const [isActive, setIsActive] = useState(false);
  const [debouncedActive] = useDebounce(isActive, 300, { leading: true });

  const lineSpring = useSpring({
    from: { width: "0%" },
    to: { width: `calc(${positionData.widthPercent}% - 2px)` },
    config: {
      duration: 300,
    },
  });

  const contentSpring = useSpring({
    from: { width: "0%", opacity: 0 },
    to: { width: "100%", opacity: 1 },
    delay: 700,
    config: {
      duration: 300,
    },
  });
  const overLappingOffset = -3 + positionData.overLappingCount * 9;

  const onEnterStyles = useSpring({
    top: debouncedActive ? -245 + overLappingOffset : -225 + overLappingOffset,
    config: {
      duration: 100,
    },
  });

  const onEnter = () => {
    setIsActive(true);
  };
  const onLeave = () => {
    setIsActive(false);
  };
  const onXClick = () => {
    removeMutation.mutate(beat);
  };

  return (
    <animated.li
      className={styles.line}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        left: positionData.normalizedStart * 100 + "%",
        bottom: overLappingOffset,
        zIndex: isActive ? 1 : 0,
        ...lineSpring,
      }}
    >
      <animated.div
        className={styles.content}
        style={{
          maxWidth: "calc(100% - 4px)",
          ...contentSpring,
          ...onEnterStyles,
        }}
      >
        <button className={styles.button} onClick={onXClick}>
          X
        </button>
        <h3 className={styles.header}>{beat.name}</h3>
        <p className={styles.paragraph}>{beat.cameraAngle}</p>
        <p className={styles.paragraph}>{beat.content}</p>
      </animated.div>
    </animated.li>
  );
};

export default Beat;
