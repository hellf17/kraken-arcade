import pandas as pd


def format_dlls(input_file, output_file):
    try:
        # Read the input XLSX file into a DataFrame
        df = pd.read_excel(input_file, header=None)

        # Filter out any rows with missing values and format the DLL names
        df[0] = df[0].apply(lambda dll: f"('{dll}',  '.')," if pd.notna(dll) else '')

        # Save the modified DataFrame to the output XLSX file
        df.to_excel(output_file, header=False, index=False)
        print(f"File '{input_file}' successfully formatted and saved as '{output_file}'.")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    input_filename = "dlls.xlsx"
    output_filename = "output.xlsx"
    format_dlls(input_filename, output_filename)