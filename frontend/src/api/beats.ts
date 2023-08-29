import { Beat } from "@/types";

export async function fetchBeats(actId: number): Promise<Beat[]> {
  const res = await fetch(`http://localhost:8080/acts/${actId}/beats`);
  return res.json();
}

export async function createBeat(actId: number, beat: Beat): Promise<Beat> {
  const res = await fetch(`http://localhost:8080/acts/${actId}/beats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(beat),
  });
  return res.json();
}

export async function deleteBeat(actId: number, beat: Beat): Promise<Beat> {
  const res = await fetch(
    `http://localhost:8080/acts/${actId}/beats/${beat.id}`,
    {
      method: "DELETE",
    },
  );
  return res.json();
}
