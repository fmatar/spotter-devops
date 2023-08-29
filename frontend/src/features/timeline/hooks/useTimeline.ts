import { fetchBeats } from "@/api/beats";
import { Beat } from "@/types";
import { splitRange, timeRangeToFloats } from "@/util/time";
import { useState } from "react";
import { useQuery } from "react-query";
import { useImmer } from "use-immer";

export type TimeRangeObject = {
  id: number;
  normalizedStart: number;
  normalizedEnd: number;
  widthPercent: number;
  overLappingCount: number;
};

export default function useTimeline(actId: number) {
  const [timeRanges, setTimeRanges] = useImmer<TimeRangeObject[]>([]);
  const [startString, setStartString] = useState("");
  const [endString, setEndString] = useState("");
  const [totalLength, setTotalLength] = useState(0);
  const { isLoading, isError, error, data, isFetching } = useQuery(
    ["beats", actId],
    (val) => fetchBeats(val.queryKey[1] as number),
    {
      onSuccess(data: Beat[]) {
        const sortedData = data.sort((a, b) => {
          const [_as, ae] = timeRangeToFloats(a.time);
          const [_bs, be] = timeRangeToFloats(b.time);
          return ae - be;
        });
        const [beginningOfAct] = timeRangeToFloats(sortedData[0].time);
        const [_, endOfAct] = timeRangeToFloats(
          sortedData[data.length - 1].time,
        );
        const length = endOfAct - beginningOfAct;

        setTotalLength(length);
        setStartString(splitRange(sortedData[0].time)[0]);
        setEndString(splitRange(sortedData[data.length - 1].time)[1]);

        setTimeRanges((draft) => {
          let previousEnd: number | undefined;
          let previousOverLappingCount = 0;
          sortedData.forEach((beat) => {
            const [start, end] = timeRangeToFloats(beat.time);
            const [normalizedStart, normalizedEnd] = [
              (start - beginningOfAct) / length,
              (end - beginningOfAct) / length,
            ];
            const widthPercent = Math.floor(
              (normalizedEnd - normalizedStart) * 100,
            );
            if (previousEnd !== undefined && start < previousEnd) {
              previousOverLappingCount += 1;
            } else {
              previousOverLappingCount = 0;
            }
            const timeRange: TimeRangeObject = {
              id: beat.id,
              normalizedStart,
              normalizedEnd,
              widthPercent,
              overLappingCount: previousOverLappingCount,
            };
            draft[beat.id] = timeRange;
            previousEnd = end;
          });
        });
      },
    },
  );

  return {
    isLoading,
    isError,
    error,
    isFetching,
    data,
    timeRanges,
    startString,
    endString,
    totalLength,
  };
}
