import os

directory = "."  # Change this to the directory containing your files
prefix = "asteroid_frame_"

# Get a list of all files in the directory
files = os.listdir(directory)

# Sort the files to ensure they are in the correct order
files.sort()

# Initialize a counter to start counting from 0
counter = 0

# Loop through the files and rename them
for filename in files:
    if filename.startswith(prefix):
        # Get the extension of the file (e.g., ".png")
        _, extension = os.path.splitext(filename)

        # Generate the new filename
        new_filename = f"{prefix}{counter}{extension}"

        # Build the full paths for the old and new filenames
        old_path = os.path.join(directory, filename)
        new_path = os.path.join(directory, new_filename)

        # Rename the file
        os.rename(old_path, new_path)

        # Increment the counter for the next file
        counter += 1
