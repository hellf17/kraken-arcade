from PIL import Image

# Define the color range for yellow-orange-red (RGB values)
lower_color = (200, 200, 100)  # (R, G, B)
upper_color = (250, 250, 250)  # (R, G, B)

# Iterate through each frame
for frame_num in range(10):
    # Open the image
    image_path = f'asteroid_frame_{frame_num}.png'
    image = Image.open(image_path)

    # Convert the image to RGBA if it's not already
    image = image.convert('RGBA')

    # Create a transparent RGBA image
    transparent_image = Image.new('RGBA', image.size, (0, 0, 0, 0))
    pixels = image.load()

    # Iterate through each pixel
    for i in range(image.size[0]):
        for j in range(image.size[1]):
            # Get the pixel color
            pixel_color = pixels[i, j][:3]  # Ignore the alpha channel (RGBA)

            # Check if the pixel color is within the specified range
            if lower_color[0] <= pixel_color[0] <= upper_color[0] and \
                    lower_color[1] <= pixel_color[1] <= upper_color[1] and \
                    lower_color[2] <= pixel_color[2] <= upper_color[2]:
                # Set the corresponding pixel in the transparent image
                transparent_image.putpixel((i, j), pixels[i, j])
            else:
                # Set the pixel to be fully transparent
                transparent_image.putpixel((i, j), (0, 0, 0, 0))

    # Save the transparent image
    transparent_image_path = f'asteroid_frame_{frame_num}_test.png'
    transparent_image.save(transparent_image_path)