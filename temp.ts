// create image into ffmpeg
ffmpeg.FS("writeFile", `${file?.name}`, await fetchFile(file!));

ffmpeg.FS(
  "writeFile",
  "audio.mp3",
  await fetchFile(`${HOST_URL}/api/audio?url=${url}`)
);

// create a video using the image and audio

// await ffmpeg.run(
//   "-i",
//   `${file?.name}`,
//   "-i",
//   "audio.mp3",
//   "-c:v",
//   "libx264",
//   "-strict",
//   "-2",
//   "-preset",
//   "slow",
//   "-pix_fmt",
//   "-vf",
//   "scale=trunc(iw/2)*2:trunc(ih/2)*2",
//   "-f",
//   "mp4",
//   "output.mp4"
// );

//  ffmpeg -loop 1 -y -i pic.jpg -i sound.amr -shortest video.mp4

await ffmpeg.run(
  "-loop",
  "1",
  "-y",
  "-i",
  `${file?.name}`,
  "-i",
  "audio.mp3",
  "-shortest",
  "output.mp4"
);

// read the output video
const data2 = ffmpeg.FS("readFile", "output.mp4");

// create a URL
const op_url = URL.createObjectURL(
  new Blob([data2.buffer], { type: "video/mp4" })
);

setResult(op_url);
ffmpeg.exit();
