import { FFmpeg } from "@ffmpeg.wasm/main";

async function convertMP4toPNG(videoPath) {
  console.log ('convertMP4toPNG')
  const ffmpeg = await FFmpeg.create({
    core: '@ffmpeg.wasm/core'
  });
  console.log('ffmpeg created');

  // Fetch the video file from the server
  const response = await fetch(videoPath);
  console.log('video fetched');
  const videoArrayBuffer = await response.arrayBuffer();
  console.log('videoArrayBuffer');

  // Write the video file to the virtual file system
  ffmpeg.fs.writeFile('input.mp4', videoArrayBuffer);

  // Run the FFMpeg command to convert the video to PNG frames and save each frame to the virtual file system
  await ffmpeg.run('-i', data, '-vf', 'fps=10', 'output%02d.png');

  // Read the PNG frames from the virtual file system
  const pngDataArray = [];

  for (let i = 0; i < 10; i++) {
    const pngData = await ffmpeg.fs.readFile(`output0${i}.png`);
    pngDataArray.push(pngData);
  }

  // Return the PNG frames to the caller
  console.log('pngDataArray', pngDataArray);
  return pngDataArray;
}

async function getKrakenSprites(tokenId) {
  // Base URL for Kraken video files
  const baseVideoUrlKrakens = 'img.pseudo.trident.game';
  const videoPath = `${baseVideoUrlKrakens}/${tokenId}/anim.mp4`;
  console.log('videoPath', videoPath);

  // Convert MP4 to PNG frames
  const pngDataArray = await convertMP4toPNG(videoPath);

  // Array to store the mask images for each frame
  console.log('loading mask images');
  const maskImages = [
    '../../../assets/Mask/kraken_mask0.png',
    '../../../assets/Mask/kraken_mask1.png',
    '../../../assets/Mask/kraken_mask2.png',
    '../../../assets/Mask/kraken_mask3.png',
    '../../../assets/Mask/kraken_mask4.png',
    '../../../assets/Mask/kraken_mask5.png',
    '../../../assets/Mask/kraken_mask6.png',
    '../../../assets/Mask/kraken_mask7.png',
    '../../../assets/Mask/kraken_mask8.png',
    '../../../assets/Mask/kraken_mask9.png',
  ];

  // Preload mask images
  const maskData = await Promise.all(maskImages.map(loadImage));

  const frames = [];

  // Loop through each PNG frame and apply the mask
  console.log('applying mask images');
  for (let i = 0; i < pngDataArray.length; i++) {
    console.log('applying mask image', i);
    // Create a temporary canvas for processing
    var tempCanvas = document.createElement('canvas');
    var tempCtx = tempCanvas.getContext('2d');

    // Create an Image object from the PNG frame
    const image = new Image();
    image.src = pngDataArray[i];
    
    // Create an ImageBitmap from the ImageData (for Safari compatibility)
    const imageBitmap = await createImageBitmap(image);

    // Draw the Image on the temporary canvas
    tempCanvas.width = frameWidth;
    tempCanvas.height = frameHeight;
    tempCtx.drawImage(imageBitmap, 0, 0);

    // Draw the mask frame on the temporary canvas
    console.log('drawing mask image', i);
    tempCtx.drawImage(maskData[i], 0, 0);

    // Apply the mask image as a clipping mask
    tempCtx.globalCompositeOperation = 'source-in';
    tempCtx.drawImage(imageBitmap, 0, 0);

    // Convert the frame to PNG
    const frameDataUrl = tempCanvas.toDataURL('image/png');
    frames.push(frameDataUrl);
  }

  // Return the processed frames to the caller
  return frames;
}

// Function to load an image asynchronously
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = 'anonymous'; // Enable cross-origin requests if needed
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
}

const frameWidth = 734;
const frameHeight = 734;


export { getKrakenSprites };