import re
import os

path = r'd:\HKCampus\constants\courses_sem2.ts'
if not os.path.exists(path):
    print(f"Error: {path} not found")
    exit(1)

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    # Check if this line contains 'department'
    if '"department":' in line:
        # Add instructor before it
        indent = line[:line.find('"')]
        new_lines.append(f'{indent}"instructor": "TBD",\n')
    new_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Successfully added instructor field to course data.")
