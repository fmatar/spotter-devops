// These are very optomistic helpers. In production they would need to throw errors if used with strings that don't conform to the format.

export function timeStringToFloat(time: string) {
  const minutesSeconds = time.split(/[.:]/);
  const minutes = parseInt(minutesSeconds[0], 10);
  const seconds = minutesSeconds[1] ? parseInt(minutesSeconds[1], 10) : 0;
  return minutes + seconds / 60;
}

export function floatToTimeString(time: number) {
  const minutes = Math.floor(time % 60);
  const seconds = Math.floor((time - minutes) * 60);
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

export function splitRange(range: string) {
  return range.split("-");
}

export function timeRangeToFloats(timeRange: string) {
  const [start, end] = splitRange(timeRange);
  return [timeStringToFloat(start), timeStringToFloat(end)];
}

export function positionToTime(
  totalLength: number,
  position: number,
  timeLength: number,
  startString: string,
) {
  const startOffset = timeStringToFloat(startString);
  const percent = position / totalLength;
  return floatToTimeString(percent * timeLength + startOffset);
}

export function convertPositionToTimeRange(
  position: { total: number; start: number; length: number },
  timeLength: number,
  startString: string,
) {
  const start = positionToTime(
    position.total,
    Math.max(0, position.start),
    timeLength,
    startString,
  );
  const end = positionToTime(
    position.total,
    Math.min(position.start + position.length, position.total),
    timeLength,
    startString,
  );
  return `${start}-${end}`;
}
