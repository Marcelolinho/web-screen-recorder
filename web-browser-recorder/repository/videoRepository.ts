import axios from "axios";
import type {VideoRequest} from "@/interfaces/genericInterfaces.ts";

export async function saveVideo(video: VideoRequest) {
    return await axios.post("/save-video", video);
}