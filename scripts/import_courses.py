import json
import os
import re

# File paths
output_json = r'd:\HKCampus\data\courses_sem2.json'
output_sql = r'd:\HKCampus\data\courses_sem2.sql'

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
            "code": code,
            "name": f"{title} {chinese_title}".strip(),
            "instructor": "TBD",
            "department": get_department(code),
            "credits": units_val,
            "category": category
        }
    return None

raw_data = """CTV 7040	Film Production II		3
CTV 7070	Media Management		3
CTV 7082	MFA Thesis Project II		6
CTV 7100	Script Writing		3
CTV 7120	Creativity Workshop		3
CTV 7130	Comedy: Theory and Practice		3
CTV 7160	Documentary Film Production		3
CTV 7170	Advanced Dramatic Film/TV Production		3
CTV 7240	Film Theory and Criticism		3
CTV 7370	Cinematography for Directors		3
CTV 7410	Digital Media Production		3
CTV 7440	Television Drama Writing		3
CTV 7500	Film and Literature		3
ECON7025	Business Economics Internship		3
ECON7035	Artificial Intelligence for Business		3
ECON7055	Projects for Data Analytics		3
ECON7065	Global Sustainable Investing & ESG Integration in Asia Pacific		3
ECON7085	Cloud Computing for Business Analytics		3
ECON7095	Topics of ESG and Sustainability in Economics and Finance		3
ECON7130	Principles and Applications of Sustainable Finance and Investment		3
ECON7135	Data Solutions to Social Problems		3
ECON7145	Environmental Cost and Benefit Analysis		3
ECON7155	Economic and Financial Management in Family Office		3
ECON7250	Financial Economics		3
ECON7290	Database Management with AI		3
ECON7350	Corporate Finance and Governance in China		3
ECON7850	Economics of Digital Markets		3
ECON7910	Data Visualization with Story-telling		3
ECON7930	Analytics for Spatial, Textual and Social Network Data		3
ECON7940	Data-driven Decision Making		3
ECON7950	Business and Economic Forecasting with Big Data		3
ECON7960	User Experience and A/B Testing		3
ECON7970	Applied Predictive Modeling		3
ECON7990	Data Analytics for Smart Cities		3
GEOG7520	Urban & Regional Development of China		3
GEOG7540	Sustainable Energy & Technological Innovation in China		3
GEOG7620	Geospatial Analytics, AI and Big Data for Smart, Resilient and Sustainable Cities		3
GEOG7640	Geopolitics in Smart, Resilient and Sustainable Cities		3
GEOG7650	The Built Environment, Transport Choice and Wellbeing		3
LSE 7040	Values&Socio-Cultural Issues in HK Today		3
LSE 7060	Globalization: Cultural & Ethical Issues		3
LSE 7111	Dissertation		3
LSE 7130	Social Justice		3
LSE 7150	Human Rights in a Multicultural World		3
MATH7720	Investment Management		4
MATH7760	Programming for Finance and Trading		4
MKTG7180	Seminars in Contemporary Marketing Issues in Creative Economies		3
MKTG7190	Creative Service-Learning Project		3
MKTG7200	Field Trip		3
MKTG7210	Services Marketing Management		3
PHYS7330	Renewable Energy Technologies II		3
PHYS7371	Project in Green Technology		3
PHYS7420	Energy Usage, the Environment and Sustainability		3
PHYS7460	Advances in Displays and Lighting		3
PHYS7550	Smart Grids and Sustainable Power Systems		3
VACC7020	Visual Arts Theory and Criticism		3
VACC7040	Arts & the Public: Interpretation & Presentation		3
A.F.7410	Financial Management for Film, Television & New Media		3
A.F.7420	Promotion, Advertising & Distribution for Film, Television & New Media		3
A.F.7430	Law, and Film, Television & New Media		3
A.F.7460	Overview of New Media Contents & Its Future: Internet Movie, Drama Series & Short Video		3
A.F.7540	The Art & Practice of Digital Media		3
A.F.7580	Graduate Seminar on a Director's Palette		3
A.F.7590	Digital Multimedia Communication		3
A.F.7610	Film Festival and Film Programme Curation		3
A.F.7620	Future Filmmaking and Technologies		3
ACCT7060	Accounting for Managers		3
AIDM7010	Media Psychology		3
AIDM7020	AI and Big Data Applications in Financial Market Analytics		3
AIDM7040	Generative AI for Digital Media		3
AIDM7340	AI for Digital Media		3
AIDM7350	AI and Digital Media Workshop		3
AIDM7380	Recommender Systems for Digital Media		3
AIDM7400	Data Analysis and Visualization Studio		3
AIDM7410	Computational Journalism		3
AIDM7420	News and Feature Writing for Digital Media		3
AIDM7460	Digital Media Research Project		3
AIDM7480	Selected Topics in Psychology of Social Media		3
AIDM7860	Human-Computer Interaction and User Experience		3
AIDM7880	AI for Social Good: Laws, Ethics, and Methods		3
ARTD7020	RPG Critical Theory Seminar in the Arts and Humanities		3
BIOL7130	Neurobiology		3
BIOL7150	Developmental Biology		3
BIOL7160	RPg Seminars and Special Topics		1
BIOL7190	Sustainable Urban Environment		3
BIOL7200	Advanced Topics in Cell and Molecular Biology		3
BIOL7210	Advanced Plant Molecular Biology		3
BUS 7020	Strategic Executive Development		3
BUS 7470	Business Field Study		3
BUS 7762	Research Seminar		0.5
BUS 7772	Research Seminar		0.5
BUS 7782	Research Seminar		0.5
BUS 7792	Research Seminar		0.5
BUSD7021	MScBM Capstone Project I		1
BUSD7022	MScBM Capstone Project II		2
CHEM7220	Chemical Instrumentation		2
CHEM7250	Laboratory Management		2
CHEM7332	Dissertation		3
CHEM7350	Sample Pretreatment Methods		1
CHEM7402	Seminars		0.5
CHEM7404	Seminars		0.5
CHEM7412	Advanced Analytical Laboratory		2
CHEM7440	Biomedical Analysis		1
CHEM7745	Research Postgraduate Seminars		1
CHEM7790	Organic Synthesis		3
CHEM7860	Advanced Instrumental Analysis		3
CHEM7880	Spectroscopic Techniques for Structure Determination		3
CHEM7990	Separation Science		2
CHI 7012	Research Method & Seminar	研究方法及研討會	3
CHI 7020	Selected Masterpieces of Chinese Literature	中國文學名著研究 - 牡丹亭	3
CHI 7260	Special Topics in Modern&Contemp Chi Lit	中國現當代文學專題研究 - 香港文學	3
CHI 7340	Special Topics in Chinese Language	中國語文專題研究 - 隱喻理論	3
CHI 7390	Project Report	研究報告	3
CHI 7530	Masterpieces in Chinese Historiography (Thought and Culture)	中國史學名篇(思想文化) - 左傳與史記	3
CHI 7690	Special Topic in Chinese Literature and Culture (Classical Literature)	中國文學與文化專題 - 飲食文學與文化	3
COMD7040	Proseminar		0.5
COMD7090	Advanced Qualitative Communication Research Methods		3
COMD7100	Advanced Quantitative Communication Research Methods		3
COMD7140	Gender and Sexuality in the Media		3
COMD7220	Freedom of Expression and Censorship		3
COMD7250	China in the Global Media Sphere		3
COMD7270	AI and Machine Learning for Media and Communication Research		3
COMM7050	Media & Comm in Chinese Societies		3
COMM7060	Issues in Corporate Communication		3
COMM7130	Globalization of Media & Communications		3
COMM7160	Organizational Communication		3
COMM7170	Communication Campaign Workshop		3
COMM7190	Issues and Cases in Mass Communication		3
COMM7210	Project		3
COMM7250	Strategic Public Relations & Crisis Mgnt		3
COMM7290	Professional Application Project		3
COMM7300	Consumer Insights		3
COMM7310	International Advertising		3
COMM7320	AI Imaginaries and Communication Research		3
COMM7560	Political Communication & Public Opinion		3
COMM7580	Social Media Marketing		3
COMM7610	Social Services Marketing and Communication		3
COMM7620	Social Media and Online Social Networks		3
COMM7630	Qualitative Research Methods		3
COMM7640	Introduction to the Chinese Internet		3
COMM7770	Data Visualization		3
COMM7780	Big Data Analytics for Media and Communication		3
COMM7790	Communication and Technology		3
COMM7810	Branding		3
COMM7830	Media Communications and Psychology		3
COMM7900	Media Convergence: Theory and Practice		3
COMM7910	Health Communication		3
COMM7940	Interactive Media Studies Workshop		3
COMM7950	Interactive Media Economy		3
COMM7960	AI for Interactive Media Design		3
COMP7040	Advanced Topics in Computer Vision and Pattern Recognition		3
COMP7045	Natural Language Processing and Large Language Models		3
COMP7055	Computer Vision		3
COMP7065	Innovative Laboratory		3
COMP7080	Postgraduate Seminar		1
COMP7095	Big Data Management		3
COMP7115	Digital Experience Design		3
COMP7125	Prompt Engineering for Generative AI		3
COMP7170	Data Security and Privacy		3
COMP7200	Blockchain and Cryptocurrencies		3
COMP7240	Recommender Systems		3
COMP7250	Machine Learning		3
COMP7270	Web and Mobile Programming		3
COMP7280	MSc Practicum		3
COMP7300	Financial Technology		3
COMP7530	IT Forum		1
COMP7540	IT Management: Principles & Practice		3
COMP7640	Database Systems & Administration		3
COMP7650	Data Mining & Knowledge Discovery		3
COMP7730	MSc Project		3
COMP7780	Special Topics in Knowledge & Info Mgnt		3
COMP7800	Analytic Models in IT Management		3
COMP7810	Business Intelligence		3
COMP7850	Information Security Management		3
COMP7870	IT Innovation Management and Entrepreneurship		3
COMP7880	E-Business Strategies		3
COMP7930	Big Data Analytics		3
COMP7940	Cloud Computing		3
COMP7960	MSc Research I		3
COMP7970	MSc Research II		3
COMP7980	Dynamic Web and Mobile Programming		3
ECON7115	Structural Models and Numerical Methods in Economics		3
ECON7125	Text as Data		3
ECON7540	Graduate Workshops on China's Economy		3
ECON7550	Financial Markets and Corporate Governance in China		3
EDPY7050	Social Psychology		3
EDPY7060	Cognitive Psychology and Applications		3
EDPY7070	Historical and Contemporary Issues in Psychology		3
EDUC7110	Psychology of Adolescence		2
EDUC7230	Advanced Communication Skills		2
EDUC7550	Prob Behaviors in Children & Adolescents		3
EDUC7610	Data Analysis for Education		3
EDUC7621	Dissertation		3
EDUC7622	Dissertation		3
EDUC7670	Lexis, Morphology and Semantics		3
EDUC7700	Psy&Sociolinguistics in EngLang Teaching		3
EDUC7710	Literature and Language Arts		3
EDUC7800	Athletics and Swimming in Schools		3
EDUC7810	Dances & Gymnastics in Schools		3
EDUC7870	Self & Personal Development		3
EDUC7880	Globalization Studies		3
EDUC7930	Supervised Teaching Practice Assessment		4
EDUD7184	Doctor of Education Thesis IV		10.5
EDUM7310	Introduction to Theories of Curriculum & Assessment		3
EDUM7530	Assessment and Curricular Adaptation for Inclusive Education Settings		3
EDUM7550	Educational Psychology		3
ENG 7340	World Literatures in Modern Times		3
ENG 7360	The Ecocritical Imagination		3
ENG 7390	Advanced Topic in Literary and Comparative Studies - Hong Kong Literature in English		3
ENG 7400	Advanced Topic in Genre Studies - Modern Short Fiction and Creative Non-fiction		3
ENG 7420	MA Thesis		3
ENG 7750	Global Shakespeare		3
EPHM7020	Management of Public Health Risks		3
EPHM7040	Land & Water Resources Management		3
EPHM7070	Environmental Monitoring, Assessment, Research and Reporting		3
EPHM7311	MSc Dissertation		3
EPHM7312	MSc Dissertation		3
EPHM7330	Food Quality, Law and Safety Management		3
EPHM7340	Carbon and Energy Management		3
EURO7160	Current Issues of European Integration		3
FASS7602	Transdisciplinary Research Seminar for Doctoral Students		0.5
FILM7012	Research Seminar II		0.5
FILM7014	Research Seminar IV		0.5
FILM7016	Research Seminar VI		0.5
FILM7030	Research Methods		3
FIN 7250	Corporate Financial Management		3
FIN 7940	Corporate Finance and Governance		3
GEOG7520	Urban & Regional Development of China		3
GEOG7540	Sustainable Energy & Technological Innovation in China		3
HIST7320	Contemporary China & Globalization		3
HIST7530	Graduate Seminar on Contemp Chi History		3
HIST7570	China and Asia since 1900		3
HRM 7030	Workforce Planning and Talent Acquisition		3
HRM 7060	Reward Management		3
HRM 7160	Technology for People Management		3
HRM 7340	International Human Resources Management		3
HRM 7610	Human Resources Research, Analytics and Consultancy		3
HRM 7650	Analytics for Talent Management		3
HRM 7690	HRM Standards for Effective and Sustainable People Management		3
ITS 7020	ITS Doctoral Research Training II		3
ITS 7032	ITS Research Seminars II		0.5
JOUR7080	Current Issues & Case Stds in Int'l News		3
JOUR7100	Advanced News Writing and Production for International Practice		3
JOUR7110	Reporting International Conflict		3
JOUR7130	Project or Dissertation		3
JOUR7160	Principles of Economics		3
JOUR7180	Advanced Business News Writing and Production		3
JOUR7210	Longform Journalism		3
JOUR7220	Photojournalism		3
JOUR7230	Broadcast Journalism		3
JOUR7240	Online and Digital Journalism		3
JOUR7250	Reporting China and Hong Kong		3
JOUR7330	Food and Culture Reporting		3
JOUR7350	Media & Communication in Greater China		3
JOUR7360	Generative AI Assisted Reporting		3
JOUR7380	Reporting cryptocurrency and blockchain		3
JOUR7390	Reporting Gender Issues		3
LANG7401	Introduction to the Study of Lang I		3
LANG7510	Language in Society		3
LANG7570	Language and Education		3
LANG7640	Grammar of Modern English		3
LANG7720	Second Language Pronunciation Pedagogy		3
MATH7030	Numerical Linear Algebra		3
MATH7050	Optimization Theory & Techniques		3
MATH7180	Foundation of Big Data and Learning		3
MATH7330	Research Seminars		1
MATH7350	Research Seminars		1
MATH7370	Research Methods		3
MATH7390	Time Series and Forecasting		3
MCCP6010	Training on Teaching University Students		1
MCCP6020	Advanced English for Academic Purposes		2
MCM 7060	Formulation Theories and Practices of Chinese Medicinal Formulae	方劑配伍的理論與實踐	3
MCM 7070	Studies and Applications of the Science of Seasonal Febrile Diseases	温病學說研究與應用	3
MCM 7080	Examination and Diagnosis of Musculoskeletal Disorders	肌肉骨骼疾患的檢查與診斷	3
MCM 7120	Clinical Practice - Studies and Applications of Internal Chinese Medicine	實踐研習-中醫內科研究與應用	5
MCM 7150	Clinical Practice - Studies and Applications of Acupuncture	實踐研習 - 針灸研究與應用	5
MCM 7180	Clinical Practice - Studies and Applications of Orthopaedics, Traumatology and Tui Na	實踐研習-骨傷與推拿研究與應用	5
MCM 7260	Dissertation	專題論文	6
MCM 7280	Marketing and Management of Industry for Chinese Medicines	中藥市場及管理	2
MCM 7290	Mechanism of Action and Safe Application of Chinese Medicines	中藥作用機理與安全用藥	3
MCM 7300	Advances in Chinese Medicines Research	中藥研究進展	3
MDD 7020	Advances in Chinese Medicines Research	中藥研究進展	3
MDD 7050	Translational Medicine and Drug Discovery: Theory & Practice (Chinese Medicines)	轉化醫學與藥物發現：理論與實踐(中藥)	3
MDD 7060	Mechanism of Action and Safe Application of Chinese Medicines	中藥作用機理與安全用藥	3
MDD 7100	Dissertation	專題論文	3
MDD 7110	Formulation Theories and Practices of Chinese Medicinal Formulae	方劑配伍的理論與實踐	3
MDD 7140	Practicum	實驗實踐	1.5
MGNT7090	Strategic Management & Business Policy		3
MGNT7320	Leadership Theories and Development		3
MGNT7350	Lessons from Strategic Failures and Critical Thinking for Managers		3
MGNT7730	Frontiers of Leadership Research		3
MHM 7080	Rehabilitative Nursing in Chinese Medicine	中醫康復護理	2
MHM 7090	Health Management of Common Urban Diseases	常見都市疾病管理	3
MHM 7100	Cosmetology in Chinese Medicine	中醫美容學	2
MHM 7150	Constitutional Theory of Chinese Medicine	中醫體質學	3
MHM 7160	Practicum	見/實習	4
MHM 7170	Formulation Theories & Practices of Chinese Medicinal Formulae	方劑配伍的理論與實踐	3
MHM 7180	Dissertation	專題論文	3
MKT 7100	Management of Integrated Marketing Communications		3
MKT 7750	Branding Strategies in the Digital Age		3
MKTG7010	Startup Creation Process and Entrepreneurial Ecosystem		3
MKTG7020	Entrepreneurship, Emerging Technologies, and Business Opportunities		3
MKTG7030	New Venture Business Planning, Small and Family Business		3
MKTG7040	Accounting and Finance for Entrepreneurs		3
MKTG7050	Strategic Management		1.5
MKTG7060	Marketing Planning		1.5
MKTG7110	Social Entrepreneurship and Impact-driven Business		3
MKTG7130	Business Project/ Academic Dissertation		15
MPS 7030	Mechanism of Action and Safe Application of Chinese Medicines	中藥作用機理與安全用藥	3
MPS 7070	Advances in Chinese Medicines Research	中藥研究進展	3
MPS 7082	Dissertation	專題論文	3
MPS 7100	Marketing and Management of Industry for Chinese Medicines	中藥市場及管理	2
MPS 7110	Translational Medicine and Drug Discovery: Theory & Practice (Chinese Medicines)	轉化醫學與藥物發現:理論與實踐(中藥)	3
MPS 7132	Laboratory Practice in Chinese Medicines	中藥實驗實踐	1
MPS 7150	Formulation Theories and Practices of Chinese Medicinal Formulae	方劑配伍的理論與實踐	3
MUS 7310	Choral Pedagogy		3
MUS 7350	Piano Pedagogy		3
MUS 7460	SourcesGenres&Performance:Historical Per		3
MUS 7480	Advanced Studies in Chinese Music		3
MUS 7562	Research Seminar II		0.5
MUS 7572	Research Seminar IV		0.5
MUS 7610	Special Topics in Music II - The Art of Improvisation: The Music of Keith Jarrett		3
MUS 7620	Special Topics in Music III - Sensibility and Eighteenth-Century Music		3
MUS 7650	Guided Reading II		3
MUS 7670	Advanced Music Ensemble II		3
MUS 7690	Recital Project II		3
MUS 7710	Performance Seminar II		3
MUS 7720	Post-Instrumental Practice		3
PHYS7040	Advanced Topics in Physics I - Dynamical Systems with Applications		3
PHYS7060	Advanced Topics in Physics III - Advance in Displays and Lighting		3
PHYS7070	Postgraduate Research Seminars		1
POLS7010	Advanced China Studies		3
POLS7020	E-Government		3
POLS7080	Fieldwork Learning in China and Overseas Public Administration		3
POLS7100	Public Affairs and Public Policy		3
POLS7140	Public Policy & Governance		3
POLS7150	Ethics & Public Affairs		3
REL 7020	Selected Masterpieces in Philosophy		3
REL 7080	RPG Research Methodology in Religion and Philosophy		3
SCI 7780	Research Methods		3
SCM 7030	Mandatory Course on Research Methods		3
SCM 7040	Research Seminar		0.5
SLM 7020	Management Skills and Communications		3
SLM 7030	Management of Human Resources		3
SLM 7040	Planning & Developing S & L Facilities		3
SLM 7060	Financial Management		3
SLM 7070	Seminar on Contemporary Issues in Sport & Leisure		3
SLM 7140	Event Management		3
SOC 7020	Adv Sem on Contemp Sociological Issues		3
SOC 7530	Grad Sem on Con Social Issues in China		3
SOC 7570	Chinese Family and Kinship		3
SOC 7590	Popular Culture and Society in Contemporary China		3
SOSC7320	Debating Global Society		3
SOSC7330	Globalizations		3
SOSC7340	Global Civil Society		3
SOSC7370	Independent Project on Global Society		3
SOSC7400	Professional Placement		3
SOSC7440	Advanced Quantitative Methods		3
SOWK7030	Critical Management Practice		3
SOWK7040	Research & Programme Evaluation		3
SOWK7170	Youth at the Margins: Theory & Practice		3
SOWK7210	Working with Families with Mental Health Issues		3
SOWK7230	Crisis Mgnt & Integrated MH Practice		3
SOWK7410	Human Diversity and Cultural Difference		3
SOWK7440	Narrative Practice with Specific Youth Groups		3
SOWK7470	Counselling Project		3
SOWK7500	Family Therapy		3
SOWK7610	Society and Social Policy		3
SOWK7641	Social Work Theory & Practice II		1
SOWK7642	Social Work Theory & Practice II		3
SOWK7650	Management in Human Service Organisations		3
SOWK7690	Social Work Integrative Tutorial II		1
SOWK7700	Fieldwork Practice I		5
SOWK7710	Fieldwork Practice II		5
SOWK7720	Social Work with Older People		3
SOWK7730	Social Work with Youth		3
SOWK7780	Social Work Integrative Tutorial III		1
SOWK7790	Mental Health Counselling with Older People		3
SOWK7801	Counselling Practicum I		3
SOWK7802	Counselling Practicum II		3
SOWK7910	Cognitive Behavior Therapy Skills Workshop		3
TRA 7040	Research Methodology		3
TRA 7080	Bilingual Comm:Style,Rhetoric & Delivery		3
TRA 7110	Master Classes in Translation		3
TRA 7122	Dissertation/Project		3
TRA 7200	Conference Interpreting		3
TRA 7210	Advanced Consecutive Interpreting		3
TRA 7510	Required Readings for Translation Stds		3
TRA 7562	Practical and/or Theoretical Projects II		3
TRA 7570	Translation Technology II		3
TRA 7580	Audiovisual Translation		3
VACC7020	Visual Arts Theory and Criticism		3
VACC7040	Arts & the Public: Interpretation & Presentation		3
VACD7030	CD Studio Project IIA		4.5
VACD7040	CD Studio Project IIB		4.5
VARP7012	Research Seminar II		0.5
VARP7022	Research Seminar IV		0.5
VARP7032	Research Seminar VI		0.5
VASA7030	SMA Studio Project IIA		4.5
VASA7040	SMA Studio Project IIB		4.5
WRIT7010	Stylistics and Aesthetics		3
WRIT7030	Cultural Professionals and Creative Industries		3
WRIT7051	Master Project		3
WRIT7110	Writing (for) Performance		3
WRIT7120	Single Author / Artist Study		3
ACCT7025	Stakeholder Governance and Compliance		3
ACCT7035	Sustainability Governance and Reporting		3
ACCT7220	Strategic Mgnt Accounting & Controls		3
ACCT7510	Advanced Financial Reporting		3
ACCT7620	Auditing		3
ACCT7760	International Taxation		3
ACCT7810	Securities Regulation		3
ACCT7850	Contemporary Strategic Management Accounting Issues		3
ACCT7860	Accounting Theory		3
ACCT7910	Hong Kong and International Taxation		3
ACCT7920	Commercial and Company Law		3
ACCT7960	Interpreting Financial and Accounting Information		3
ACCT7980	Risk Management		3
BUS 7993	DBA Thesis III		6
BUS 7994	DBA Thesis IV		6
ECON7130	Principles and Applications of Sustainable Finance and Investment		3
FIN 7220	Investment and Portfolio Analysis		3
FIN 7240	Derivative Securities and Risk Management		3
FIN 7750	FinTech, Digital Transformation and Web 3.0		3
FIN 7790	Machine Learning for Financial Market Modelling and Analysis		3
FIN 7820	Applied Financial Econometrics		3
FIN 7840	Blockchain Engineering and Virtual Assets		3
FIN 7900	Cybersecurity and Privacy for Financial Technology		3
FIN 7911	Applied FinTech Industry Project		1.5
MATH7790	Prescriptive Analytics for Decision Making		4
MATH7830	Machine Learning and Forecasting		4
MATH7840	Advanced Spreadsheets and Decision Support Systems		3
MATH7920	Work-based Learning		3
MATH7941	Dissertation I		3
MATH7960	Applied Multivariate Analysis		3
BUSD7140	Entrepreneurship and New Venture Development		3
MGNT7240	Strategic Management		3
MGNT7790	Sustainable Growth through Mergers & Acquisition		3
MKT 7740	Brand Psychology and Digital Marketing		3"""

def main():
    courses = []
    for line in raw_data.split('\n'):
        c = parse_line(line, "Postgraduate")
        if c: courses.append(c)
    with open(output_sql, 'a', encoding='utf-8') as f:
        f.write("\n-- HKBU Sem2 Courses Part 6 (Postgraduate)\n")
        for c in courses:
            name = c['name'].replace("'", "''")
            dept = c['department'].replace("'", "''")
            f.write(f"INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) \nVALUES ('{c['code']}', '{name}', 'TBD', '{dept}', {c['credits']}, 0, 0) \nON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;\n")
    print(f"Processed {len(courses)} courses (Part 6).")

if __name__ == "__main__":
    main()
