// Define the canvas and context for image processing
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Load the MP4 video from the original URL
const baseVideoUrl = 'https://img.pseudo.trident.game';

// Function to process each frame of the video
async function getPlayerSprites(tokenId) {
  const video = document.createElement('video');
  video.src = `${baseVideoUrl}/${tokenId}.mp4`;
  video.crossOrigin = 'anonymous'; // Enable cross-origin requests if needed
  video.preload = 'auto';

  const frameCount = 10; // Number of frames in your animation
  const frames = [];

  // Array to store the mask images for each frame
  const maskImages = [
    'kraken_mask1.png',
    'kraken_mask2.png',
    'kraken_mask3.png',
    'kraken_mask4.png',
    'kraken_mask5.png',
    'kraken_mask6.png',
    'kraken_mask7.png',
    'kraken_mask8.png',
    'kraken_mask9.png',
    'kraken_mask10.png',
  ];

  // Preload mask images (you can skip this step if the masks are already loaded)
  const maskData = await Promise.all(maskImages.map(loadImage));

  for (let i = 0; i < frameCount; i++) {
    video.currentTime = (i / frameCount) * video.duration;
    await new Promise(resolve => video.addEventListener('seeked', resolve));

    // Apply the preloaded mask image to the frame
    const maskImage = maskData[i];
    const frameDataUrl = convertFrameToPNG(video, maskImage);
    frames.push(frameDataUrl);
  }

  // Combine frames into a spritesheet
  const spritesheet = new Spritesheet({
    images: frames,
    width: canvas.width,
    height: canvas.height,
  });

  return new Promise((resolve, reject) => {
    spritesheet.compile((err, data) => {
      if (err) {
        reject(err);
      } else {
        // `data` contains the spritesheet image and data
        resolve(data);
      }
    });
  });
}

// Function to convert a frame to PNG with a clipping mask
function convertFrameToPNG(frame, maskImage) {
  canvas.width = frame.videoWidth;
  canvas.height = frame.videoHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(frame, 0, 0);

  // Apply the clipping mask
  ctx.globalCompositeOperation = 'source-in';
  ctx.drawImage(maskImage, 0, 0);

  // Convert the frame to PNG
  const pngDataUrl = canvas.toDataURL('image/png');
  return pngDataUrl;
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

export default {getPlayerSprites}; // Receives the token ID and returns the spritesheet
