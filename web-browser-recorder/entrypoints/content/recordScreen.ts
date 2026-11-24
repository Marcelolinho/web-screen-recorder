

// function handleAvailableData(event: BlobEvent) {
//     if (event.data.size > 0) {
//         recordedChunks.push(event.data);
//         if (stopped) {
//             save();
//         }
//     }
// }

// function save() {
//     const blob = new Blob(recordedChunks, {
//         type: 'video/webm',
//     });
//     saveVideo(toVideoRequest(name, blob));

// }

// export function recordScreen() {
//     const canvas = document.querySelector('canvas');
//     const stream = canvas?.captureStream(30);

//     const options = { mimeType: "video/webm; codecs=vp9" };

//     const mediaRecorder = new MediaRecorder(stream!, options);

//     mediaRecorder.ondataavailable = handleAvailableData;
//     mediaRecorder.start();
// }