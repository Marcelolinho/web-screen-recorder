import {defineContentScript} from "wxt/utils/define-content-script";
import ReactDOM from "react-dom/client";

export default defineContentScript({
  matches: ['*://*.google.com/*'],
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "recording-station",
      position: "inline",
      anchor: "body",
      onMount(container) {
        const root = ReactDOM.createRoot(container);
        root.render(<RecordingStation />);
        return root;
      }
    })
  },
});
