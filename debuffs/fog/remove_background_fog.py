from PIL import Image

# Define the threshold range for transparency (adjust these values as needed)
threshold_min = 0
threshold_max = 20

# Iterate through each frame
for frame_num in range(60):
    # Open the image
    image_path = f'fog1_frame_{frame_num}.png'
    image = Image.open(image_path)

    # Convert the image to RGBA if it's not already
    image = image.convert('RGBA')

    # Create a transparent RGBA image
    transparent_image = Image.new('RGBA', image.size, (0, 0, 0, 0))
    pixels = image.load()

    # Iterate through each pixel
    for i in range(image.size[0]):
        for j in range(image.size[1]):
            # Check if the pixel value is within the threshold range
            if all(threshold_min <= value <= threshold_max for value in pixels[i, j][:3]):
                # Set the corresponding pixel in the transparent image to be fully transparent
                transparent_image.putpixel((i, j), (0, 0, 0, 0))
            else:
                # Copy the pixel color from the original image to the transparent image
                transparent_image.putpixel((i, j), pixels[i, j])

    # Save the transparent image
    transparent_image_path = f'fog1_frame_{frame_num}.png'
    transparent_image.save(transparent_image_path)

