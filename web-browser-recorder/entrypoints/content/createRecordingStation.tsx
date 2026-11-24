// const ui = await createShadowRootUi(ctx, {
//       name: "recording-station",
//       position: "inline",
//       anchor: "body",
//       onMount(container) {
//         const root = ReactDOM.createRoot(container);

//         root.render(<RecordingStation />);

//         return root;
//       },
//       onRemove(root) {
//         root?.unmount();
//       }
//     });
//     ui.mount();