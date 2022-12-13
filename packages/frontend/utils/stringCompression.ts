import pako from "pako";
import { decodeb64, encodeb64 } from "./dataConverters";

export const compressToBase64 = (str: string) => encodeb64(pako.deflate(str));

export const decompressFromBase64 = (str: string) => pako.inflate(decodeb64(str), { to: "string" });
