import axios from "axios";

type Cache = { [id: number]: Promise<ArrayBuffer> };
const PROMISES: Cache = {};

export default function useMidiFiles(fileIds: number[]) {
  for (const id of fileIds) {
    if (!PROMISES[id]) {
      PROMISES[id] = axios
        .get<ArrayBuffer>(`file/${id}`, {
          responseType: "arraybuffer",
        })
        .then((r) => r.data);
    }
  }
  return PROMISES;
}
