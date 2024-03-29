from PIL import Image

# Extract frames from the gif
frames = Image.open('tsunami.gif')
frame_list = []

for i in range(frames.n_frames):
    frames.seek(i)
    png_filename = f"tsunami_frame_{i}.png"
    frames.save(png_filename)
    frame_list.append(png_filename)