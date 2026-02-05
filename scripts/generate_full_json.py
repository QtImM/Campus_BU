import json
import os
import re

# File paths
output_json = r'd:\HKCampus\data\courses_sem2.json'

def get_department(code):
    prefix = re.match(r'^([A-Z. ]+)', code)
    if not prefix: return "General"
    p = prefix.group(1).strip()
    mapping = {
        'ACCT': 'Accountancy', 'ARTT': 'Creative Arts', 'BIOL': 'Biology', 'BMSC': 'Biomedical Sciences',
        'BUSI': 'Business', 'CHEM': 'Chemistry', 'CHIL': 'Chinese Language', 'CMED': 'Chinese Medicine',
        'COMM': 'Communication', 'COMP': 'Computer Science', 'CRIN': 'Creative Industries', 'DIFH': 'Digital Futures',
        'ECON': 'Economics', 'EDUC': 'Education', 'ENGL': 'English', 'EURO': 'European Studies',
        'FAGS': 'Film & Screen', 'FILM': 'Film', 'FINE': 'Finance', 'FREN': 'French',
        'GAME': 'Game Design', 'GCAP': 'General Education', 'GCST': 'Global Studies', 'GEOG': 'Geography',
        'GERM': 'German', 'GEST': 'Green Energy', 'HIST': 'History', 'HRMN': 'Human Resources',
        'HUMN': 'Humanities', 'ISEM': 'Information Systems', 'JOUR': 'Journalism', 'JPSE': 'Japanese',
        'LANG': 'Language', 'LLAW': 'Law', 'MATH': 'Mathematics', 'MKTG': 'Marketing', 'MUSI': 'Music',
        'PCMD': 'Chinese Medicine', 'PERM': 'Physical Education', 'POLS': 'Political Science', 'RELI': 'Religion',
        'REMT': 'Retailing', 'SOCI': 'Sociology', 'SOWK': 'Social Work', 'SPAN': 'Spanish', 'TRAN': 'Translation',
        'VART': 'Visual Arts', 'WRIT': 'Writing', 'CTV': 'Film', 'A.F.': 'Film', 'AIDM': 'Digital Media',
        'ARTD': 'Arts', 'CHI': 'Chinese', 'EDPY': 'Psychology', 'EDUM': 'Education', 'EPHM': 'Environmental Management',
        'FASS': 'Social Sciences', 'HRM': 'Human Resources', 'MCM': 'Chinese Medicine', 'MDD': 'Drug Discovery',
        'MGNT': 'Management', 'MHM': 'Health Management', 'MPS': 'Chinese Medicine', 'MUS': 'Music',
        'SCI': 'Science', 'SCM': 'Chinese Medicine', 'SLM': 'Sport & Leisure', 'SOC': 'Sociology',
        'TRA': 'Translation', 'VACD': 'Creative Design', 'VARP': 'Visual Arts', 'VASA': 'Studio Arts',
        'FIN': 'Finance', 'BUS': 'Business', 'BUS D': 'Business', 'EDUD': 'Education', 'ENG': 'English',
        'PHY': 'Physics', 'REL': 'Religion', 'LSE': 'Liberal Studies'
    }
    return mapping.get(p, f"Department of {p}")

def parse_line(line, category):
    parts = line.split('\t')
    if len(parts) >= 2:
        code = parts[0].strip()
        title = parts[1].strip()
        chinese_title = parts[2].strip() if len(parts) > 2 else ""
        units = parts[3].strip() if len(parts) > 3 else "3"
        units = re.sub(r'[^0-9.]', '', units)
        try: units_val = float(units) if '.' in units else int(units)
        except: units_val = 3
        return {
            "id": f"local_{code}", # Adding local prefix for app compatibility
            "code": code,
            "name": f"{title} {chinese_title}".strip(),
            "instructor": "TBD",
            "department": get_department(code),
            "credits": units_val,
            "category": category,
            "rating": 0,
            "reviewCount": 0
        }
    return None

def main():
    # This is a reconstruction script. I'll add the batches back in.
    # To keep it safe for context, I'll just write the processing logic 
    # and provide the full JSON in the next step or via a combined script.
    print("Script ready for full JSON consolidation.")

if __name__ == "__main__":
    main()
