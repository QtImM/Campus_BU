-- HKBU Sem2 Courses Part 1
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT1006', 'Principles of Accounting II', 'TBD', 'Accountancy', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT2005', 'Intermediate Accounting I', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT2006', 'Intermediate Accounting II', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT3006', 'Hong Kong Taxation', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT3007', 'Cost and Management Accounting II', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT3026', 'Accounting Internship I', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT3045', 'Accounting Internship II', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT4017', 'Auditing II', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT4035', 'Big Data in Accounting with Power BI', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ARTT1006', 'Arts Tech Practices I (Making Senses)', 'TBD', 'Creative Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ARTT2006', 'Arts Tech Practices II (Transmedia Beyond Spectacles)', 'TBD', 'Creative Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ARTT3006', 'Transdisciplinary Collaboration II', 'TBD', 'Creative Arts', 6, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ARTT3007', 'Arts Tech Work Experience', 'TBD', 'Creative Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ARTT4006', 'Arts Tech Honours Project', 'TBD', 'Creative Arts', 7, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ARTT4007', 'Arts Tech - Special Topics', 'TBD', 'Creative Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BAGE3006', 'Industry Internship', 'TBD', 'Department of BAGE', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BAGE3015', 'Transdisciplinary Collaboration II', 'TBD', 'Department of BAGE', 6, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BAGE4899', 'Honours Project II', 'TBD', 'Department of BAGE', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL1005', 'Introduction to Biology', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL2015', 'Biodiversity', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL2016', 'Biodiversity Laboratory', 'TBD', 'Biology', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL2017', 'Cell Biology', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL2025', 'Cell Biology Laboratory', 'TBD', 'Biology', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL2026', 'Genetics and Evolution', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL2027', 'Genetics and Evolution Laboratory', 'TBD', 'Biology', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL2046', 'Summer Internship', 'TBD', 'Biology', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL3005', 'Animal Physiology', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL3006', 'Animal Physiology Laboratory', 'TBD', 'Biology', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL3016', 'Environmental Health and Toxicology', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL3025', 'Plant Physiology', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL3026', 'Plant Physiology Laboratory', 'TBD', 'Biology', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL3027', 'Waste Treatment and Recycling', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL3056', 'Introduction to Genome Biology', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL3065', 'Soil Science and Fertility', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL3066', 'Soil Science and Fertility Laboratory', 'TBD', 'Biology', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL3067', 'Crop Production and Management', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL4017', 'Environmental Biotechnology', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL4025', 'Biotechnology Studies Laboratory II', 'TBD', 'Biology', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL4027', 'Developmental Biology', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL4045', 'Environmental Science Laboratory II', 'TBD', 'Biology', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL4047', 'Farm Management for Urban Environment', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL4057', 'Organic Certification and Inspector Training', 'TBD', 'Biology', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL4067', 'Sustainable Urban Environment', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL4899', 'Applied Biology Project II', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL4999', 'Bioresource and Agricultural Science Project II', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BMSC1007', 'Physiology 生理學', 'TBD', 'Biomedical Sciences', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BMSC1008', 'Biomedical Sciences Laboratory I 生物醫學實驗 I', 'TBD', 'Biomedical Sciences', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BMSC1009', 'Biomedical Sciences Laboratory IIA 生物醫學實驗 IIA', 'TBD', 'Biomedical Sciences', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BMSC1015', 'Biochemistry and Molecular Biology 生物化學及分子生物學', 'TBD', 'Biomedical Sciences', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BMSC1017', 'Biomedical Sciences Laboratory III 生物醫學實驗 III', 'TBD', 'Biomedical Sciences', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BMSC1025', 'Anatomy and Physiology 解剖及生理學', 'TBD', 'Biomedical Sciences', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BMSC2015', 'Clinical Sciences Laboratory 臨床醫學實驗', 'TBD', 'Biomedical Sciences', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BMSC2016', 'Fundamental Diagnosis 西醫診斷學', 'TBD', 'Biomedical Sciences', 4, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BMSC2017', 'Pharmacology 藥理學', 'TBD', 'Biomedical Sciences', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BMSC3005', 'Hematology 血液學', 'TBD', 'Biomedical Sciences', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BMSC3017', 'Endocrinology 內分泌系統', 'TBD', 'Biomedical Sciences', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BMSC3026', 'Renal System 泌尿系統', 'TBD', 'Biomedical Sciences', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BMSC3027', 'Reproductive System 生殖系統', 'TBD', 'Biomedical Sciences', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BMSC3046', 'Surgery and Emergency Medicine 外科,急診科', 'TBD', 'Biomedical Sciences', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BMSC4899', 'Honours Project II 專題研究 II', 'TBD', 'Biomedical Sciences', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUSI1005', 'The World of Business and Entrepreneurship', 'TBD', 'Business', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUSI1006', 'Business Research Methods', 'TBD', 'Business', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUSI1007', 'Business Coding', 'TBD', 'Business', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUSI2005', 'Organisational Behaviour', 'TBD', 'Business', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUSI2035', 'Entrepreneurship and Innovative Thinking', 'TBD', 'Business', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUSI2045', 'Data Analytics for Business Decision Making', 'TBD', 'Business', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUSI2055', 'AI for Business', 'TBD', 'Business', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUSI3006', 'Business Ethics, CSR and Impact Investing', 'TBD', 'Business', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUSI3035', 'Service Learning and Community Engagement', 'TBD', 'Business', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUSI3046', 'Business Communications in the Technology Era', 'TBD', 'Business', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUSI3055', 'Fundamentals of Social Entrepreneurship and Social Impact', 'TBD', 'Business', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUSI3057', 'Managing Entrepreneurial Ventures', 'TBD', 'Business', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUSI3095', 'Project Management for Digital Initiatives', 'TBD', 'Business', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUSI3097', 'Data Analytics for Business Decision Making', 'TBD', 'Business', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUSI4005', 'BBA Project', 'TBD', 'Business', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUSI4006', 'Strategic Management', 'TBD', 'Business', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM1005', 'Introduction to Chemistry', 'TBD', 'Chemistry', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM2006', 'Integrated Chemistry Tutorials I', 'TBD', 'Chemistry', 0, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM2007', 'Integrated Chemistry Tutorials II', 'TBD', 'Chemistry', 0, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM2066', 'Analytical Chemistry', 'TBD', 'Chemistry', 4, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM2067', 'Organic Chemistry I', 'TBD', 'Chemistry', 4, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM3015', 'Inorganic Chemistry', 'TBD', 'Chemistry', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM3016', 'Inorganic Chemistry Laboratory', 'TBD', 'Chemistry', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM3017', 'Physical Chemistry Laboratory II', 'TBD', 'Chemistry', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM3035', 'Integrated Laboratory for Testing and Certification', 'TBD', 'Chemistry', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM3036', 'Biochemistry I', 'TBD', 'Chemistry', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM3047', 'Chemistry Research Methods', 'TBD', 'Chemistry', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM3056', 'Integrated Chemistry Tutorials IV', 'TBD', 'Chemistry', 0, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM3065', 'Seminar', 'TBD', 'Chemistry', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM4016', 'Dissertation in Chemistry', 'TBD', 'Chemistry', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM4017', 'Environmental Chemistry and Analysis', 'TBD', 'Chemistry', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM4025', 'Advanced Instrumental Analysis', 'TBD', 'Chemistry', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM4045', 'Organic Synthesis', 'TBD', 'Chemistry', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM4057', 'Spectroscopic Techniques for Structure Determination', 'TBD', 'Chemistry', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM4076', 'Chemical Testing Laboratory Management and Accreditation', 'TBD', 'Chemistry', 4, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM4086', 'Forensic Chemistry and Analysis', 'TBD', 'Chemistry', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM4879', 'Final Year Project II', 'TBD', 'Chemistry', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM4899', 'Final Year Project II', 'TBD', 'Chemistry', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHIL2016', 'Chinese Etymology 文字學', 'TBD', 'Chinese Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHIL2017', 'Classical Chinese 古代漢語', 'TBD', 'Chinese Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHIL2025', 'History of Classical Chinese Literature (Song to Qing Dynasties) 中國文學史(宋至清)', 'TBD', 'Chinese Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHIL3015', 'Selected Chinese Lyrics and Songs 詞曲選 - 女性詞人選讀', 'TBD', 'Chinese Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHIL3026', 'Modern Chinese Fiction Writing 現代中文小說寫作', 'TBD', 'Chinese Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHIL4005', 'Literary Criticism 文學批評', 'TBD', 'Chinese Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHIL4026', 'Modern Views on Traditional Chinese Culture 傳統中國文化的現代觀照', 'TBD', 'Chinese Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHIL4027', 'Selected Readings from Classical Confucian Works 先秦儒家專書選讀 - 禮記', 'TBD', 'Chinese Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHIL4035', 'Selected Readings from Traditional Chinese Thinkers (Zi) 諸子選讀 - 孟子', 'TBD', 'Chinese Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHIL4057', 'Special Topics in Chinese Language 中國語文專題研究 - 詞匯與中國文化', 'TBD', 'Chinese Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHIL4106', 'Special Topics in the History of Chinese Literature (Modern Literature) 中國文學史專題研究 (現代文學) - 香港文學', 'TBD', 'Chinese Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHIL4899', 'Honours Project 畢業寫作（論文╱創作）', 'TBD', 'Chinese Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CMED1016', 'Ancient Chinese Medical Prose - Selected Readings 醫古文 - 中醫文獻選讀', 'TBD', 'Chinese Medicine', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CMED1017', 'Diagnostics of Chinese Medicine', 'TBD', 'Chinese Medicine', 5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CMED2017', 'Chinese Medicinal Formulae 方劑學', 'TBD', 'Chinese Medicine', 6, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CMED2025', 'Selected Readings of Chinese Medicine Classics (II) - Treatise on Exogenous Febrile Diseases 中醫經典選讀(二)傷寒論', 'TBD', 'Chinese Medicine', 5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CMED2027', 'Selected Readings of Chinese Medicine Classics (IV) - Science of Seasonal Febrile Diseases 中醫經典選讀(四)溫病學', 'TBD', 'Chinese Medicine', 4, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CMED3035', 'Surgery of Chinese Medicine 中醫外科學', 'TBD', 'Chinese Medicine', 5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CMED3036', 'Acupuncture - Clinical Practice 臨床針灸學', 'TBD', 'Chinese Medicine', 4, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CMED3039', 'Internal Medicine of Chinese Medicine II 中醫內科學 II', 'TBD', 'Chinese Medicine', 4, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CMED3049', 'Internal Medicine of Chinese Medicine Clinic II 中醫內科學見習 II', 'TBD', 'Chinese Medicine', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CMED3057', 'Paediatrics of Chinese Medicine 中醫兒科學', 'TBD', 'Chinese Medicine', 4, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CMED3059', 'Orthopaedics and Traumatology of Chinese Medicine and Tui Na II 中醫骨傷、推拿學 II', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CMED3065', 'Acupuncture - Clinical Practice Attachment 臨床針灸學見習', 'TBD', 'Chinese Medicine', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CMED3069', 'Orthopaedics and Traumatology of Chinese Medicine and Tui Na Laboratory II 中醫骨傷、推拿學實驗 II', 'TBD', 'Chinese Medicine', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CMED4015', 'Specialty Studies and Professional Training of Chinese Medicine 中醫專科研習與職業訓練', 'TBD', 'Chinese Medicine', 12, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CMED4018', 'Clinical Internship I 畢業實習 I', 'TBD', 'Chinese Medicine', 19, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM1015', 'Studies in Communication, Media, and Journalism', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM2006', 'Communication Theory (Communication Studies)', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM2026', 'Human Communication', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM2027', 'AI and Digital Communication', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM2036', 'Media Design and Digital Applications', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP1005', 'Essence of Computing', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP1016', 'Mathematical Methods for Business Computing', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP1025', 'Coding for Humanists', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP2015', 'Data Structures and Algorithms', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP2016', 'Database Management', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP2017', 'Operating Systems', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP2035', 'AI and Data Analytics for Health and Social Innovation I', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP3065', 'Artificial Intelligence Application Development', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP3066', 'Health and Assistive Technology: Practicum', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP3076', 'AI and Generative Arts', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP3115', 'Exploratory Data Analysis and Visualization', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP3925', 'Data Analysis Studio', 'TBD', 'Computer Science', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP4025', 'Interactive Computer Graphics', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP4026', 'Computer Vision and Pattern Recognition', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP4027', 'Data Mining and Knowledge Discovery', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP4046', 'Information Systems Control and Auditing', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP4057', 'Distributed and Cloud Computing', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP4107', 'Software Design, Development and Testing', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP4117', 'Information Systems: Design and Integration', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP4127', 'Information Security', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP4135', 'Recommender Systems and Applications', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP4137', 'Blockchain Technology and Applications', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP4146', 'Prompt Engineering for Generative AI', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP4869', 'Informatics Project II', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP4878', 'Innovative Computing Project I', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP4879', 'Innovative Computing Project II', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP4908', 'Data Media Project I', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP4909', 'Data Media Project II', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP4918', 'Final Year Project I', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP4919', 'Final Year Project II', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP4929', 'Artificial Intelligence Project II', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;

