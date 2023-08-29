export type BeatKey = "name" | "time" | "content" | "cameraAngle" | "notes";

export type BeatInput = {
  name: string;
  time: string;
  content: string;
  cameraAngle: string;
  notes: string;
};

export type Beat = {
  id: number;
  name: string;
  time: string;
  content: string;
  cameraAngle: string;
  notes: string;
};

export type Act = {
  id: number;
  name: string;
};
