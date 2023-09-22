import { ffmpeg } from "ffmpeg.js";
import { opencv4nodejs } from "opencv4nodejs";
import { getOwnedKrakens, getOwnedMortis } from "./Web3Connection";

// Get the user selected kraken and mortis images
async function getPlayerImages () {
  const imageBaseUrl = 'https://img.pseudo.trident.game/';
  const selectedKraken = getOwnedKrakens();
  const selectedMorti = getOwnedMortis();
  const mp4Url = '${imageBaseUrl}${tokenID}/anim.mp4';

  // Define the output folder for individual PNG frames
  const outputFolder = 'playerFrames';
  
  // Use the fetch API to download the MP4 video
  fetch(mp4Url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.arrayBuffer();
    })
    .then((data) => {
      // Decode the MP4 video using FFmpeg.js
      const result = ffmpeg({
        MEMFS: [{ name: 'input.mp4', data }],
        arguments: ['-i', 'input.mp4', '-vf', 'fps=10', '-f', 'image2', `${outputFolder}/frame%03d.png`],
        stdin: null,
      });
  
      const { MEMFS, err } = result;
      if (err) {
        console.error("Error:", err);
        return;
      }
  
      // MEMFS contains the output PNG frames
      const frames = [];
      for (const file of MEMFS) {
        if (file.name.startsWith(outputFolder)) {
          // Load the PNG frame using OpenCV
          const frame = cv.imread(file.name, cv.IMREAD_UNCHANGED);
          frames.push(frame);
        }
      }

      // Assuming all frames have the same dimensions, use the dimensions of the first frame
      const frameWidth = frames[0].cols;
      const frameHeight = frames[0].rows;
  
      // Create a sprite sheet by arranging frames in a grid
      const numFramesPerRow = Math.ceil(Math.sqrt(frames.length));
      const spriteSheetWidth = numFramesPerRow * frameWidth;
      const spriteSheetHeight = Math.ceil(frames.length / numFramesPerRow) * frameHeight;
      const spriteSheet = new cv.Mat(spriteSheetHeight, spriteSheetWidth, cv.CV_8UC4, [0, 0, 0, 0]);
  
      for (let i = 0; i < frames.length; i++) {
        const row = Math.floor(i / numFramesPerRow);
        const col = i % numFramesPerRow;
        const roi = spriteSheet.getRegion(new cv.Rect(col * frameWidth, row * frameHeight, frameWidth, frameHeight));
  
        // Load the mask for this frame
        const maskPath = `Mask/kraken_frame_${i}_mask.png`;
        const mask = cv.imread(maskPath, cv.IMREAD_GRAYSCALE);
  
        // Resize the mask to match the frame dimensions
        const resizedMask = mask.resize(frameWidth, frameHeight, cv.INTER_AREA);
  
        // Apply the mask to the frame
        const maskedFrame = frames[i].copyTo(new cv.Mat(), resizedMask);
  
        maskedFrame.copyTo(roi);
      }
  
      // Save the resulting sprite sheet image
      const spriteSheetPath = '${type}${tokenID}spritesheet.png'; // set the spritesheet path
      cv.imwrite(spriteSheetPath, spriteSheet);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }
