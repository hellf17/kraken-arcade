import os
import shutil
import openpyxl

# Path to your Windows folder
windows_folder = r"C:\Windows"

# Path to the destination folder on the desktop
desktop_folder = os.path.join(os.path.join(os.environ["USERPROFILE"]), "Desktop", "DLLs")

# Create the destination folder if it doesn't exist
if not os.path.exists(desktop_folder):
    os.makedirs(desktop_folder)


# Function to search for DLLs and copy them to the destination folder
def copy_dlls(source_dir, target_dir, dll_list):
    for root, _, files in os.walk(source_dir):
        for file in files:
            if file.upper() in dll_list:
                source_path = os.path.join(root, file)
                target_path = os.path.join(target_dir, file)
                shutil.copy2(source_path, target_path)
                print(f"Copied {file} to {target_path}")


# Read DLL names from the Excel file
def read_dlls_from_excel(file_path):
    dll_list = []
    workbook = openpyxl.load_workbook(file_path)
    sheet = workbook.active
    for row in sheet.iter_rows(values_only=True):
        dll_name = str(row[0]).strip()  # Assuming the DLL names are in the first column (index 0)
        if dll_name:
            dll_list.append(dll_name.upper())  # Convert to uppercase for case-insensitive comparison
    return dll_list


# Path to your Excel file containing the list of DLLs (one per line)
dlls_excel_file = "dlls.xlsx"

# Call the function to read DLLs from the Excel file
dll_list = read_dlls_from_excel(dlls_excel_file)

# Call the function to copy DLLs from the Windows folder to the desktop folder
copy_dlls(windows_folder, desktop_folder, dll_list)
