from web3 import Web3
import json
import requests
import os
from requests.exceptions import HTTPError, RequestException
from moviepy.editor import VideoFileClip
from PIL import Image
import cv2

# Connection with node
w3 = Web3(Web3.HTTPProvider('https://mainnet.infura.io/v3/1d0896d80ef6451b84bf64cd4a13928c'))

# NFT address and ABI
contract_address = '0x6389936FAC235a4FADF660Ca5c428084115579Bb'
with open('kraken_abi.json', 'r') as file:
    contract_abi = json.load(file)

# Loading the address
contract = w3.eth.contract(address=contract_address, abi=contract_abi)

def get_all_token_metadata(user_address, token_id):
    # Convert address to checksum format
    checksum_address = Web3.to_checksum_address(user_address)

    # Get the tokens owned by the user
    owned_tokens = contract.functions.tokensOfOwner(checksum_address).call()

    if token_id not in owned_tokens:
        print(f"The specified token ID '{token_id}' does not belong to the user.")
        return

    else:
        image_base_url = "https://img.pseudo.trident.game/"
        last_five_digits = str(user_address)[-5:]

        try:
            # Construct the image URL
            image_url = f"{image_base_url}{token_id}/anim.mp4"

            # Download the image file
            response = requests.get(image_url)
            response.raise_for_status()  # Check for any request errors

            # Save the image to a file
            mp4_filename = f"kraken_image_{token_id}.mp4"
            with open(mp4_filename, 'wb') as file:
                file.write(response.content)

            # Convert mp4 to png frames using moviepy
            token_dir = f"./{last_five_digits}/kraken_{token_id}"
            os.makedirs(token_dir, exist_ok=True)
            clip = VideoFileClip(mp4_filename)

            for i, frame in enumerate(clip.iter_frames(fps=10)):
                png_filename = f"{token_dir}/kraken_frame_{i}.png"
                frame_image = Image.fromarray(frame)
                frame_image.save(png_filename)

                # Open the image
                image_path = png_filename
                image = cv2.imread(image_path)

                # Open the mask
                mask_path = f'Mask\\kraken_frame_{i}_mask.png'
                mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)

                # Resize the image and mask to the desired shape
                image = cv2.resize(image, (734, 734), interpolation=cv2.INTER_AREA)
                mask = cv2.resize(mask, (734, 734), interpolation=cv2.INTER_AREA)

                # Create a new RGBA image with an alpha channel
                result_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGBA)

                # Iterate over each pixel in the mask
                for h in range(mask.shape[0]):
                    for w in range(mask.shape[1]):
                        # Check if the pixel value is black (background)
                        if mask[h, w] == 0:
                            # Set the alpha channel to 0 (transparent) in the result image
                            result_image[h, w, 3] = 0

                # Convert the image to PIL Image
                result_image = Image.fromarray(result_image)

                # Save the resulting image with transparency
                result_path = f"{token_dir}/kraken_frame_{i}.png"
                result_image.save(result_path)

            # Remove mp4 file
            os.remove(mp4_filename)

        except (RequestException, HTTPError) as e:
            print(f"An error occurred while fetching image for token ID {token_id}: {e}")
