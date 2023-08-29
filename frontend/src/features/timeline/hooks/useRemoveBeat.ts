import { deleteBeat } from "@/api/beats";
import { useMutation, useQueryClient } from "react-query";
import { Beat } from "@/types";

export default function useRemoveBeat(actId: number) {
  const queryClient = useQueryClient();
  const mutation = useMutation((beat: Beat) => deleteBeat(actId, beat), {
    onMutate: async (beat: Beat) => {
      await queryClient.cancelQueries(["beats", actId]);

      const oldBeats = queryClient.getQueryData(["beats", actId]) as Beat[];
      queryClient.setQueryData<Beat[]>(["beats", actId], (old) => {
        if (old) {
          const beatIndex = old.findIndex((b) => b.id === beat.id);
          if (beatIndex !== -1) {
            old.splice(beatIndex, 1);
          }
        }
        return [...(old || [])];
      });

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
