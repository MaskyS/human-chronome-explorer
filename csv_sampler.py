import csv
import argparse
from pathlib import Path
import os
import sys
from datetime import datetime

def get_llm_preamble():
    return """INSTRUCTION: This document contains samples of CSV data structures. Each file section starts with "FILE:" followed by the filename. After each filename, you'll find HEADERS: showing column names separated by | characters, then SAMPLE_ROWS: showing actual data rows with values separated by | characters. Each file section ends with META: containing the total number of rows and columns in the original CSV file, followed by ---. Use this structure to understand the data format of each CSV file and the relationships between columns and values. When asked about specific files, look for the relevant FILE: marker and analyze the headers and sample rows that follow it. All numeric values and data types are preserved exactly as they appear in the original files."""

def count_rows(file_path):
    """Count total rows in CSV file (excluding header)"""
    with open(file_path, 'r', newline='') as f:
        return sum(1 for line in csv.reader(f)) - 1  # Subtract 1 for header

def sample_csv_to_text(reader, file_path, max_rows=10, min_rows=2):
    """Helper function to generate LLM-optimized text format sample"""
    headers = next(reader)
    
    # Store sample rows
    rows = []
    for i, row in enumerate(reader):
        if i < max_rows:
            rows.append(row)
        else:
            break
    
    n_rows = min(max(min_rows, min(max_rows, len(rows))), len(rows))
    
    # Get actual total rows from file
    total_rows = count_rows(file_path)
    
    output = []
    output.append("HEADERS:")
    output.append("|".join(headers))
    
    output.append("\nSAMPLE_ROWS:")
    for row in rows[:n_rows]:
        output.append("|".join(str(x).strip() for x in row))
    
    output.append(f"\nMETA: total_rows={total_rows} total_columns={len(headers)}")
    
    return "\n".join(output)

def process_directory(input_dir, output_path, max_rows=10, min_rows=2, format='txt'):
    """Process all CSV files in a directory"""
    input_path = Path(input_dir)
    csv_files = sorted(input_path.glob('*.csv'))
    
    if not csv_files:
        print(f"No CSV files found in {input_dir}")
        return
    
    if format == 'csv':
        # Create output directory if it doesn't exist
        output_dir = Path(output_path)
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Process each file individually
        for csv_file in csv_files:
            output_file = output_dir / f"sample_{csv_file.name}"
            process_single_file(csv_file, output_file, max_rows, min_rows, format)
            
    else:  # txt format
        with open(output_path, 'w') as f:
            f.write(get_llm_preamble() + "\n\n")
            f.write(f"DIRECTORY: {input_dir}\n")
            f.write(f"TIMESTAMP: {datetime.now().strftime('%Y-%m-%d_%H:%M:%S')}\n")
            f.write(f"FILE_COUNT: {len(csv_files)}\n\n")
            
            for csv_file in csv_files:
                f.write(f"FILE: {csv_file.name}\n")
                try:
                    with open(csv_file, 'r', newline='') as csvf:
                        reader = csv.reader(csvf)
                        f.write(sample_csv_to_text(reader, csv_file, max_rows, min_rows))
                except Exception as e:
                    f.write(f"ERROR: {str(e)}")
                f.write("\n---\n")
            
            f.write("\nEND OF FILE LISTING")

def process_single_file(input_file, output_file=None, max_rows=10, min_rows=2, format='txt'):
    """Process a single CSV file"""
    try:
        with open(input_file, 'r', newline='') as f:
            reader = csv.reader(f)
            
            if output_file:
                if format == 'csv':
                    with open(output_file, 'w', newline='') as outf:
                        writer = csv.writer(outf)
                        headers = next(reader)
                        writer.writerow(headers)
                        
                        # Write sample rows
                        for i, row in enumerate(reader):
                            if i < max_rows:
                                writer.writerow(row)
                        
                        # Write footer with actual total rows
                        total_rows = count_rows(input_file)
                        writer.writerow(['...'] * len(headers))
                        summary = [f'[Total rows: {total_rows}, Total columns: {len(headers)}]'] + [''] * (len(headers) - 1)
                        writer.writerow(summary)
                else:  # txt format
                    with open(output_file, 'w') as outf:
                        outf.write(f"FILE: {input_file.name}\n")
                        outf.write(sample_csv_to_text(reader, input_file, max_rows, min_rows))
                print(f"Sampled data saved to: {output_file}")
            else:
                # Print to stdout in txt format
                print(f"\nFILE: {input_file.name}")
                print(sample_csv_to_text(reader, input_file, max_rows, min_rows))
                
    except Exception as e:
        print(f"Error processing {input_file}: {str(e)}", file=sys.stderr)

def main():
    parser = argparse.ArgumentParser(description='Create CSV samples from file(s)')
    parser.add_argument('input_path', help='Input CSV file or directory')
    parser.add_argument('--output', '-o', help='Output file/directory path (optional)')
    parser.add_argument('--max-rows', '-m', type=int, default=10,
                        help='Maximum number of rows to extract (default: 10)')
    parser.add_argument('--min-rows', '-n', type=int, default=2,
                        help='Minimum number of rows to extract (default: 2)')
    parser.add_argument('--format', '-f', choices=['txt', 'csv'], default='txt',
                        help='Output format (default: txt)')
    
    args = parser.parse_args()
    input_path = Path(args.input_path)
    
    if not input_path.exists():
        print(f"Error: '{args.input_path}' does not exist")
        return
    
    # Set default output path if none provided
    if not args.output:
        if input_path.is_dir():
            args.output = 'compiled_samples.txt' if args.format == 'txt' else 'sampled_csvs'
        else:
            # For single file with no output specified, use stdout
            process_single_file(input_path, None, args.max_rows, args.min_rows, args.format)
            return
    
    # Process based on input type
    if input_path.is_dir():
        process_directory(input_path, args.output, args.max_rows, args.min_rows, args.format)
    else:
        process_single_file(input_path, args.output, args.max_rows, args.min_rows, args.format)

if __name__ == "__main__":
    main()