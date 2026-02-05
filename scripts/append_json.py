import json
import os

def append_to_json(file_path, new_courses):
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except:
                data = []
    else:
        data = []
    
    data.extend(new_courses)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Appended {len(new_courses)} courses. Total: {len(data)}")

if __name__ == "__main__":
    # This will be used by subsequent calls
    pass
