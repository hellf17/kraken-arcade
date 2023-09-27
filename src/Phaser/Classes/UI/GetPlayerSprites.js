// Load the MP4 video from the original URL
const baseVideoUrlKrakens = 'https://img.pseudo.trident.game';

// Function to get only the first frame of the video of an array of tokens IDs
async function getFirstFrame(tokenId) {
  const video = document.createElement('video');
  video.src = `${baseVideoUrlKrakens}/${tokenId}/anim.mp4`;
  video.crossOrigin = 'anonymous'; // Enable cross-origin requests if needed
  video.preload = 'auto';

  // Wait for the video frames to be ready
  await new Promise(resolve => video.addEventListener('loadeddata', resolve));

  // Create a temporary canvas for processing
  var tempCanvas = document.createElement('canvas');
  var tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = video.videoWidth;
  tempCanvas.height = video.videoHeight;

  // Draw the first frame on the temporary canvas
  tempCtx.drawImage(video, 0, 0);

  // Convert the frame to PNG
  const frameDataUrl = tempCanvas.toDataURL('image/png');

  // Return the processed frame to the caller
  return frameDataUrl;
}

// Function to process each frame of the video
async function getKrakenSprites(tokenId) {
  const video = document.createElement('video');
  video.src = `${baseVideoUrlKrakens}/${tokenId}/anim.mp4`;
  video.crossOrigin = 'anonymous'; // Enable cross-origin requests if needed
  video.preload = 'auto';

  const frameCount = 10; // Number of frames in your animation
  const frames = [];

  // Wait for the video frames to be ready
  await new Promise(resolve => video.addEventListener('loadeddata', resolve));

  // Array to store the mask images for each frame
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

  for (let i = 0; i < frameCount; i++) {
    video.currentTime = (i / frameCount) * video.duration;
    await new Promise(resolve => video.addEventListener('seeked', resolve));

    // Create a temporary canvas for processing
    var tempCanvas = document.createElement('canvas');
    var tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;

    // Draw the mask frame on the temporary canvas
    tempCtx.drawImage(maskData[i], 0, 0);

    // Apply the mask image as a clipping mask
    tempCtx.globalCompositeOperation = 'source-in';
    tempCtx.drawImage(video, 0, 0);

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

  export { getKrakenSprites, getFirstFrame };

  
/*   // Debug: Print the processed frames
  frames.forEach((frame, index) => {
  printDebugFrame(frame, `Frame ${index + 1}`);
  });
  }

  // Function to print debug frames (for frame only)
  function printDebugFrame(frame, frameLabel) {

  // Create an image element to display the debug frame
  const debugImg = document.createElement('img');
  debugImg.src = frame;

  // Add the debug image to the document
  document.body.appendChild(debugImg);
  console.log(`${frameLabel} printed`); 
  }*/