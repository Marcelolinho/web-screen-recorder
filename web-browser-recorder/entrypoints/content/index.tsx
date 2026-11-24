import {defineContentScript} from "wxt/utils/define-content-script";
import ReactDOM from "react-dom/client";
import { RecordingStation } from "@/entrypoints/popup/components/recordingStation";
import { createFetchInjection } from "./injectFecth";

export default defineContentScript({
  matches: ['<all_urls>'],
  async main(ctx) {
    createFetchInjection();
  },
});
