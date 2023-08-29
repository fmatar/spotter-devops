"use client";
import { FC, useState, MouseEvent } from "react";
import styles from "./timeline.module.css";
import useTimeline from "./hooks/useTimeline";
import Beat from "./components/Beat";
import ActLine from "./components/ActLine";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import useAddBeat from "./hooks/useAddBeat";
import { BeatKey, Beat as BeatType } from "@/types";
import ActContext from "./context";
import AddBeatDetailsForm from "./components/AddBeatDetailsForm";

interface Props {
  actId: number;
  title: string;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  boxShadow: 24,
  backgroundColor: "black",
  p: 4,
};

const Timeline: FC<Props> = ({ actId, title }) => {
  const { data, timeRanges, startString, endString, totalLength } =
    useTimeline(actId);
  const addBeatMutation = useAddBeat(actId);
  const [open, setOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<string>("");
  const handleTimeRangeCreate = (timeRange: string) => {
    setOpen(true);
    setTimeRange(timeRange);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const onCreate = (newBeat: BeatType) => {
    addBeatMutation.mutate(newBeat);
    setOpen(false);
  };
  return (
    <ActContext.Provider value={{ actId }}>
      <li className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <ul className={styles.list}>
          {data &&
            data.map((item, index) => {
              return (
                <Beat
                  key={`beat-${item.id}`}
                  beat={item}
                  positionData={timeRanges[item.id]}
                />
              );
            })}
        </ul>
        <ActLine
          totalTime={totalLength}
          startTime={startString}
          onRangeCreate={handleTimeRangeCreate}
        />
        <p className={styles.start}>{startString}</p>
        <p className={styles.end}>{endString}</p>
        <Modal open={open}>
          <Box sx={style}>
            <AddBeatDetailsForm
              onCancel={handleCancel}
              onCreate={onCreate}
              timeRange={timeRange}
            />
          </Box>
        </Modal>
      </li>
    </ActContext.Provider>
  );
};

export default Timeline;
