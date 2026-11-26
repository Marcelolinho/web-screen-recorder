const FILE_NAME = 'recording.webm';

export async function saveVideo(blob: Blob) {
  const directory = await navigator.storage.getDirectory();
  const file = await directory.getFileHandle(FILE_NAME, { create: true });
  const writable = await file.createWritable();
  await writable.write(blob);
  await writable.close();
}

export async function loadVideo() {
  const directory = await navigator.storage.getDirectory();
  const file = await directory.getFileHandle(FILE_NAME);
  return file.getFile();
}
