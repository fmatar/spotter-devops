import { createBeat } from "@/api/beats";
import { useMutation, useQueryClient } from "react-query";
import { Beat } from "@/types";

export default function useAddBeat(actId: number) {
  const queryClient = useQueryClient();
  const mutation = useMutation((beat: Beat) => createBeat(actId, beat), {
    onMutate: async (beat: Beat) => {
      await queryClient.cancelQueries(["beats", actId]);

      const oldBeats = queryClient.getQueryData(["beats", actId]) as Beat[];
      queryClient.setQueryData<Beat[]>(["beats", actId], (old) => [
        ...(old || []),
        { ...beat, id: Math.floor(Math.random() * 10000) },
      ]); // generate random id for new beat

      return {
        oldBeats,
      };
    },
    onError: (_err, _beat, context) => {
      queryClient.setQueryData(["beats", actId], context!.oldBeats);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["beats", actId]);
    },
  });

  return mutation;
}