-- HKBU Sem2 Courses Part 2
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CRIN3005', 'Special Topics on Creative Industry I', 'TBD', 'Creative Industries', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CRIN3006', 'Artiste Management', 'TBD', 'Creative Industries', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('DIFH1005', 'AI and Digital Futures in the Humanities', 'TBD', 'Digital Futures', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON1006', 'Principles of Economics II', 'TBD', 'Economics', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON1007', 'Basic Economic Principles', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON3006', 'Asia-Pacific Economies', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON3007', 'Industrial Organization and Competitive Strategy', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON3066', 'Business Economics Internship', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON3075', 'Service-Learning in Sustainable Development', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON3077', 'Managerial Macroeconomics', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON3086', 'Python Programming for FinTech', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON3087', 'Understanding the Digital Economy', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON3105', 'Big Data Analytics with Python', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON3107', 'Environmental Cost and Benefit Analysis', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDUC4899', 'Honours Project', 'TBD', 'Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENGL1005', 'English, Creativity, and Cultures', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENGL2016', 'Sounds of English around the World', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENGL2017', 'Stepping Stones in English Grammar', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENGL2025', 'The Art of Storytelling', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENGL2027', 'Academic and Professional Writing', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENGL2097', 'Virtual Storytelling: Narration across Dimensions', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENGL3026', 'Special Topic in Language - From Theory to Practice in Second Language Speech', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENGL3055', 'Literature and Film', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENGL3205', 'Components of a Word', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENGL3416', 'Internship in English Studies: From Classroom to Workplace', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENGL4006', 'Advanced Topic in Language', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENGL4007', 'Advanced Topic in Linguistic Theory - Language Learning and Cognition', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENGL4027', 'Exploring Bilingualism and Bilingual Education', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENGL4067', 'Comics and Graphic Novels', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENGL4127', 'Introducing African Literatures', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENGL4899', 'Honours Project', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EURO2007', 'The Political Economy of the European Union', 'TBD', 'European Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EURO2015', 'Model European Union', 'TBD', 'European Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EURO3009', 'European Academic/Internship Semester II', 'TBD', 'European Studies', 12, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EURO4005', 'Current Issues of European Integration', 'TBD', 'European Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EURO4006', 'European Economic and Business Life: travailler en contexte international', 'TBD', 'European Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EURO4007', 'European Economic and Business Life: Wirtschaft im Wandel/Deutsch-chinesische Wirtschaftsbeziehungen', 'TBD', 'European Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EURO4899', 'Honours Project (European Studies)', 'TBD', 'European Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FAGS1016', 'Fundamentals of Directing', 'TBD', 'Film & Screen', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FAGS2005', 'Voice and Speech II', 'TBD', 'Film & Screen', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FAGS2006', 'Movement II', 'TBD', 'Film & Screen', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FAGS2007', 'Acting and Directing', 'TBD', 'Film & Screen', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FAGS2025', 'Dance for Actors', 'TBD', 'Film & Screen', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FAGS2026', 'Special Topic in Screen Performance', 'TBD', 'Film & Screen', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FAGS2027', 'Special Topic in Acting: Asia Focus', 'TBD', 'Film & Screen', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FAGS2035', 'World Theatre', 'TBD', 'Film & Screen', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FAGS2036', 'Performativity & Online Content Creation', 'TBD', 'Film & Screen', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FAGS3007', 'Acting Internship', 'TBD', 'Film & Screen', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FAGS3025', 'Technology, Body and Performance', 'TBD', 'Film & Screen', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FAGS3026', 'My Acting Career', 'TBD', 'Film & Screen', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FAGS3027', 'Global Studies in Acting', 'TBD', 'Film & Screen', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FAGS4005', 'Casting, Film Festival & Acting as a Business', 'TBD', 'Film & Screen', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FAGS4899', 'Honours Project', 'TBD', 'Film & Screen', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM2007', 'Photography', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM2009', 'Practicum I', 'TBD', 'Film', 0, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM2047', 'Storytelling', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM2067', 'The Art of Script Writing', 'TBD', 'Film', 6, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM2086', 'Digital Advertising Production', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM2087', 'Ideologies, Gender and Cinema', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM3006', 'Film Sound', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM3009', 'Practicum II', 'TBD', 'Film', 0, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM3016', 'Non-Fiction Film', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM3027', 'Television Studio Production', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM3035', 'Chinese-Language Cinema', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM3047', 'Hollywood Cinema', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM3076', 'Screen Acting Workshop', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM3077', 'The Art of Documentary Film', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM3125', 'Honours Project Preparation Workshop', 'TBD', 'Film', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM3147', 'Entertainment 3.0: Creative Industries and Technology', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM4026', 'East Asian Cinemas: History and Current Issues', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM4046', 'Advanced Cinematography', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM4047', 'Film Theory and Criticism', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM4065', 'Art Direction', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM4869', 'Honours Project in Animation and Media Arts', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM4879', 'Honours Project in Film and Television', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;

-- HKBU Sem2 Courses Part 3
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FINE1005', 'Financial Planning and Investment Analysis', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FINE2005', 'Financial Management', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FINE2006', 'Banking and Credit', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FINE3005', 'Investment Management', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FINE3006', 'Introduction to Futures and Options Markets', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FINE3007', 'Fixed Income Securities', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FINE3015', 'Corporate Finance', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FINE3026', 'Finance Internship', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FINE3035', 'ESG, Green Finance and Sustainable Investment', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FINE4006', 'Financial Risk Management', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FINE4025', 'Compliance in Finance', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FINE4026', 'FinTech for Banking and Finance', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FINE4027', 'Mergers, Acquisitions and Corporate Restructuring', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FREN1005', 'French I', 'TBD', 'French', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FREN1006', 'French II', 'TBD', 'French', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FREN1205', 'European Language in Context I (French)', 'TBD', 'French', 9, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FREN2006', 'French IV', 'TBD', 'French', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FREN2209', 'European Language in Context II (French)', 'TBD', 'French', 9, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FREN3006', 'Contemporary French Society through its National Cinema', 'TBD', 'French', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GAME1005', 'Fundamentals of Animation for Game Design and Film', 'TBD', 'Game Design', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GAME2006', 'Fundamentals of Programming for Game Design and Animation', 'TBD', 'Game Design', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GAME2007', 'Game and Animation Production Workshop', 'TBD', 'Game Design', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GAME2009', 'Practicum I', 'TBD', 'Game Design', 0, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GAME2017', 'Transcultural Studies of Animation', 'TBD', 'Game Design', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GAME2025', 'Visual Communication', 'TBD', 'Game Design', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GAME3005', '2D Platform Game Programming', 'TBD', 'Game Design', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GAME3009', 'Practicum II', 'TBD', 'Game Design', 0, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GAME3027', 'Traditional and Experimental Animation', 'TBD', 'Game Design', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GAME3045', 'Honours Project Preparation Workshop', 'TBD', 'Game Design', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GAME4005', 'Character Effects and Rigging', 'TBD', 'Game Design', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GAME4006', '3D Game World Programming', 'TBD', 'Game Design', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GAME4015', 'Game Physics, Dynamics, and Simulations', 'TBD', 'Game Design', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GAME4016', 'Lighting, Rendering and Style', 'TBD', 'Game Design', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GAME4017', 'Motion Graphic Design', 'TBD', 'Game Design', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GAME4026', 'Creative Production in Extended Reality', 'TBD', 'Game Design', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GAME4036', 'Game Economy: Cryptocurrency and Blockchain Technology', 'TBD', 'Game Design', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GAME4045', 'Digitally Mediated Communication', 'TBD', 'Game Design', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GAME4899', 'Honours Project in Game Design and Animation II', 'TBD', 'Game Design', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3005', 'MathRomance', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3006', 'Implementation of Service-learning Engagement through Chinese Story Telling and Writing 服務學習與實踐：香港「老故事」書寫', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3007', 'A Tale of Two Cities', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3015', 'Ecotourism in GBA (Guangdong-Hong Kong-Macao Greater Bay Area): Planning and Design', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3016', 'Historic Landmarks, Heritage and Community', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3037', 'How Should the Government Spend Our Money', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3056', 'Taking a Stand: Turning Research Insights into Policy Recommendations', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3066', 'Global Beijing: Society, Culture and Changes', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3076', 'Service-learning in Fighting Poverty', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3077', 'Entrepreneurial and Innovative Solutions to Social Problems', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3085', 'Bringing Chinese Culture into the Community through Art Activities', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3087', 'Canine Service Partners for Inclusive Community', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3105', 'Meditation and Music for Wellbeing and Goal Achievement', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3115', 'Children as Consumers: Marketing to the Youth', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3126', 'Fact-checking Misinformation and Disinformation', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3127', 'Media Communication in the AI Era', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3145', 'Community and Civic Engagement', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3146', 'Global Outreach', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3157', 'Leisure and Well-Being: Coping with Stress', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3186', 'Service Leadership in Learning Communities', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3187', 'Connecting the Elderly with the Internet - E-sports', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3195', 'Hong Kong and the World', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3215', 'Art and the Community', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3225', 'Essential Mathematics to Understand Modern Digital World', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3226', 'Empowering Citizens through Data: Participatory Policy Analysis for Hong Kong', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3227', 'Connected Communities: Communication Technologies for Social Impact', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3235', 'AI and Digital Inclusion in an Ageing Society', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3255', 'Sustainable Lifestyles: Energy Management and Green Mobility', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3257', 'Human Capital Sustainability: Leadership for a Better Future', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3265', 'Entrepreneurial Innovation for Interactive Media', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3266', 'Global Workshop on Diversity, Equality & Social Justice: Community Engagement & Policy Inno Showcase', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3267', 'Professional Investment Lab: Experiential Portfolio Management', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3275', 'Transdisciplinary AI Innovation Workshop', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCAP3276', 'From Community Insight to Entrepreneurial Impact', 'TBD', 'General Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCST1005', 'Approaches in Global Studies', 'TBD', 'Global Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCST2006', 'A Political Economy of Global China', 'TBD', 'Global Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCST2015', 'Cultural Heritage and Chinese Society', 'TBD', 'Global Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCST2017', 'Summer Sojourn I', 'TBD', 'Global Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCST2025', 'Global China Work Placement', 'TBD', 'Global Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCST2026', 'Summer Sojourn I (for non-Chinese speaking students)', 'TBD', 'Global Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCST3007', 'Research and Professional Writing', 'TBD', 'Global Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCST4005', 'Alternative Globalisations', 'TBD', 'Global Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GCST4899', 'Honours Project', 'TBD', 'Global Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEND3005', 'Gender, Society, Culture', 'TBD', 'Department of GEND', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG2007', 'Introduction to Quantitative Methods in Geography', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG2015', 'Maps and Map Making', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG2016', 'Earth Systems: Atmosphere and Biosphere', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG2017', 'Globalization of Economic Activities', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG2025', 'The Guangdong-Hong Kong-Macao Greater Bay Area: A Geographical Survey', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG2026', 'Introduction to Smart and Sustainable Cities', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG3005', 'Field Camp', 'TBD', 'Geography', 0, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG3006', 'Regional Geography of China', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG3016', 'Geography of Pacific Area: Regional development and Geopolitics', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG3017', 'Global Environmental Issues and Sustainability', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG4005', 'Advanced Climatology', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG4016', 'Sustainable Energy and Technological Innovation in China', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG4017', 'Geographical Information Systems', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG4027', 'Geography of Environmental Hazards', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG4035', 'Geography of Transportation', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG4036', 'Political Geography', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG4066', 'Seminar in Environmental Planning and Management', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG4076', 'Urban Cultural Landscape', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG4086', 'Urban and Environmental Planning', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG4097', 'Ecosystems and Processes', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG4899', 'Honours Project', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GERM1005', 'German I', 'TBD', 'German', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GERM1006', 'German II', 'TBD', 'German', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GERM1205', 'European Language in Context I (German)', 'TBD', 'German', 9, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GERM2006', 'German IV', 'TBD', 'German', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GERM2209', 'European Language in Context II (German)', 'TBD', 'German', 9, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GERM3007', 'German Language, Culture and Society', 'TBD', 'German', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GERM3016', 'Cinematic Germany: Analyzing History, Culture and Social Issues through Postmodern German Films', 'TBD', 'German', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEST1005', 'Introduction to Green Energy and Smart Technology', 'TBD', 'Green Energy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEST2006', 'Energy Foundation II: Electricity and Magnetism', 'TBD', 'Green Energy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEST2015', 'Energy Storage and Distribution', 'TBD', 'Green Energy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEST2017', 'Green Energy Laboratory II', 'TBD', 'Green Energy', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEST3006', 'Digital Technology for Network Communication', 'TBD', 'Green Energy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEST3007', 'Sustainable Transportation Technology', 'TBD', 'Green Energy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEST3017', 'Green Energy Lab with Smart Devices', 'TBD', 'Green Energy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEST3027', 'Principles of AI: from Model to Applications', 'TBD', 'Green Energy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEST4006', 'Energy Management of Green Building', 'TBD', 'Green Energy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEST4015', 'Advances in Displays and Lighting', 'TBD', 'Green Energy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEST4016', 'Topics in Green Energy and Smart Technology I', 'TBD', 'Green Energy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEST4027', 'Introduction to Robotics', 'TBD', 'Green Energy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEST4899', 'Final Year Project II', 'TBD', 'Green Energy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFAI1005', 'AI Literacies for Social Good', 'TBD', 'Department of GFAI', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFCC1036', 'The Rise of China: Historical Institutions and Modern Global Governance', 'TBD', 'Department of GFCC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFCC1037', 'The Individual and Society', 'TBD', 'Department of GFCC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFCC1045', 'Hong Kong between Past and Present', 'TBD', 'Department of GFCC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFCC1046', 'An Introduction to Gender, Class and Race', 'TBD', 'Department of GFCC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFCC1055', 'Global China in the Modern Age', 'TBD', 'Department of GFCC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFCC1057', 'Building a Global Community: International Law and Politics since 1945', 'TBD', 'Department of GFCC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFCC1065', 'Reinventing and Marketing Yourself', 'TBD', 'Department of GFCC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFCC1066', 'Youth on Screen: Coming-of-Age Stories in Global Cinema', 'TBD', 'Department of GFCC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHC1036', 'The Rise of China: Historical Institutions and Modern Global Governance', 'TBD', 'Department of GFHC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHC1037', 'The Individual and Society', 'TBD', 'Department of GFHC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHC1045', 'Hong Kong between Past and Present', 'TBD', 'Department of GFHC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHC1046', 'An Introduction to Gender, Class and Race', 'TBD', 'Department of GFHC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHC1055', 'Global China in the Modern Age', 'TBD', 'Department of GFHC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHC1057', 'Building a Global Community: International Law and Politics since 1945', 'TBD', 'Department of GFHC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHL1016', 'CrossFit: Cross-bridge of Fitness and Health', 'TBD', 'Department of GFHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHL1025', 'Have a Field Day: Outdoor Team Games', 'TBD', 'Department of GFHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHL1026', 'Home-Based Exercises: A Family Experience', 'TBD', 'Department of GFHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHL1027', 'Mind and Body Exercises: Stretching and Pilates', 'TBD', 'Department of GFHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHL1036', 'Table Tennis: A Brainy Workout', 'TBD', 'Department of GFHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHL1037', 'Hand-eye Rally: Tennis, Taspony and Pickleball', 'TBD', 'Department of GFHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHL1045', 'When Traditional Tai Chi Meets Modern Health and Fitness', 'TBD', 'Department of GFHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHL1046', 'Whip it or Spin it: Badminton and Flyball', 'TBD', 'Department of GFHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHL1047', 'Healthy Lifestyle in Action', 'TBD', 'Department of GFHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHL1056', 'Practice of Health Preservation and Management in Traditional Chinese Medicine 中醫養生与健康管理實踐', 'TBD', 'Department of GFHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHL1057', 'The Art of Mindfulness', 'TBD', 'Department of GFHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHL1065', 'E-sports and Health', 'TBD', 'Department of GFHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHL1066', 'Improving Mental Health for University Success', 'TBD', 'Department of GFHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHL1075', 'Communicating Health and Healthy Lifestyle', 'TBD', 'Department of GFHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHL1076', 'Health through Balance: Achieving Physical, Social and Emotional Wellbeing', 'TBD', 'Department of GFHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHL1077', 'Understanding Numbers, Improving Health', 'TBD', 'Department of GFHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFHL1085', 'Smart Devices for Personal Healthcare', 'TBD', 'Department of GFHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFQR1026', 'Big Data in "X"', 'TBD', 'Department of GFQR', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFQR1027', 'Data Analytics Skills for Your Future Workplace', 'TBD', 'Department of GFQR', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFQR1045', 'Making a Smart Decision', 'TBD', 'Department of GFQR', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFQR1046', 'Demystifying Data-Driven Strategies and Policies', 'TBD', 'Department of GFQR', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFQR1055', 'Sharpening Your Number Sense with Handy Computational Tools', 'TBD', 'Department of GFQR', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFQR1056', 'Be a Smart Financial Planner', 'TBD', 'Department of GFQR', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFQR1057', 'How to Survive in the World of Misinformation', 'TBD', 'Department of GFQR', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFVM1035', 'Freedom in Modern Society', 'TBD', 'Department of GFVM', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFVM1036', 'Happiness: East and West', 'TBD', 'Department of GFVM', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFVM1037', 'Ideologies, Worldviews and Modern History', 'TBD', 'Department of GFVM', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFVM1045', 'Matters of Life and Death', 'TBD', 'Department of GFVM', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFVM1046', 'The Meaning of Love, Sex and the Body', 'TBD', 'Department of GFVM', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFVM1055', 'Towards a Moral Economy', 'TBD', 'Department of GFVM', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFVM1056', 'Evil Business? Psychology, Politics and Philosophy of Business Ethics', 'TBD', 'Department of GFVM', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GFVM1057', 'Ethical Issues in the Contemporary World', 'TBD', 'Department of GFVM', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GSIS2005', 'Statistics for Social Sciences', 'TBD', 'Department of GSIS', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTCU2005', 'Art, Culture and Creativity', 'TBD', 'Department of GTCU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTCU2006', 'Chinese Knight-errant Heroism and the Modern World', 'TBD', 'Department of GTCU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTCU2015', 'Creativity and Madness', 'TBD', 'Department of GTCU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTCU2016', 'English in the World Today', 'TBD', 'Department of GTCU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTCU2025', 'Gender, Language, and Creativity', 'TBD', 'Department of GTCU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTCU2026', 'Hearing Hong Kong''s Past and Present through Cantopop 從粵語流行曲聆聽香港的過去和現在', 'TBD', 'Department of GTCU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTCU2036', 'Social Innovation and Entrepreneurship', 'TBD', 'Department of GTCU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTCU2046', 'The Synergy of Chinese Arts and Literature as Self-Expression', 'TBD', 'Department of GTCU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTCU2056', 'Adventures, Treasures, and Archaeology in China', 'TBD', 'Department of GTCU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTCU2066', 'Film and Philosophy', 'TBD', 'Department of GTCU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTCU2067', 'Striving for Sustainable Peace through Cultural Activities and Creative Arts', 'TBD', 'Department of GTCU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTCU2075', 'Thinking Creatively through Chinese Philosophy', 'TBD', 'Department of GTCU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSC2005', 'Astronomy for the 21st Century', 'TBD', 'Department of GTSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSC2006', 'Becoming Critically Thoughtful Cyberworld Citizens', 'TBD', 'Department of GTSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSC2007', 'Cyberspace and the Law: Your Rights and Duties', 'TBD', 'Department of GTSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSC2015', 'Disease and Public Health in China since 1800', 'TBD', 'Department of GTSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSC2016', 'Entrepreneurship in the Innovation Era', 'TBD', 'Department of GTSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSC2025', 'Health Maintenance and Food Therapy in Chinese Medicine', 'TBD', 'Department of GTSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSC2026', 'How Technology Shakes Up Our Society', 'TBD', 'Department of GTSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSC2027', 'Mathematics on the Battlefields', 'TBD', 'Department of GTSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSC2036', 'Science, Culture, and Society', 'TBD', 'Department of GTSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSC2045', 'Seeing the World from Artistic and Scientific Perspectives', 'TBD', 'Department of GTSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSC2047', 'When Science Fiction Comes True: The Future of Humanity', 'TBD', 'Department of GTSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSC2065', 'Diseases and Medicine', 'TBD', 'Department of GTSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSC2076', 'Soccer beyond the Pitch: Intersecting Data, History, Culture and Society', 'TBD', 'Department of GTSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSC2077', 'Are Science and Religion Compatible?', 'TBD', 'Department of GTSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSC2086', 'Social Change and Technological Progress', 'TBD', 'Department of GTSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSC2087', 'Building the Cities of Tomorrow: Smart Cities and Property Technology', 'TBD', 'Department of GTSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSU2007', 'Fighting Poverty and Striving for a Sustainable Society', 'TBD', 'Department of GTSU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSU2015', 'Green Energy Innovation for Sustainable City', 'TBD', 'Department of GTSU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSU2017', 'Law and Humanities', 'TBD', 'Department of GTSU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSU2026', 'Sustainable Peace: Conflict-Resolution and Reconciliation of Divided Communities', 'TBD', 'Department of GTSU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSU2027', 'Tax: Answer for Wealth Inequality', 'TBD', 'Department of GTSU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSU2036', 'Ethics, Governance, and Public Policy', 'TBD', 'Department of GTSU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSU2037', 'Sustainability through Digitalization: Active and Responsible Citizens in the Digital World', 'TBD', 'Department of GTSU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSU2046', 'Towards Evidence-Based Solutions to Our Social-ecological Problems', 'TBD', 'Department of GTSU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSU2047', 'Walkability of a City', 'TBD', 'Department of GTSU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSU2055', 'To Fear or Not To Fear: The Coming of AI and What It Means for Our Communities', 'TBD', 'Department of GTSU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSU2056', 'People and the Environment', 'TBD', 'Department of GTSU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GTSU2067', 'Uplifting Communities with Financial Literacy', 'TBD', 'Department of GTSU', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;

-- HKBU Sem2 Courses Part 4
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HIST1105', 'China in the Imperial Age', 'TBD', 'History', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HIST3106', 'Current Issues in Hong Kong and China', 'TBD', 'History', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HIST3116', 'Foreign Relations of Modern China', 'TBD', 'History', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HIST3136', 'Intangible Cultural Heritage in Hong Kong and South China', 'TBD', 'History', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HIST3206', 'History of Southeast Asia', 'TBD', 'History', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HIST3225', 'Europe since the First World War', 'TBD', 'History', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HIST3227', 'Modern History of Singapore', 'TBD', 'History', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HIST3306', 'International Relations After 1945', 'TBD', 'History', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HIST3315', 'Modern Japan and the West', 'TBD', 'History', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HIST3405', 'Historical Theory and Practice', 'TBD', 'History', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HIST3406', 'Information Technologies and Quantitative Methods for Historical Studies', 'TBD', 'History', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HIST4105', 'History of Chinese Women since 1912', 'TBD', 'History', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HIST4317', 'Global History of Tourism', 'TBD', 'History', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HIST4406', 'Topic Studies in Cultural History - Hong Kong Cinema as Historical Heritage', 'TBD', 'History', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HIST4898', 'Honours Project', 'TBD', 'History', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HIST4899', 'Honours Project', 'TBD', 'History', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HRMN3007', 'Applied Social Psychology in Organisations', 'TBD', 'Human Resources', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HRMN3025', 'Occupational Health and Employee Wellness', 'TBD', 'Human Resources', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HRMN3026', 'Human Resources Management Internship', 'TBD', 'Human Resources', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HRMN3027', 'Human Resources Management Mentoring', 'TBD', 'Human Resources', 0, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HRMN4005', 'Performance Appraisal and Rewards', 'TBD', 'Human Resources', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HRMN4006', 'Employment Law and Practices', 'TBD', 'Human Resources', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HSWB4899', 'Honours Project II', 'TBD', 'Department of HSWB', 6, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HUMN1006', 'Introduction to the Humanities', 'TBD', 'Humanities', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HUMN2006', 'Human Self-Discovery', 'TBD', 'Humanities', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HUMN2025', 'Gender: Theory and Culture', 'TBD', 'Humanities', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HUMN2026', 'Globalization and Culture', 'TBD', 'Humanities', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HUMN3006', 'Great Works in the Humanities', 'TBD', 'Humanities', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HUMN3007', 'Language and the Humanities', 'TBD', 'Humanities', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HUMN3015', 'The Making of the Contemporary World', 'TBD', 'Humanities', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HUMN3016', 'Professional Writing Practicum: Essentials of the Craft of Writing', 'TBD', 'Humanities', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HUMN3085', 'Acting: Theory and Practice', 'TBD', 'Humanities', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HUMN4025', 'Cultural Studies', 'TBD', 'Humanities', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HUMN4027', 'The Double Face of Creativity: Fact and Fiction', 'TBD', 'Humanities', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HUMN4037', 'Special Topic in Arts and Creativity', 'TBD', 'Humanities', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HUMN4045', 'Special Topic in Theory and Culture', 'TBD', 'Humanities', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HUMN4899', 'Honours Project II', 'TBD', 'Humanities', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('IMPP3005', 'Innovations in Publishing: Exploring Emerging Media and Technologies', 'TBD', 'Department of IMPP', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('IMPP3015', 'Strategic Message Design', 'TBD', 'Department of IMPP', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ISEM2005', 'Management Information Systems', 'TBD', 'Information Systems', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ISEM2006', 'Programming for Business Applications using Python', 'TBD', 'Information Systems', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ISEM3005', 'Business Systems Analysis and Design', 'TBD', 'Information Systems', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ISEM3026', 'ISEM Internship', 'TBD', 'Information Systems', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ISEM3027', 'Introduction to App Development and Mobile User Experience Design', 'TBD', 'Information Systems', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ISEM4017', 'Consumer Insight: Online Customer Data Analytics and Machine Learning Approaches', 'TBD', 'Information Systems', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ISEM4025', 'Information Systems Auditing', 'TBD', 'Information Systems', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ISEM4035', 'Blockchain: Cryptocurrencies and Other Business Applications', 'TBD', 'Information Systems', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ITEC3015', 'Web Development for Data Storytellers', 'TBD', 'Department of ITEC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ITS 1019', 'Transdisciplinary Guided Study II', 'TBD', 'Department of ITS', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ITS 2005', 'Transdisciplinary Inquiries and Methodologies', 'TBD', 'Department of ITS', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ITS 2019', 'Transdisciplinary Problem Solving II', 'TBD', 'Department of ITS', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ITS 2029', 'Global Challenges II', 'TBD', 'Department of ITS', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ITS 3009', 'Transdisciplinary Knowledge Application and Transfer II', 'TBD', 'Department of ITS', 6, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ITS 4899', 'Transdisciplinary Honours Project II', 'TBD', 'Department of ITS', 6, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR2085', 'English News Reporting and Writing', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR2087', 'Multimedia and Multiplatform Journalism with AI Applications', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR2116', 'Finance and Economics for Journalists', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR2117', 'Broadcast Reporting and Production with AI Tools', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR2126', 'Data Journalism', 'TBD', 'Journalism', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR3016', 'Political Economy for Journalists', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR3137', 'Journalism and Communication Theory', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR3145', 'Investigative Reporting (Chinese)', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR3157', 'Journalism in the Age of AI: Law and Ethics', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR3186', 'Generative AI- Assisted Reporting', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR3245', 'Journalism Practicum I (Chinese)', 'TBD', 'Journalism', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR3247', 'Journalism Practicum III (Chinese)', 'TBD', 'Journalism', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR3255', 'Journalism Practicum I (English)', 'TBD', 'Journalism', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR3257', 'Journalism Practicum III (English)', 'TBD', 'Journalism', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR3267', 'Journalism Practicum II (Finance)', 'TBD', 'Journalism', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR3285', 'Financial Data and Market Sentiment Analysis', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR3287', 'Social Media Content Management', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR3295', 'Journalism Practicum II (Broadcast)', 'TBD', 'Journalism', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR3297', 'Journalism Practicum IV (English)', 'TBD', 'Journalism', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR3305', 'Journalism Practicum I (Data)', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR3307', 'Journalism Practicum III (Data)', 'TBD', 'Journalism', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR4045', 'Entrepreneurial Journalism', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR4056', 'Media Management', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR4057', 'International News in a Globalized World', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR4065', 'Strategic Investments and Contemporary Economics', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR4066', 'News Documentary', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR4075', 'Socially Conscious Documentary: Research, Ethics, and Production', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR4845', 'Honours Project in Broadcast Journalism', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR4855', 'Honours Project in Data and Media Communication', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR4865', 'Honours Project in Chinese Journalism', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR4875', 'Honours Project in Financial Journalism', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR4885', 'Honours Project in International Journalism', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JPSE1005', 'Japanese I', 'TBD', 'Japanese', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JPSE1006', 'Japanese II', 'TBD', 'Japanese', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JPSE1007', 'Exploring Japanese Language, Culture and Society', 'TBD', 'Japanese', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JPSE2006', 'Japanese IV', 'TBD', 'Japanese', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JPSE3006', 'Business Japanese', 'TBD', 'Japanese', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JPSE3007', 'Japanese VI', 'TBD', 'Japanese', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG0036', 'Enhancing English through Global Citizenship', 'TBD', 'Language', 0, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG1005', 'Elementary Putonghua', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG1006', 'Intermediate Putonghua', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG1015', 'Creative Writing in Chinese', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG1026', 'Practical Putonghua 實用普通話', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG1035', 'Foundation Cantonese I', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG1036', 'Foundation Cantonese II', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG1045', 'Engaging Communicative Activities and Language Teaching for Service-Learning Abroad 海外服務學習：互動交流與語言教學', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG1105', 'Introductory Mandarin for Non-Chinese Speakers (Part I)', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG1106', 'Introductory Mandarin for Non-Chinese Speakers (Part II)', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG1107', 'Introductory Cantonese for Non-Chinese Speakers', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG2005', 'Creative Writing Through Masterpieces', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG2016', 'Interpersonal Putonghua', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG2027', 'Applied Cantonese II 應用粵語 (二)', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG2045', 'Language Online: Unearthing Controversial Narratives on the Web', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG2046', 'Comprehension of Modern Spoken English: Culture and Context', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG2056', 'Putonghua Public Speaking', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG2065', 'Chinese Language Application and Culture in Hong Kong 香港語言應用與文化', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG2075', 'Hong Kong Literature Workshop 香港文學工作坊', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG3007', 'Modern and Contemporary Theatre: Appreciation and Playwriting', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LLAW3007', 'Principles of Law', 'TBD', 'Law', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH1005', 'Calculus I', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH1025', 'Understanding Mathematics and Statistics', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH2005', 'Calculus, Probability, and Statistics for Computer Science', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH2006', 'Calculus, Probability, and Statistics for Science', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH2207', 'Linear Algebra I', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH2215', 'Mathematical Analysis', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH2216', 'Statistical Methods and Theory', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH2225', 'Calculus II', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH3205', 'Operations Research I', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH3407', 'Linear Algebra II', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH3606', 'Differential Equations II', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH3616', 'Scientific Computing II', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH3806', 'Multivariate Statistical Methods', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH3845', 'Interest Theory and Applications', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH4225', 'Foundation of Big Data and Learning', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH4615', 'Numerical Linear Algebra', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH4665', 'Special Topics in Applied Mathematics I - Advanced Numerical Methods & Algorithms', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH4816', 'Optimization Theory and Techniques', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH4826', 'Time Series and Forecasting', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG2005', 'Marketing Management', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG3005', 'Marketing Research Methods', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG3006', 'Global Marketing', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG3007', 'Consumer Behaviour', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG3015', 'Socially Responsible Marketing', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG3016', 'Marketing Internship', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG3017', 'Services Marketing', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG3025', 'Integrated Marketing Communications', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG3026', 'Strategic Digital Marketing', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG3056', 'Social Media Marketing', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG3057', 'Seminar in MarTech and Business Intelligence', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG4005', 'Strategic Marketing', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG4057', 'Agribusiness: Marketing and Entrepreneurship', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUSI1009', 'Applied Music II', 'TBD', 'Music', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUSI1015', 'Musicianship II', 'TBD', 'Music', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUSI1016', 'Theory and Structure of Music II', 'TBD', 'Music', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUSI1019', 'Ensemble II', 'TBD', 'Music', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUSI1026', 'Chinese Music II', 'TBD', 'Music', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUSI1029', 'Music Colloquium II', 'TBD', 'Music', 0, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUSI1039', 'Music Theory II', 'TBD', 'Music', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUSI1045', 'Introduction to Film Music', 'TBD', 'Music', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUSI1046', 'Introduction to Pop Music', 'TBD', 'Music', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUSI1049', 'Composition for Screen II', 'TBD', 'Music', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUSI1059', 'Instrumental / Vocal Techniques for Songwriters II', 'TBD', 'Music', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUSI2005', 'Chamber Music I', 'TBD', 'Music', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUSI2007', 'Group Instrument/ Vocal Study I', 'TBD', 'Music', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUSI2009', 'Applied Music IV', 'TBD', 'Music', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUSI2017', 'Chamber Music II', 'TBD', 'Music', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUSI2019', 'Ensemble IV', 'TBD', 'Music', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUSI2026', 'Group Instrument/ Vocal Study II', 'TBD', 'Music', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUSI2027', 'Composition I', 'TBD', 'Music', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD1025', 'Supervised Practicum I 專題實習 I (藥用植物學)', 'TBD', 'Chinese Medicine', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD1027', 'Medicinal Botany II 藥用植物學 II', 'TBD', 'Chinese Medicine', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD1055', 'Organic Chemistry II 有機化學II', 'TBD', 'Chinese Medicine', 4, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD1056', 'Organic Chemistry Laboratory II 有機化學實驗II', 'TBD', 'Chinese Medicine', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD1057', 'Biomedical Sciences Laboratory IIB 生物醫學實驗 IIB', 'TBD', 'Chinese Medicine', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD1065', 'Molecular Biology and Biochemistry 分子生物學及生物化學', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD1066', 'Biomedical Sciences Laboratory I 生物醫學實驗 I', 'TBD', 'Chinese Medicine', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD1067', 'Anatomy and Physiology 解剖及生理學', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD2005', 'Chinese Medicinal Formulae 方劑學', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD2006', 'Phytochemistry 中藥化學', 'TBD', 'Chinese Medicine', 4, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD2007', 'Phytochemistry Laboratory 中藥化學實驗', 'TBD', 'Chinese Medicine', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD2037', 'Resources of Chinese Medicinal Plants 中藥資源學', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD3006', 'Pharmacology and Toxicology 藥理學與毒理學', 'TBD', 'Chinese Medicine', 4, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD3016', 'Authentication of Chinese Materia Medica 中藥鑒定學', 'TBD', 'Chinese Medicine', 4, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD3017', 'Authentication of Chinese Materia Medica Laboratory 中藥鑒定學實驗', 'TBD', 'Chinese Medicine', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD3025', 'Biopharmaceutics 生物藥劑學', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD4017', 'Unique Processing Methods of Chinese Medicines 中藥炮製學', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD4025', 'Supervised Practicum III 專題實習 III', 'TBD', 'Chinese Medicine', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD4036', 'Licensing Training for Pharmacist in Chinese Medicines 中藥師執業訓練', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PCMD4899', 'Honours Project 專題論文報告', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PERM1006', 'Human Anatomy and Physiology', 'TBD', 'Physical Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PERM1015', 'History and Philosophy of Physical Education, Sport and Recreation', 'TBD', 'Physical Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PERM1306', 'Conditioning and Fitness', 'TBD', 'Physical Education', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PERM1307', 'Dance', 'TBD', 'Physical Education', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PERM1317', 'Outdoor Pursuits', 'TBD', 'Physical Education', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PERM1425', 'Badminton', 'TBD', 'Physical Education', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PERM1435', 'Table-Tennis', 'TBD', 'Physical Education', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PERM2007', 'Tests and Measurement', 'TBD', 'Physical Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PERM3006', 'Research Methods', 'TBD', 'Physical Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PERM3015', 'Recreation Programming and Event Management', 'TBD', 'Physical Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PERM3025', 'Kinesiology', 'TBD', 'Physical Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PERM3026', 'Nutrition and Health', 'TBD', 'Physical Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PERM3046', 'Theory and Practice in Sport and Recreation Management', 'TBD', 'Physical Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PERM3057', 'Internship - Overseas Placement', 'TBD', 'Physical Education', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PERM4005', 'Facility Management', 'TBD', 'Physical Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PERM4007', 'Leadership and Communication in Sport and Recreation', 'TBD', 'Physical Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PERM4017', 'Principles and Practice of Exercise and Weight Management', 'TBD', 'Physical Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PERM4899', 'Honours Project', 'TBD', 'Physical Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('POLS1005', 'Foundations of Political Science', 'TBD', 'Political Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('POLS2015', 'Government and Politics of Hong Kong', 'TBD', 'Political Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('POLS2016', 'Social Movements and Contentious Politics', 'TBD', 'Political Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('POLS2025', 'Foundations of Political Philosophy', 'TBD', 'Political Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('POLS2026', 'Ethics, Social Well-being, and Public Health', 'TBD', 'Political Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('POLS3006', 'Statistical and Survey Methods for Political Science', 'TBD', 'Political Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('POLS3017', 'Government and Politics of China', 'TBD', 'Political Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('POLS3225', 'Religion and Politics', 'TBD', 'Political Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('POLS3236', 'Gender and Politics', 'TBD', 'Political Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('POLS4226', 'Public Policy and Governance', 'TBD', 'Political Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('POLS4247', 'Comparative Electoral and Party Politics', 'TBD', 'Political Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('POLS4899', 'Honours Project', 'TBD', 'Political Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('RELI1005', 'Quest for Truth and Meaning', 'TBD', 'Religion', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('RELI2027', 'Introduction to Chinese Philosophy and Religion', 'TBD', 'Religion', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('RELI2035', 'Introduction to Ethics', 'TBD', 'Religion', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('RELI2036', 'Social Scientific Study of Religion', 'TBD', 'Religion', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('RELI3026', 'Christianity, Humanism & the Contemporary World', 'TBD', 'Religion', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('RELI3065', 'History of Modern Western Philosophy', 'TBD', 'Religion', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('RELI3077', 'Religion and Social Movements', 'TBD', 'Religion', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('RELI3106', 'Religion and Modern Chinese Societies', 'TBD', 'Religion', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('RELI3107', 'Chinese Moral and Political Philosophy', 'TBD', 'Religion', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('RELI3115', 'Theological Ethics', 'TBD', 'Religion', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('RELI3126', 'Theology, Liberalism and Sex in Chinese Societies', 'TBD', 'Religion', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('RELI3235', 'AI and Good Life: Global Perspectives', 'TBD', 'Religion', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('RELI4015', 'Mysticism and Religious Experience', 'TBD', 'Religion', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('RELI4898', 'Honours Project', 'TBD', 'Religion', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('RELI4899', 'Honours Project', 'TBD', 'Religion', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('REMT3006', 'Smart Retailing', 'TBD', 'Retailing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SIMT3006', 'Sports Economics and Financial Management', 'TBD', 'Department of SIMT', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SIMT3007', 'Internship 1', 'TBD', 'Department of SIMT', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOCI1005', 'Invitation to Sociology', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOCI2005', 'Qualitative Methods of Social Research', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOCI2006', 'Social Statistics', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOCI2007', 'Quantitative Methods of Social Research', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOCI2015', 'Classical Social Theory', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOCI2017', 'Popular Culture and Society', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOCI2035', 'Social Inequalities', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOCI3017', 'Health and Society', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOCI3045', 'China and Tourism', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOCI3047', 'Sociology of Consumption', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOCI3057', 'Leisure and Well-being: Coping with Stress', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOCI3065', 'Quantitative Methods of Social Research', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOCI4006', 'Chinese Family and Kinship', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOCI4016', 'Globalization', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOCI4017', 'Management, Organization and Society', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOCI4026', 'Selected Topics in Contemporary Sociology I - Emotions and Society', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOCI4035', 'Selected Topics in the Sociology of China I - ''Higher Education and Chinese Society', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOCI4037', 'Cultural Sociology', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOCI4899', 'Honours Project', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;

-- HKBU Sem2 Courses Part 5 (End Undergraduate)
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOSC1005', 'Internship I', 'TBD', 'Department of SOSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOSC2005', 'Internship II', 'TBD', 'Department of SOSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOSC3005', 'Community and Civic Engagement', 'TBD', 'Department of SOSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOSC3006', 'Global Outreach', 'TBD', 'Department of SOSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK1006', 'Human Development through the Life Span', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK1009', 'Integrative Tutorial I', 'TBD', 'Social Work', 0, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK1015', 'Social Dimensions of Human Societies', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK1025', 'Social Work in Contemporary Society', 'TBD', 'Social Work', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK1027', 'Integrative Tutorial 2 (Service Users in Contexts B)', 'TBD', 'Social Work', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK2006', 'Social Work Intervention and Processes', 'TBD', 'Social Work', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK2009', 'Integrative Tutorial II', 'TBD', 'Social Work', 0, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK2019', 'Skills for Social Work Practice', 'TBD', 'Social Work', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK2029', 'Social Policy', 'TBD', 'Social Work', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK3005', 'Field Practice I', 'TBD', 'Social Work', 10, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK3006', 'Law and Society', 'TBD', 'Social Work', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK3009', 'Integrative Tutorial III', 'TBD', 'Social Work', 0, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK3019', 'Social Work Research', 'TBD', 'Social Work', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK3029', 'Theory and Practice in Social Work: Community Development', 'TBD', 'Social Work', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK3039', 'Theory and Practice in Social Work: Group', 'TBD', 'Social Work', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK3049', 'Theory and Practice in Social Work: Individual', 'TBD', 'Social Work', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK3205', 'Love and Human Sexuality', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK4005', 'Administration in Human Service Organizations', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK4008', 'Field Practice II', 'TBD', 'Social Work', 5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK4009', 'Field Practice II', 'TBD', 'Social Work', 5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK4019', 'Integrative Tutorial IV', 'TBD', 'Social Work', 0, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK4206', 'Social Work with Older People', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK4215', 'Social Work with Youth', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK4899', 'Social Work Honours Project', 'TBD', 'Social Work', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SPAN1005', 'Spanish I', 'TBD', 'Spanish', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SPAN1006', 'Spanish II', 'TBD', 'Spanish', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SPAN2006', 'Spanish IV', 'TBD', 'Spanish', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SPAN3006', 'Spanish Language, Culture and Society', 'TBD', 'Spanish', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRAN1005', 'Introduction to Translation', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRAN2006', 'Linguistics for Translators', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRAN2035', 'Translation, Museums and Intercultural Representation', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRAN3055', 'Interpreting Technology', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRAN3066', 'Video Game Localization', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRAN4005', 'Theories and Philosophies I', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRAN4037', 'Translation and Intercultural Studies', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRAN4046', 'Placement Portfolio I', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRAN4047', 'Translation Workshop', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRAN4075', 'Machine Learning, Artificial Intelligence and Translation', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRAN4899', 'Honours Project (Translation/Thesis)', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCHL1016', 'CrossFit: Cross-bridge of Fitness and Health', 'TBD', 'Department of UCHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCHL1025', 'Have a Field Day: Outdoor Team Games', 'TBD', 'Department of UCHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCHL1026', 'Home-Based Exercises: A Family Experience', 'TBD', 'Department of UCHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCHL1027', 'Mind and Body Exercises: Stretching and Pilates', 'TBD', 'Department of UCHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCHL1036', 'Table Tennis: A Brainy Workout', 'TBD', 'Department of UCHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCHL1037', 'Hand-eye Rally: Tennis, Taspony and Pickleball', 'TBD', 'Department of UCHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCHL1045', 'When Traditional Tai Chi Meets Modern Health and Fitness', 'TBD', 'Department of UCHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCHL1046', 'Whip it or Spin it: Badminton and Flyball', 'TBD', 'Department of UCHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCHL1047', 'Healthy Lifestyle in Action', 'TBD', 'Department of UCHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCHL1056', 'Practice of Health Preservation and Management in Traditional Chinese Medicine 中醫養生與健康管理實踐', 'TBD', 'Department of UCHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCHL1057', 'The Art of Mindfulness', 'TBD', 'Department of UCHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCHL1065', 'E-sports and Health', 'TBD', 'Department of UCHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCHL1066', 'Improving Mental Health for University Success', 'TBD', 'Department of UCHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCHL1075', 'Communicating Health and Healthy Lifestyle', 'TBD', 'Department of UCHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCHL1076', 'Health through Balance: Achieving Physical, Social and Emotional Wellbeing', 'TBD', 'Department of UCHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCHL1077', 'Understanding Numbers, Improving Health', 'TBD', 'Department of UCHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCHL1085', 'Smart Devices for Personal Healthcare', 'TBD', 'Department of UCHL', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCLC1005', 'University Chinese', 'TBD', 'Department of UCLC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCLC1008', 'University English I', 'TBD', 'Department of UCLC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCLC1009', 'University English II', 'TBD', 'Department of UCLC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCLC1015', 'Chinese I', 'TBD', 'Department of UCLC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCLC1016', 'University Chinese (Syllabus B)', 'TBD', 'Department of UCLC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCLC1017', 'Chinese II', 'TBD', 'Department of UCLC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('UCPN1005', 'The Art of Persuasion', 'TBD', 'Department of UCPN', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART1006', 'Visual Arts Practice II', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART1306', 'Arts and Its Histories II', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2306', 'Art in the 20th Century II', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2337', 'Visual Arts Work Experience', 'TBD', 'Visual Arts', 0, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2635', 'Drawing on Location and Collage', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2637', 'Painting Materials and Methods from Observation', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2645', 'Chinese Calligraphy', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2646', 'Chinese Seal Engraving', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2647', 'Chinese Gongbi Painting', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2655', 'Chinese Landscape Painting', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2656', 'Analogue Photography', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2657', 'Digital Photography', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2666', 'Sound Basics and Sound Editing', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2667', 'Video Editing', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2687', 'Illustration', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2696', 'Graphic Design', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2697', 'Screenprinting', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2706', 'Glass Blowing', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2715', 'Fundamental Hand-building and Wheel-throwing Techniques for Ceramics', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2717', 'Small Metal Jewellery', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2725', 'Wearables', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2726', '3D Software Fundamentals and Prototyping', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2737', 'Digital Modelling and Fabrication for Sculpture', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART2745', 'Abstract Painting', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART3377', 'Studio: Drawing and Painting', 'TBD', 'Visual Arts', 9, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART3385', 'Studio: Chinese Arts', 'TBD', 'Visual Arts', 9, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART3386', 'Studio: Audio-Visual Practices in Media Arts', 'TBD', 'Visual Arts', 9, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART3387', 'Studio: Sculpture', 'TBD', 'Visual Arts', 9, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART3395', 'Studio: Graphic Design', 'TBD', 'Visual Arts', 9, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART3397', 'Studio: Object Culture', 'TBD', 'Visual Arts', 9, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART3427', 'Studio: Ceramics', 'TBD', 'Visual Arts', 9, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART3437', 'Studio: Printmaking', 'TBD', 'Visual Arts', 9, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART3445', 'Studio: Object Technology (Robotics and Kinetics)', 'TBD', 'Visual Arts', 9, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART3447', '3D Immersive Environment', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART3455', 'Image Processing in Arts and Technology', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART4036', 'Professional Practice for Visual Artists', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART4056', 'Studio Honours Project', 'TBD', 'Visual Arts', 9, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART4126', 'Special Topics in Visual Arts Studies (Curatorial Practice)', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VART4135', 'Special Topics in Visual Arts and Technology II (Character Animation in Unreal Engine)', 'TBD', 'Visual Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('WRIT1005', 'Creativity: Theory & Practice', 'TBD', 'Writing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('WRIT2005', 'Biography Writing', 'TBD', 'Writing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('WRIT2006', 'Food, Wine and Travel Writing for the Leisure Industry', 'TBD', 'Writing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('WRIT2007', 'Editing and Publishing', 'TBD', 'Writing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('WRIT3005', 'Reading Masterpieces and Writing Your Own', 'TBD', 'Writing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('WRIT3006', 'Professional Writing Practicum: Essentials of the Craft of Writing', 'TBD', 'Writing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('WRIT3015', 'Scriptwriting for Theatre', 'TBD', 'Writing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('WRIT3025', 'Big Stories: Writing Long-form Fictional Narratives', 'TBD', 'Writing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('WRIT4006', 'Writing Internship', 'TBD', 'Writing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('WRIT4015', 'The Double Face of Creativity: Fact and Fiction', 'TBD', 'Writing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('WRIT4016', 'Writing Diaspora in a Global World', 'TBD', 'Writing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('WRIT4899', 'Honours Project II', 'TBD', 'Writing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;

-- HKBU Sem2 Courses Part 6 (Postgraduate)
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CTV 7040', 'Film Production II', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CTV 7070', 'Media Management', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CTV 7082', 'MFA Thesis Project II', 'TBD', 'Film', 6, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CTV 7100', 'Script Writing', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CTV 7120', 'Creativity Workshop', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CTV 7130', 'Comedy: Theory and Practice', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CTV 7160', 'Documentary Film Production', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CTV 7170', 'Advanced Dramatic Film/TV Production', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CTV 7240', 'Film Theory and Criticism', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CTV 7370', 'Cinematography for Directors', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CTV 7410', 'Digital Media Production', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CTV 7440', 'Television Drama Writing', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CTV 7500', 'Film and Literature', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7025', 'Business Economics Internship', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7035', 'Artificial Intelligence for Business', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7055', 'Projects for Data Analytics', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7065', 'Global Sustainable Investing & ESG Integration in Asia Pacific', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7085', 'Cloud Computing for Business Analytics', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7095', 'Topics of ESG and Sustainability in Economics and Finance', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7130', 'Principles and Applications of Sustainable Finance and Investment', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7135', 'Data Solutions to Social Problems', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7145', 'Environmental Cost and Benefit Analysis', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7155', 'Economic and Financial Management in Family Office', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7250', 'Financial Economics', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7290', 'Database Management with AI', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7350', 'Corporate Finance and Governance in China', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7850', 'Economics of Digital Markets', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7910', 'Data Visualization with Story-telling', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7930', 'Analytics for Spatial, Textual and Social Network Data', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7940', 'Data-driven Decision Making', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7950', 'Business and Economic Forecasting with Big Data', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7960', 'User Experience and A/B Testing', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7970', 'Applied Predictive Modeling', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7990', 'Data Analytics for Smart Cities', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG7520', 'Urban & Regional Development of China', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG7540', 'Sustainable Energy & Technological Innovation in China', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG7620', 'Geospatial Analytics, AI and Big Data for Smart, Resilient and Sustainable Cities', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG7640', 'Geopolitics in Smart, Resilient and Sustainable Cities', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG7650', 'The Built Environment, Transport Choice and Wellbeing', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LSE 7040', 'Values&Socio-Cultural Issues in HK Today', 'TBD', 'Liberal Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LSE 7060', 'Globalization: Cultural & Ethical Issues', 'TBD', 'Liberal Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LSE 7111', 'Dissertation', 'TBD', 'Liberal Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LSE 7130', 'Social Justice', 'TBD', 'Liberal Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LSE 7150', 'Human Rights in a Multicultural World', 'TBD', 'Liberal Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH7720', 'Investment Management', 'TBD', 'Mathematics', 4, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH7760', 'Programming for Finance and Trading', 'TBD', 'Mathematics', 4, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG7180', 'Seminars in Contemporary Marketing Issues in Creative Economies', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG7190', 'Creative Service-Learning Project', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG7200', 'Field Trip', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG7210', 'Services Marketing Management', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PHYS7330', 'Renewable Energy Technologies II', 'TBD', 'Department of PHYS', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PHYS7371', 'Project in Green Technology', 'TBD', 'Department of PHYS', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PHYS7420', 'Energy Usage, the Environment and Sustainability', 'TBD', 'Department of PHYS', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PHYS7460', 'Advances in Displays and Lighting', 'TBD', 'Department of PHYS', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PHYS7550', 'Smart Grids and Sustainable Power Systems', 'TBD', 'Department of PHYS', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VACC7020', 'Visual Arts Theory and Criticism', 'TBD', 'Department of VACC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VACC7040', 'Arts & the Public: Interpretation & Presentation', 'TBD', 'Department of VACC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('A.F.7410', 'Financial Management for Film, Television & New Media', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('A.F.7420', 'Promotion, Advertising & Distribution for Film, Television & New Media', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('A.F.7430', 'Law, and Film, Television & New Media', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('A.F.7460', 'Overview of New Media Contents & Its Future: Internet Movie, Drama Series & Short Video', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('A.F.7540', 'The Art & Practice of Digital Media', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('A.F.7580', 'Graduate Seminar on a Director''s Palette', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('A.F.7590', 'Digital Multimedia Communication', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('A.F.7610', 'Film Festival and Film Programme Curation', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('A.F.7620', 'Future Filmmaking and Technologies', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT7060', 'Accounting for Managers', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('AIDM7010', 'Media Psychology', 'TBD', 'Digital Media', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('AIDM7020', 'AI and Big Data Applications in Financial Market Analytics', 'TBD', 'Digital Media', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('AIDM7040', 'Generative AI for Digital Media', 'TBD', 'Digital Media', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('AIDM7340', 'AI for Digital Media', 'TBD', 'Digital Media', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('AIDM7350', 'AI and Digital Media Workshop', 'TBD', 'Digital Media', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('AIDM7380', 'Recommender Systems for Digital Media', 'TBD', 'Digital Media', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('AIDM7400', 'Data Analysis and Visualization Studio', 'TBD', 'Digital Media', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('AIDM7410', 'Computational Journalism', 'TBD', 'Digital Media', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('AIDM7420', 'News and Feature Writing for Digital Media', 'TBD', 'Digital Media', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('AIDM7460', 'Digital Media Research Project', 'TBD', 'Digital Media', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('AIDM7480', 'Selected Topics in Psychology of Social Media', 'TBD', 'Digital Media', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('AIDM7860', 'Human-Computer Interaction and User Experience', 'TBD', 'Digital Media', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('AIDM7880', 'AI for Social Good: Laws, Ethics, and Methods', 'TBD', 'Digital Media', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ARTD7020', 'RPG Critical Theory Seminar in the Arts and Humanities', 'TBD', 'Arts', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL7130', 'Neurobiology', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL7150', 'Developmental Biology', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL7160', 'RPg Seminars and Special Topics', 'TBD', 'Biology', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL7190', 'Sustainable Urban Environment', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL7200', 'Advanced Topics in Cell and Molecular Biology', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BIOL7210', 'Advanced Plant Molecular Biology', 'TBD', 'Biology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUS 7020', 'Strategic Executive Development', 'TBD', 'Business', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUS 7470', 'Business Field Study', 'TBD', 'Business', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUS 7762', 'Research Seminar', 'TBD', 'Business', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUS 7772', 'Research Seminar', 'TBD', 'Business', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUS 7782', 'Research Seminar', 'TBD', 'Business', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUS 7792', 'Research Seminar', 'TBD', 'Business', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUSD7021', 'MScBM Capstone Project I', 'TBD', 'Department of BUSD', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUSD7022', 'MScBM Capstone Project II', 'TBD', 'Department of BUSD', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM7220', 'Chemical Instrumentation', 'TBD', 'Chemistry', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM7250', 'Laboratory Management', 'TBD', 'Chemistry', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM7332', 'Dissertation', 'TBD', 'Chemistry', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM7350', 'Sample Pretreatment Methods', 'TBD', 'Chemistry', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM7402', 'Seminars', 'TBD', 'Chemistry', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM7404', 'Seminars', 'TBD', 'Chemistry', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM7412', 'Advanced Analytical Laboratory', 'TBD', 'Chemistry', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM7440', 'Biomedical Analysis', 'TBD', 'Chemistry', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM7745', 'Research Postgraduate Seminars', 'TBD', 'Chemistry', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM7790', 'Organic Synthesis', 'TBD', 'Chemistry', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM7860', 'Advanced Instrumental Analysis', 'TBD', 'Chemistry', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM7880', 'Spectroscopic Techniques for Structure Determination', 'TBD', 'Chemistry', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHEM7990', 'Separation Science', 'TBD', 'Chemistry', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHI 7012', 'Research Method & Seminar 研究方法及研討會', 'TBD', 'Chinese', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHI 7020', 'Selected Masterpieces of Chinese Literature 中國文學名著研究 - 牡丹亭', 'TBD', 'Chinese', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHI 7260', 'Special Topics in Modern&Contemp Chi Lit 中國現當代文學專題研究 - 香港文學', 'TBD', 'Chinese', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHI 7340', 'Special Topics in Chinese Language 中國語文專題研究 - 隱喻理論', 'TBD', 'Chinese', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHI 7390', 'Project Report 研究報告', 'TBD', 'Chinese', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHI 7530', 'Masterpieces in Chinese Historiography (Thought and Culture) 中國史學名篇(思想文化) - 左傳與史記', 'TBD', 'Chinese', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('CHI 7690', 'Special Topic in Chinese Literature and Culture (Classical Literature) 中國文學與文化專題 - 飲食文學與文化', 'TBD', 'Chinese', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMD7040', 'Proseminar', 'TBD', 'Department of COMD', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMD7090', 'Advanced Qualitative Communication Research Methods', 'TBD', 'Department of COMD', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMD7100', 'Advanced Quantitative Communication Research Methods', 'TBD', 'Department of COMD', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMD7140', 'Gender and Sexuality in the Media', 'TBD', 'Department of COMD', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMD7220', 'Freedom of Expression and Censorship', 'TBD', 'Department of COMD', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMD7250', 'China in the Global Media Sphere', 'TBD', 'Department of COMD', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMD7270', 'AI and Machine Learning for Media and Communication Research', 'TBD', 'Department of COMD', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7050', 'Media & Comm in Chinese Societies', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7060', 'Issues in Corporate Communication', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7130', 'Globalization of Media & Communications', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7160', 'Organizational Communication', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7170', 'Communication Campaign Workshop', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7190', 'Issues and Cases in Mass Communication', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7210', 'Project', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7250', 'Strategic Public Relations & Crisis Mgnt', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7290', 'Professional Application Project', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7300', 'Consumer Insights', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7310', 'International Advertising', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7320', 'AI Imaginaries and Communication Research', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7560', 'Political Communication & Public Opinion', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7580', 'Social Media Marketing', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7610', 'Social Services Marketing and Communication', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7620', 'Social Media and Online Social Networks', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7630', 'Qualitative Research Methods', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7640', 'Introduction to the Chinese Internet', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7770', 'Data Visualization', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7780', 'Big Data Analytics for Media and Communication', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7790', 'Communication and Technology', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7810', 'Branding', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7830', 'Media Communications and Psychology', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7900', 'Media Convergence: Theory and Practice', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7910', 'Health Communication', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7940', 'Interactive Media Studies Workshop', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7950', 'Interactive Media Economy', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMM7960', 'AI for Interactive Media Design', 'TBD', 'Communication', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7040', 'Advanced Topics in Computer Vision and Pattern Recognition', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7045', 'Natural Language Processing and Large Language Models', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7055', 'Computer Vision', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7065', 'Innovative Laboratory', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7080', 'Postgraduate Seminar', 'TBD', 'Computer Science', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7095', 'Big Data Management', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7115', 'Digital Experience Design', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7125', 'Prompt Engineering for Generative AI', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7170', 'Data Security and Privacy', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7200', 'Blockchain and Cryptocurrencies', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7240', 'Recommender Systems', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7250', 'Machine Learning', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7270', 'Web and Mobile Programming', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7280', 'MSc Practicum', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7300', 'Financial Technology', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7530', 'IT Forum', 'TBD', 'Computer Science', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7540', 'IT Management: Principles & Practice', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7640', 'Database Systems & Administration', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7650', 'Data Mining & Knowledge Discovery', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7730', 'MSc Project', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7780', 'Special Topics in Knowledge & Info Mgnt', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7800', 'Analytic Models in IT Management', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7810', 'Business Intelligence', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7850', 'Information Security Management', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7870', 'IT Innovation Management and Entrepreneurship', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7880', 'E-Business Strategies', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7930', 'Big Data Analytics', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7940', 'Cloud Computing', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7960', 'MSc Research I', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7970', 'MSc Research II', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('COMP7980', 'Dynamic Web and Mobile Programming', 'TBD', 'Computer Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7115', 'Structural Models and Numerical Methods in Economics', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7125', 'Text as Data', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7540', 'Graduate Workshops on China''s Economy', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7550', 'Financial Markets and Corporate Governance in China', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDPY7050', 'Social Psychology', 'TBD', 'Psychology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDPY7060', 'Cognitive Psychology and Applications', 'TBD', 'Psychology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDPY7070', 'Historical and Contemporary Issues in Psychology', 'TBD', 'Psychology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDUC7110', 'Psychology of Adolescence', 'TBD', 'Education', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDUC7230', 'Advanced Communication Skills', 'TBD', 'Education', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDUC7550', 'Prob Behaviors in Children & Adolescents', 'TBD', 'Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDUC7610', 'Data Analysis for Education', 'TBD', 'Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDUC7621', 'Dissertation', 'TBD', 'Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDUC7622', 'Dissertation', 'TBD', 'Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDUC7670', 'Lexis, Morphology and Semantics', 'TBD', 'Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDUC7700', 'Psy&Sociolinguistics in EngLang Teaching', 'TBD', 'Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDUC7710', 'Literature and Language Arts', 'TBD', 'Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDUC7800', 'Athletics and Swimming in Schools', 'TBD', 'Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDUC7810', 'Dances & Gymnastics in Schools', 'TBD', 'Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDUC7870', 'Self & Personal Development', 'TBD', 'Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDUC7880', 'Globalization Studies', 'TBD', 'Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDUC7930', 'Supervised Teaching Practice Assessment', 'TBD', 'Education', 4, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDUD7184', 'Doctor of Education Thesis IV', 'TBD', 'Education', 10.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDUM7310', 'Introduction to Theories of Curriculum & Assessment', 'TBD', 'Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDUM7530', 'Assessment and Curricular Adaptation for Inclusive Education Settings', 'TBD', 'Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EDUM7550', 'Educational Psychology', 'TBD', 'Education', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENG 7340', 'World Literatures in Modern Times', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENG 7360', 'The Ecocritical Imagination', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENG 7390', 'Advanced Topic in Literary and Comparative Studies - Hong Kong Literature in English', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENG 7400', 'Advanced Topic in Genre Studies - Modern Short Fiction and Creative Non-fiction', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENG 7420', 'MA Thesis', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ENG 7750', 'Global Shakespeare', 'TBD', 'English', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EPHM7020', 'Management of Public Health Risks', 'TBD', 'Environmental Management', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EPHM7040', 'Land & Water Resources Management', 'TBD', 'Environmental Management', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EPHM7070', 'Environmental Monitoring, Assessment, Research and Reporting', 'TBD', 'Environmental Management', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EPHM7311', 'MSc Dissertation', 'TBD', 'Environmental Management', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EPHM7312', 'MSc Dissertation', 'TBD', 'Environmental Management', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EPHM7330', 'Food Quality, Law and Safety Management', 'TBD', 'Environmental Management', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EPHM7340', 'Carbon and Energy Management', 'TBD', 'Environmental Management', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('EURO7160', 'Current Issues of European Integration', 'TBD', 'European Studies', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FASS7602', 'Transdisciplinary Research Seminar for Doctoral Students', 'TBD', 'Social Sciences', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM7012', 'Research Seminar II', 'TBD', 'Film', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM7014', 'Research Seminar IV', 'TBD', 'Film', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM7016', 'Research Seminar VI', 'TBD', 'Film', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FILM7030', 'Research Methods', 'TBD', 'Film', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FIN 7250', 'Corporate Financial Management', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FIN 7940', 'Corporate Finance and Governance', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG7520', 'Urban & Regional Development of China', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('GEOG7540', 'Sustainable Energy & Technological Innovation in China', 'TBD', 'Geography', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HIST7320', 'Contemporary China & Globalization', 'TBD', 'History', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HIST7530', 'Graduate Seminar on Contemp Chi History', 'TBD', 'History', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HIST7570', 'China and Asia since 1900', 'TBD', 'History', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HRM 7030', 'Workforce Planning and Talent Acquisition', 'TBD', 'Human Resources', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HRM 7060', 'Reward Management', 'TBD', 'Human Resources', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HRM 7160', 'Technology for People Management', 'TBD', 'Human Resources', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HRM 7340', 'International Human Resources Management', 'TBD', 'Human Resources', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HRM 7610', 'Human Resources Research, Analytics and Consultancy', 'TBD', 'Human Resources', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HRM 7650', 'Analytics for Talent Management', 'TBD', 'Human Resources', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('HRM 7690', 'HRM Standards for Effective and Sustainable People Management', 'TBD', 'Human Resources', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ITS 7020', 'ITS Doctoral Research Training II', 'TBD', 'Department of ITS', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ITS 7032', 'ITS Research Seminars II', 'TBD', 'Department of ITS', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR7080', 'Current Issues & Case Stds in Int''l News', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR7100', 'Advanced News Writing and Production for International Practice', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR7110', 'Reporting International Conflict', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR7130', 'Project or Dissertation', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR7160', 'Principles of Economics', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR7180', 'Advanced Business News Writing and Production', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR7210', 'Longform Journalism', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR7220', 'Photojournalism', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR7230', 'Broadcast Journalism', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR7240', 'Online and Digital Journalism', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR7250', 'Reporting China and Hong Kong', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR7330', 'Food and Culture Reporting', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR7350', 'Media & Communication in Greater China', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR7360', 'Generative AI Assisted Reporting', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR7380', 'Reporting cryptocurrency and blockchain', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('JOUR7390', 'Reporting Gender Issues', 'TBD', 'Journalism', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG7401', 'Introduction to the Study of Lang I', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG7510', 'Language in Society', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG7570', 'Language and Education', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG7640', 'Grammar of Modern English', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('LANG7720', 'Second Language Pronunciation Pedagogy', 'TBD', 'Language', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH7030', 'Numerical Linear Algebra', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH7050', 'Optimization Theory & Techniques', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH7180', 'Foundation of Big Data and Learning', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH7330', 'Research Seminars', 'TBD', 'Mathematics', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH7350', 'Research Seminars', 'TBD', 'Mathematics', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH7370', 'Research Methods', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH7390', 'Time Series and Forecasting', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MCCP6010', 'Training on Teaching University Students', 'TBD', 'Department of MCCP', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MCCP6020', 'Advanced English for Academic Purposes', 'TBD', 'Department of MCCP', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MCM 7060', 'Formulation Theories and Practices of Chinese Medicinal Formulae 方劑配伍的理論與實踐', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MCM 7070', 'Studies and Applications of the Science of Seasonal Febrile Diseases 温病學說研究與應用', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MCM 7080', 'Examination and Diagnosis of Musculoskeletal Disorders 肌肉骨骼疾患的檢查與診斷', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MCM 7120', 'Clinical Practice - Studies and Applications of Internal Chinese Medicine 實踐研習-中醫內科研究與應用', 'TBD', 'Chinese Medicine', 5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MCM 7150', 'Clinical Practice - Studies and Applications of Acupuncture 實踐研習 - 針灸研究與應用', 'TBD', 'Chinese Medicine', 5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MCM 7180', 'Clinical Practice - Studies and Applications of Orthopaedics, Traumatology and Tui Na 實踐研習-骨傷與推拿研究與應用', 'TBD', 'Chinese Medicine', 5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MCM 7260', 'Dissertation 專題論文', 'TBD', 'Chinese Medicine', 6, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MCM 7280', 'Marketing and Management of Industry for Chinese Medicines 中藥市場及管理', 'TBD', 'Chinese Medicine', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MCM 7290', 'Mechanism of Action and Safe Application of Chinese Medicines 中藥作用機理與安全用藥', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MCM 7300', 'Advances in Chinese Medicines Research 中藥研究進展', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MDD 7020', 'Advances in Chinese Medicines Research 中藥研究進展', 'TBD', 'Drug Discovery', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MDD 7050', 'Translational Medicine and Drug Discovery: Theory & Practice (Chinese Medicines) 轉化醫學與藥物發現：理論與實踐(中藥)', 'TBD', 'Drug Discovery', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MDD 7060', 'Mechanism of Action and Safe Application of Chinese Medicines 中藥作用機理與安全用藥', 'TBD', 'Drug Discovery', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MDD 7100', 'Dissertation 專題論文', 'TBD', 'Drug Discovery', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MDD 7110', 'Formulation Theories and Practices of Chinese Medicinal Formulae 方劑配伍的理論與實踐', 'TBD', 'Drug Discovery', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MDD 7140', 'Practicum 實驗實踐', 'TBD', 'Drug Discovery', 1.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MGNT7090', 'Strategic Management & Business Policy', 'TBD', 'Management', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MGNT7320', 'Leadership Theories and Development', 'TBD', 'Management', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MGNT7350', 'Lessons from Strategic Failures and Critical Thinking for Managers', 'TBD', 'Management', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MGNT7730', 'Frontiers of Leadership Research', 'TBD', 'Management', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MHM 7080', 'Rehabilitative Nursing in Chinese Medicine 中醫康復護理', 'TBD', 'Health Management', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MHM 7090', 'Health Management of Common Urban Diseases 常見都市疾病管理', 'TBD', 'Health Management', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MHM 7100', 'Cosmetology in Chinese Medicine 中醫美容學', 'TBD', 'Health Management', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MHM 7150', 'Constitutional Theory of Chinese Medicine 中醫體質學', 'TBD', 'Health Management', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MHM 7160', 'Practicum 見/實習', 'TBD', 'Health Management', 4, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MHM 7170', 'Formulation Theories & Practices of Chinese Medicinal Formulae 方劑配伍的理論與實踐', 'TBD', 'Health Management', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MHM 7180', 'Dissertation 專題論文', 'TBD', 'Health Management', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKT 7100', 'Management of Integrated Marketing Communications', 'TBD', 'Department of MKT', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKT 7750', 'Branding Strategies in the Digital Age', 'TBD', 'Department of MKT', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG7010', 'Startup Creation Process and Entrepreneurial Ecosystem', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG7020', 'Entrepreneurship, Emerging Technologies, and Business Opportunities', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG7030', 'New Venture Business Planning, Small and Family Business', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG7040', 'Accounting and Finance for Entrepreneurs', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG7050', 'Strategic Management', 'TBD', 'Marketing', 1.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG7060', 'Marketing Planning', 'TBD', 'Marketing', 1.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG7110', 'Social Entrepreneurship and Impact-driven Business', 'TBD', 'Marketing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKTG7130', 'Business Project/ Academic Dissertation', 'TBD', 'Marketing', 15, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MPS 7030', 'Mechanism of Action and Safe Application of Chinese Medicines 中藥作用機理與安全用藥', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MPS 7070', 'Advances in Chinese Medicines Research 中藥研究進展', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MPS 7082', 'Dissertation 專題論文', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MPS 7100', 'Marketing and Management of Industry for Chinese Medicines 中藥市場及管理', 'TBD', 'Chinese Medicine', 2, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MPS 7110', 'Translational Medicine and Drug Discovery: Theory & Practice (Chinese Medicines) 轉化醫學與藥物發現:理論與實踐(中藥)', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MPS 7132', 'Laboratory Practice in Chinese Medicines 中藥實驗實踐', 'TBD', 'Chinese Medicine', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MPS 7150', 'Formulation Theories and Practices of Chinese Medicinal Formulae 方劑配伍的理論與實踐', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUS 7310', 'Choral Pedagogy', 'TBD', 'Music', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUS 7350', 'Piano Pedagogy', 'TBD', 'Music', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUS 7460', 'SourcesGenres&Performance:Historical Per', 'TBD', 'Music', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUS 7480', 'Advanced Studies in Chinese Music', 'TBD', 'Music', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUS 7562', 'Research Seminar II', 'TBD', 'Music', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUS 7572', 'Research Seminar IV', 'TBD', 'Music', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUS 7610', 'Special Topics in Music II - The Art of Improvisation: The Music of Keith Jarrett', 'TBD', 'Music', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUS 7620', 'Special Topics in Music III - Sensibility and Eighteenth-Century Music', 'TBD', 'Music', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUS 7650', 'Guided Reading II', 'TBD', 'Music', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUS 7670', 'Advanced Music Ensemble II', 'TBD', 'Music', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUS 7690', 'Recital Project II', 'TBD', 'Music', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUS 7710', 'Performance Seminar II', 'TBD', 'Music', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MUS 7720', 'Post-Instrumental Practice', 'TBD', 'Music', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PHYS7040', 'Advanced Topics in Physics I - Dynamical Systems with Applications', 'TBD', 'Department of PHYS', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PHYS7060', 'Advanced Topics in Physics III - Advance in Displays and Lighting', 'TBD', 'Department of PHYS', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('PHYS7070', 'Postgraduate Research Seminars', 'TBD', 'Department of PHYS', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('POLS7010', 'Advanced China Studies', 'TBD', 'Political Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('POLS7020', 'E-Government', 'TBD', 'Political Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('POLS7080', 'Fieldwork Learning in China and Overseas Public Administration', 'TBD', 'Political Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('POLS7100', 'Public Affairs and Public Policy', 'TBD', 'Political Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('POLS7140', 'Public Policy & Governance', 'TBD', 'Political Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('POLS7150', 'Ethics & Public Affairs', 'TBD', 'Political Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('REL 7020', 'Selected Masterpieces in Philosophy', 'TBD', 'Religion', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('REL 7080', 'RPG Research Methodology in Religion and Philosophy', 'TBD', 'Religion', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SCI 7780', 'Research Methods', 'TBD', 'Science', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SCM 7030', 'Mandatory Course on Research Methods', 'TBD', 'Chinese Medicine', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SCM 7040', 'Research Seminar', 'TBD', 'Chinese Medicine', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SLM 7020', 'Management Skills and Communications', 'TBD', 'Sport & Leisure', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SLM 7030', 'Management of Human Resources', 'TBD', 'Sport & Leisure', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SLM 7040', 'Planning & Developing S & L Facilities', 'TBD', 'Sport & Leisure', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SLM 7060', 'Financial Management', 'TBD', 'Sport & Leisure', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SLM 7070', 'Seminar on Contemporary Issues in Sport & Leisure', 'TBD', 'Sport & Leisure', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SLM 7140', 'Event Management', 'TBD', 'Sport & Leisure', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOC 7020', 'Adv Sem on Contemp Sociological Issues', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOC 7530', 'Grad Sem on Con Social Issues in China', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOC 7570', 'Chinese Family and Kinship', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOC 7590', 'Popular Culture and Society in Contemporary China', 'TBD', 'Sociology', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOSC7320', 'Debating Global Society', 'TBD', 'Department of SOSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOSC7330', 'Globalizations', 'TBD', 'Department of SOSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOSC7340', 'Global Civil Society', 'TBD', 'Department of SOSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOSC7370', 'Independent Project on Global Society', 'TBD', 'Department of SOSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOSC7400', 'Professional Placement', 'TBD', 'Department of SOSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOSC7440', 'Advanced Quantitative Methods', 'TBD', 'Department of SOSC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7030', 'Critical Management Practice', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7040', 'Research & Programme Evaluation', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7170', 'Youth at the Margins: Theory & Practice', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7210', 'Working with Families with Mental Health Issues', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7230', 'Crisis Mgnt & Integrated MH Practice', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7410', 'Human Diversity and Cultural Difference', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7440', 'Narrative Practice with Specific Youth Groups', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7470', 'Counselling Project', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7500', 'Family Therapy', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7610', 'Society and Social Policy', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7641', 'Social Work Theory & Practice II', 'TBD', 'Social Work', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7642', 'Social Work Theory & Practice II', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7650', 'Management in Human Service Organisations', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7690', 'Social Work Integrative Tutorial II', 'TBD', 'Social Work', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7700', 'Fieldwork Practice I', 'TBD', 'Social Work', 5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7710', 'Fieldwork Practice II', 'TBD', 'Social Work', 5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7720', 'Social Work with Older People', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7730', 'Social Work with Youth', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7780', 'Social Work Integrative Tutorial III', 'TBD', 'Social Work', 1, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7790', 'Mental Health Counselling with Older People', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7801', 'Counselling Practicum I', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7802', 'Counselling Practicum II', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('SOWK7910', 'Cognitive Behavior Therapy Skills Workshop', 'TBD', 'Social Work', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRA 7040', 'Research Methodology', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRA 7080', 'Bilingual Comm:Style,Rhetoric & Delivery', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRA 7110', 'Master Classes in Translation', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRA 7122', 'Dissertation/Project', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRA 7200', 'Conference Interpreting', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRA 7210', 'Advanced Consecutive Interpreting', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRA 7510', 'Required Readings for Translation Stds', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRA 7562', 'Practical and/or Theoretical Projects II', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRA 7570', 'Translation Technology II', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('TRA 7580', 'Audiovisual Translation', 'TBD', 'Translation', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VACC7020', 'Visual Arts Theory and Criticism', 'TBD', 'Department of VACC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VACC7040', 'Arts & the Public: Interpretation & Presentation', 'TBD', 'Department of VACC', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VACD7030', 'CD Studio Project IIA', 'TBD', 'Creative Design', 4.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VACD7040', 'CD Studio Project IIB', 'TBD', 'Creative Design', 4.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VARP7012', 'Research Seminar II', 'TBD', 'Visual Arts', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VARP7022', 'Research Seminar IV', 'TBD', 'Visual Arts', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VARP7032', 'Research Seminar VI', 'TBD', 'Visual Arts', 0.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VASA7030', 'SMA Studio Project IIA', 'TBD', 'Studio Arts', 4.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('VASA7040', 'SMA Studio Project IIB', 'TBD', 'Studio Arts', 4.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('WRIT7010', 'Stylistics and Aesthetics', 'TBD', 'Writing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('WRIT7030', 'Cultural Professionals and Creative Industries', 'TBD', 'Writing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('WRIT7051', 'Master Project', 'TBD', 'Writing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('WRIT7110', 'Writing (for) Performance', 'TBD', 'Writing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('WRIT7120', 'Single Author / Artist Study', 'TBD', 'Writing', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT7025', 'Stakeholder Governance and Compliance', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT7035', 'Sustainability Governance and Reporting', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT7220', 'Strategic Mgnt Accounting & Controls', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT7510', 'Advanced Financial Reporting', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT7620', 'Auditing', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT7760', 'International Taxation', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT7810', 'Securities Regulation', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT7850', 'Contemporary Strategic Management Accounting Issues', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT7860', 'Accounting Theory', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT7910', 'Hong Kong and International Taxation', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT7920', 'Commercial and Company Law', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT7960', 'Interpreting Financial and Accounting Information', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ACCT7980', 'Risk Management', 'TBD', 'Accountancy', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUS 7993', 'DBA Thesis III', 'TBD', 'Business', 6, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUS 7994', 'DBA Thesis IV', 'TBD', 'Business', 6, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('ECON7130', 'Principles and Applications of Sustainable Finance and Investment', 'TBD', 'Economics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FIN 7220', 'Investment and Portfolio Analysis', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FIN 7240', 'Derivative Securities and Risk Management', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FIN 7750', 'FinTech, Digital Transformation and Web 3.0', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FIN 7790', 'Machine Learning for Financial Market Modelling and Analysis', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FIN 7820', 'Applied Financial Econometrics', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FIN 7840', 'Blockchain Engineering and Virtual Assets', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FIN 7900', 'Cybersecurity and Privacy for Financial Technology', 'TBD', 'Finance', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('FIN 7911', 'Applied FinTech Industry Project', 'TBD', 'Finance', 1.5, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH7790', 'Prescriptive Analytics for Decision Making', 'TBD', 'Mathematics', 4, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH7830', 'Machine Learning and Forecasting', 'TBD', 'Mathematics', 4, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH7840', 'Advanced Spreadsheets and Decision Support Systems', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH7920', 'Work-based Learning', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH7941', 'Dissertation I', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MATH7960', 'Applied Multivariate Analysis', 'TBD', 'Mathematics', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('BUSD7140', 'Entrepreneurship and New Venture Development', 'TBD', 'Department of BUSD', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MGNT7240', 'Strategic Management', 'TBD', 'Management', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MGNT7790', 'Sustainable Growth through Mergers & Acquisition', 'TBD', 'Management', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
INSERT INTO public.courses (code, name, instructor, department, credits, rating, review_count) 
VALUES ('MKT 7740', 'Brand Psychology and Digital Marketing', 'TBD', 'Department of MKT', 3, 0, 0) 
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
