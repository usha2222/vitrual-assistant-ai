import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FAQ from './models/faq.model.js'
import connectDb from './config/db.js';

dotenv.config();

const seedFAQs = async () => {
    try {
        await connectDb();
        console.log('Connected to MongoDB');
        await FAQ.deleteMany({}); // Purana data clean or delete karne ke liye

        const faqs = [
            {
                "question": "Who are you?",
                "answer": " I am a voice-enabled virtual assistant for S.D.I.T.S. College. I can help you find answers to your questions related to the college, such as admissions, fees, courses, and placements.",
                "category": "general",
                "keywords": ["identity", "who are you", "assistant", "introduction"],
                "alternateQuestions": ["What is your name?", "Tell me about yourself.", "What do you do?"]
            },
            {
                "question": "Who developed you?",
                "answer": "I was developed by Usha Patel, Rajni Verma, and Priti Patel, final year students of the Computer Science Engineering department of Shree Dadaji Institute of Technology and Science. They created me to assist students with information about the college.",
                "category": "general",
                "keywords": ["developer", "created", "developed", "who made you", "usha", "rajni", "priti"],
                "alternateQuestions": ["Who is your creator?", "Who made you?", "Who are your developers?"]
            },

            {
                question: "What is SDITS?",
                answer: "SDITS stands for Shree Dadaji Institute of Technology and Science. It is a premier technical institute located in Khandwa, Madhya Pradesh, offering quality education in engineering and management.",
                category: "general",
                keywords: ["shree", "dadaji", "institute", "about", "full form"],
                alternateQuestions: ["What does SDITS stand for?", "Tell me about SDITS college."]
            },
            {
                "question": "Who runs SDITS Khandwa?",
                "answer": "SDITS Khandwa is run by Dadaji Dhuniwale Professional Education And Development Co-operative Society Limited Khandwa.",
                "category": "general",
                "keywords": ["who runs SDITS", "Dadaji Dhuniwale Society", "management", "society", "Khandwa"],
                "alternateQuestions": ["Which society runs the college?", "Who is the management of SDITS?"]
            },
            {
                "question": "What was year SDITS established?",
                "answer": "Shree Dadaji Institute of Technology and Science was established in the year 2004.",
                "category": "general",
                "keywords": ["established", "year", "founded", "started", "2004"],
                "alternateQuestions": ["When was SDITS founded?", "How old is the college?",]
            },
            {
                "question": "What is the vision of SDITS Khandwa?",
                "answer": "The vision is to provide a creative educational environment that prepares students for emerging trends in science and technology by developing analytical and practical skills.",
                "category": "general",
                "keywords": ["vision SDITS", "SDITS vision", "vision"],
                "alternateQuestions": ["What is the college vision?", "Vision of SDITS."]
            },
            {
                "question": "What is the mission of SDITS Khandwa?",
                "answer": "The mission of SDITS Khandwa is excellence in Engineering and Management , innovation, and global challenges.",
                "category": "general",
                "keywords": ["mission SDITS", "SDITS mission", "mission"],
                "alternateQuestions": ["What is the college mission?", "Mission statement of SDITS."]
            },
            {
                "question": "What does SDITS Khandwa focus on for students?",
                "answer": "SDITS focuses on grooming excellent engineers with a difference, training for entrepreneurship, innovation, and building a knowledge-intensive work culture.",
                "category": "general",
                "keywords": ["focus", "grooming engineers", "entrepreneurship", "innovation", "work culture", "competitive world"],
                "alternateQuestions": ["What are the focus areas for students?", "How does the college groom students?"]
            },
            {
                "question": "Where is the library?",
                "answer": "Come out of the college building. The path to the library is on the side of the front garden.",
                "category": "general",
                "keywords": ["where is library", "reading room"],
                "alternateQuestions": ["How to reach the library?", "Where is the central library?"]
            },
            {
                "question": "What are the library timing?",
                "answer": "Shree Dadaji Institute of Technology and Science central library is open from 10:30 AM to 3:30 PM on all working days. Extended hours during exams as per notice.",
                "category": "general",
                "keywords": ["library opening", "library closing", "books", "reading room"],
                "alternateQuestions": ["When does the library open?", "Library closing time.", "At what time library closes?"]
            },
            {
                "question": "What are the college timing?",
                "answer": "College timings are from 10:15 AM to 4:30 PM.",
                "category": "general",
                "keywords": ["college time", "college timing","opening time", "closing time", "when does college open"],
                "alternateQuestions": ["College timing kya hai?", "What is the college time?"]
            },
            {
                "question": "What is the lunch timing?",
                "answer": "Lunch timing is from 12:05 PM to 12:40 PM.",
                "category": "general",
                "keywords": ["lunch timing", "lunch time ","lunch break", "lunch break"],
                "alternateQuestions": ["Lunch time hai kya?", "What is the lunch time?"]
            },
            
            {
                "question": "Where is the canteen?",
                "answer": "Come out of the college building. The path to the canteen is on the side of the front garden.",
                "category": "general",
                "keywords": ["food", "canteen", "where is canteen"],
                "alternateQuestions": ["How to find the canteen?", "Where can I get food?"]
            },


            {
                "question": "Where is the fees counter or Accountant counter?",
                "answer": "The fees counter is beside the reception table.",
                "category": "general",
                "keywords": ["fees counter", "accountant counter", "fees", "payment counter"],
                "alternateQuestions": ["Where to pay fees?", "Accountant office location."]
            },
            {
                question: "Who is the principal of SDITS?",
                answer: "The principal of Shree Dadaji Institute of Technology and Science (S.D.I.T.S.) is Dr. Sapna Arzare Mam",
                category: "general",
                keywords: ["principal", "principal name", "sapna arzare", "dr sapna", "name"],
                alternateQuestions: ["Who is the principal of the college?", "What is the principal's name?"]
            },
            {
                "question": "Where is the principal's office in the college?",
                "answer": "Go straight and turn left. The Principal's office is located there at the room number 102 .",
                "category": "general",
                "keywords": ["principal office", "location", "cabin", "room"],
                "alternateQuestions": ["Principal's cabin location.", "How to find principal office?"]
            },
            {
                question: "Who is the Dean Academic of SDITS?",
                answer: "The Dean Academic of Shree Dadaji Institute of Technology and Science (S.D.I.T.S.) is Dr. Rajneesh Rai",
                category: "general",
                keywords: ["dean", "academic", "name", "rajneesh rai"],
                alternateQuestions: ["Who is the Dean Academic?", "What is the name of academic dean?"]
            },
            {
                "question": "Where is the Dean Academic office in the college?",
                "answer": "Go straight, and it is on the right sid  e of the stairs in front of you . The Dean Academic office is located at room number 108.",
                "category": "general",
                "keywords": ["dean office", "academic office"],
                "alternateQuestions": ["Dean's office location.", "How to find academic dean office?"]
            },

            {
                "question": "Who is the Registrar of SDITS?",
                "answer": "The Registrar of Shree Dadaji Institute of Technology and Science(S.D.I.T.S.) is Mrs. Deepali Gandhe",
                "category": "general",
                "keywords": ["registrar", "name", "deepali gandhe"],
                "alternateQuestions": [" What is the Registrar name.", "Who is the Registrar of college?"]
            },
            {
                "question": "Where is seminar hall in college?",
                "answer": "Go straight and turn right. Then walk a little ahead and take a left. The first room on that side, Room No. 109, is the Seminar Hall.",
                "category": "general",
                "keywords": ["seminar", "hall", "seminar hall"],
                "alternateQuestions": ["Where is seminar hall in S.D.I.T.S.?", "How to find seminar hall?", "Where is seminar hall is located?"]
            },
            {
                "question": "Where is drawing hall in the college",
                "answer": "Drawing hall is on  the 3rd floor ",
                "category": "general",
                "keywords": ["drawing hall"],
                "alternateQuestions": ["Where is drawing hall in SDITS?", "Drawing hall kaha par hai"]
            },

            {
                "question": "What is the intake for BTech at SDITS?",
                "answer": "The approved intake is 60 seats each in CSE, IT, ECE, ME, and Civil Engineering branches. Additional seats for lateral entry and TFW category.",
                "category": "admissions",
                "keywords": ["intake", "seats", "BTech seats", "branch capacity"],
                "alternateQuestions": ["How many seats are available in BTech?", "Branch wise seat intake for BTech."]
            },
            {
                "question": "What is the eligibility for BTech admission at SDITS?",
                "answer": "Eligibility: 10+2 with Physics, Chemistry, Mathematics. Minimum 45% marks for General category and 40% for SC/ST/OBC. JEE Main qualified candidates preferred. ",
                "category": "admissions",
                "keywords": ["BTech eligibility", "12th percentage", "PCM",],
                "alternateQuestions": ["Admission criteria for BTech.", "Requirements for engineering admission."]
            },
            {
                "question": "Where is the admission cell in the college?",
                "answer": "Go straight and turn right. The admission cell is located there at the room number 119.",
                "category": "general",
                "keywords": ["admission cell", "admission cell address"],
                "alternateQuestions": ["Admission office location.", "How to find admission cell?"]
            },
            {
                "question": "What is the admission process in S.D.I.T.S",
                "answer": "The admission process at SDITS follows the DTE MP online counseling. First, register on the official DTE MP website. Second, participate in the choice filling process and select Shree Dadaji Institute of Technology and Science. Third, check for seat allotment based on JEE Main or qualifying marks. Finally, report to the college with the required documents and fees to confirm your admission.",
                "category": "admissions",
                "keywords": ["admission process"],
                "alternateQuestions": ["How to get admission in SDITS?", "BTech admission procedure."]
            },
            {
                "question": "What documents are required for SDITS admission?",
                "answer": "The required documents for admission are 10th & 12th mark sheets, JEE Main scorecard, Transfer Certificate (TC), Migration Certificate, Caste Certificate (if applicable), Aadhaar Card, and passport-size photographs. For more detailed information, please visit the Admission Cell.",
                "category": "admissions",
                "keywords": ["documents required", "admission documents"],
                "alternateQuestions": ["List of documents for admission.", "Which documents are needed for BTech?"]
            },
            {
                "question": "Does SDITS provide study material?",
                "answer": "Yes, departments provide class notes, lab manuals, and question banks. Library has reference books and previous year question papers as per RGPV syllabus.",
                "category": "academics",
                "keywords": ["study material", "notes", "question bank", "lab manual", "previous papers", "RGPV syllabus"],
                "alternateQuestions": ["How to get notes?", "Are lab manuals provided?"]
            },
            {
                "question": "Which courses are offered at college?",
                "answer": "S.D.I.T.S. offers B.Tech in Computer Science & Engineering, Data Science, Electronics & Communication, Mechanical Engineering, Civil Engineering,M-Tech ,BBA, BCA, MCA  and MBA program.",
                "category": "academics",
                "keywords": ["courses offered", "BTech branches", "programs"],
                "alternateQuestions": ["Available courses in SDITS.", "What are the branches in engineering?"]
            },
            {
                "question": "When are exams conducted at SDITS?",
                "answer": "Odd semester examinations are conducted in December-January and even semester examinations in May-June by RGPV Bhopal as per academic calendar.",
                "category": "academics",
                "keywords": ["when", "exam dates", "semester exam", "Dec Jan", "May June", "RGPV exam", "academic calendar"],
                "alternateQuestions": ["RGPV exam timing.", "Semester exam schedule."]
            },
            {
                "question": "What is the attendance rule at SDITS?",
                "answer": "As per RGPV norms, SDITS requires minimum 75% attendance in each subject in theory and practical to be eligible for appearing in semester examinations.",
                "category": "academics",
                "keywords": ["attendance", "75% attendance", "minimum attendance", "RGPV rule"],
                "alternateQuestions": ["Is 75% attendance mandatory?", "Minimum attendance required."]
            },
            {
                "question": "Is uniform compulsory at SDITS?",
                "answer": "Yes, SDITS has a prescribed uniform for all students which is compulsory on all working days. Lab coat is mandatory for workshops and laboratories.",
                "category": "academics",
                "keywords": ["uniform", "dress code", "college dress", "lab coat", "compulsory uniform"],
                "alternateQuestions": ["Is there a dress code?", "Is uniform mandatory in college?"]
            },
            {
                "question": "What is the grading system at SDITS?",
                "answer": "SDITS follows RGPV 10-point grading system. Performance is evaluated through SGPA and CGPA. Minimum D grade is required to pass in a subject.",
                "category": "academics",
                "keywords": ["grading system", "CGPA", "SGPA", "10 point", "pass grade", "RGPV grades"],
                "alternateQuestions": ["How SGPA is calculated?", "Grading policy of RGPV."]
            },
            {
                "question": "What is the campus area of SDITS?",
                "answer": "SDITS campus is spread over 10+ acres of land with academic buildings, workshops, laboratories, library, canteen, and sports ground.",
                "category": "facilities",
                "keywords": ["campus area", "campus size", "acres"],
                "alternateQuestions": ["How big is the college campus?", "Total acres of campus."]
            },
            {
                "question": "Does SDITS have anti-ragging policy?",
                "answer": "Yes, SDITS is a ragging-free campus. Anti-Ragging Committee and Anti-Ragging Squad are constituted as per UGC and AICTE guidelines. Zero tolerance policy.",
                "category": "facilities",
                "keywords": ["anti ragging", "ragging free", "anti ragging committee"],
                "alternateQuestions": ["Is ragging banned in college?", "Ragging rules in SDITS."]
            },
            {
                "question": "What is the facilities offered by S.D.I.T.S?",
                "answer": "Shree Dadaji Institute of Technology and Science offers comprehensive facilities including modern computer and departmental laboratories, a well-stocked central library, spacious classrooms, sports facilities, a canteen, bus transportation for students, provides a Wi-Fi connection for students and staff , and a dedicated Training and Placement Cell to support student careers.",
                "category": "facilities",
                "keywords": ["sdits facilities", "facilities"],
                "alternateQuestions": ["What facilities are available?", "Amenities provided by the college.", "What are the faciltites in SDITS?"]
            },
            {
                "question": "Does SDITS have sports facilities?",
                "answer": "Yes, SDITS has playground for outdoor games like cricket, football, volleyball, and facilities for indoor games like table tennis, chess, carrom.",
                "category": "facilities",
                "keywords": ["sports facilities", "playground"],
                "alternateQuestions": ["Available sports in college.", "Is there a sports ground?"]
            },
            {
                "question": "Does SDITS have a library?",
                "answer": "Yes, SDITS has a central library with 25,000+ books, national & international journals, e-library, digital library, and reading room facility.",
                "category": "facilities",
                "keywords": ["library books", "journals", "reading room", "digital library"],
                "alternateQuestions": ["Is there a library?", "Central library facilities."]
            },

            {
                "question": "Is WiFi available at SDITS campus?",
                "answer": "Yes, SDITS campus including academic blocks, labs, library is WiFi enabled with internet facility for students and staff.",
                "category": "facilities",
                "keywords": ["internet facility", "wifi SDITS", "free internet"],
                "alternateQuestions": ["WiFi facility in college.", "Is there free internet?"]
            },

            {
                "question": "Does SDITS have a canteen?",
                "answer": "Yes, SDITS has a canteen on campus that provides breakfast, lunch, tea, coffee, and snacks at subsidized rates for students and staff.",
                "category": "facilities",
                "keywords": ["food facility", "canteen"],
                "alternateQuestions": ["Canteen facility in college.", "Is there a cafeteria?"]
            },

            {
                "question": "Does SDITS have Training and Placement Cell?",
                "answer": "Yes, SDITS has a dedicated Training & Placement Cell that conducts campus recruitment drives, training programs, and career guidance for students.",
                "category": "placements",
                "keywords": ["T&P Cell", "placement cell", "training cell", "TPO", "placement department"],
                "alternateQuestions": ["Placement cell details.", "How to contact TPO?"]
            },
            {
                "question": "Which companies visit SDITS for placement?",
                "answer": "Companies like TCS, Infosys, Wipro, Tech Mahindra, HCL, and other IT & core companies have visited SDITS for campus placements as per placement records.",
                "category": "placements",
                "keywords": ["placement companies", "TCS", "Infosys", "Wipro", "Tech Mahindra", "recruiters"],
                "alternateQuestions": ["Top recruiters of SDITS.", "Which companies recruit from here?"]
            },
            {
                "question": "What is the average placement package at SDITS?",
                "answer": "As per placement data, the average package at SDITS ranges from ₹3.0 LPA to ₹4.5 LPA. Highest packages have gone up to ₹6-8 LPA.",
                "category": "placements",
                "keywords": ["average package", "placement package", "salary", "LPA", "highest package"],
                "alternateQuestions": ["What is the average salary package?", "Highest placement package."]
            },
            {
                "question": "Does SDITS provide placement training?",
                "answer": "Yes, T&P Cell conducts aptitude training, technical training, soft skills, group discussion, and mock interview sessions from 3rd year onwards.",
                "category": "placements",
                "keywords": ["placement training", "aptitude", "soft skills", "GD PI", "mock interview", "training"],
                "alternateQuestions": ["Is placement training provided?", "How college prepares students for placement?"]
            },
            {
                "question": "Does SDITS help with internships?",
                "answer": "Yes, the Training & Placement Cell assists students in getting summer internships and industrial training as per RGPV curriculum requirements.",
                "category": "placements",
                "keywords": ["internship", "summer training", "industrial training", "internship help"],
                "alternateQuestions": ["Internship opportunities in college.", "How to get internship?"]
            },
            {
                "question": "Can I pay fees online at SDITS?",
                "answer": "Yes, SDITS provides online fee payment facility through net banking, debit card, credit card, and UPI via the student login portal.",
                "category": "fees",
                "keywords": ["online fee payment", "pay fees online", "net banking", "fee portal"],
                "alternateQuestions": ["Online payment of fees.", "How to pay college fees online?"]
            },
            {
                "question": "What is the BTech fees at SDITS?",
                "answer": "The approximate BTech tuition fee at SDITS is ₹50,000 per year as per DTE norms. Hostel, bus, and other fees are separate. Check latest fee notice on sdits.org.",
                "category": "fees",
                "keywords": ["BTech fees", "SDITS fees", "engineering fees"],
                "alternateQuestions": ["Fee structure for BTech.", "Engineering fees."]
            },
            {
                "question": "Does SDITS offer scholarships?",
                "answer": "Yes, eligible students can apply for MP Govt Post Matric Scholarship for SC/ST/OBC, Medhavi Chhatra Yojana, Mukhya Mantri Jan Kalyan Yojana, and TFW seats.",
                "category": "fees",
                "keywords": ["scholarship", "SC ST OBC scholarship", "Medhavi", "MMJKY", "TFW", "fee waiver"],
                "alternateQuestions": ["Available scholarships in college.", "Scholarship for OBC/SC/ST students."]
            },
            {
                "question": "Where SDITS is located?",
                "answer": "Shree Dadaji Institute of Technology and Science  is located at Rehmapur Indore Road Khandwa Madhya Pradesh 450001.",
                "category": "address",
                "keywords": ["SDITS address", "address", "located"],
                "alternateQuestions": ["What is the address of the college?", "Where is SDITS located?", "SDITS kaha par located hai"]
            },

            {
                "question": "Who is the HOD of Computer Science Engineering (CSE)?",
                "answer": "The Head of the Computer Science Engineering department is Ankit Bakshi.",
                "category": "hod",
                "keywords": ["hod", "cse", "computer science engineering", "computer science", "ankit bakshi", "head of department", "faculty"],
                "alternateQuestions": [
                    "Who is the head of CSE department?",
                    "CSE ke department HOD kaun hai?",
                    "Who manages the Computer Science department?",
                    "Name of HOD of CSE?",
                    "CSE ka head kaun hai?"
                ]
            },
            {
                "question": "Who is the HOD of Data Science (DS)?",
                "answer": "The Head of the Data Science department is Mr. Ankit Bakshi.",
                "category": "hod",
                "keywords": ["hod", "ds", "data science", "ankit bakshi", "head of department", "faculty"],
                "alternateQuestions": [
                    "Who is the head of DS department?",
                    "Data Science HOD kaun hai?",
                    "Who manages Data Science department?",
                    "Name of HOD of DS?",
                    "DS ka head kaun hai?"
                ]
            },
            {
                "question": "Who is the HOD of Mechanical Engineering (ME)?",
                "answer": "The Head of the Mechanical Engineering department is Mr. L.P. Ladhe.",
                "category": "hod",
                "keywords": ["hod", "me", "mechanical engineering", "mechanical", "l.p. ladhe", "head of department", "faculty"],
                "alternateQuestions": [
                    "Who is the head of Mechanical department?",
                    "Mechanical HOD kaun hai?",
                    "ME department ka head kaun hai?",
                    "Name of HOD of Mechanical?",
                    "Who manages Mechanical Engineering?"
                ]
            },
            {
                "question": "Who is the HOD of Civil Engineering (CE)?",
                "answer": "The Head of the Civil Engineering department is Mr. Ashish Paliwal",
                "category": "hod",
                "keywords": ["hod", "ce", "civil engineering", "civil", "ashish paliwal", "head of department", "faculty"],
                "alternateQuestions": [
                    "Who is the head of Civil department?",
                    "Civil HOD kaun hai?",
                    "CE department ka head kaun hai?",
                    "Name of HOD of Civil?",
                    "Who manages Civil Engineering?"
                ]
            },
            {
                "question": "Who is the HOD of Electrical Engineering (EE)?",
                "answer": "The Head of the Electrical Engineering department is Mr. Ramakant ",
                "category": "hod",
                "keywords": ["hod", "ee", "electrical engineering", "electrical", "ramakant", "head of department", "faculty"],
                "alternateQuestions": [
                    "Who is the head of Electrical department?",
                    "Electrical ke HOD kaun hai?",
                    "EE department ka head kaun hai?",
                    "Name of HOD of Electrical?",
                    "Who manages Electrical Engineering?"
                ]
            },

            {
                "question": "Who is the HOD of BBA?",
                "answer": "The Head of the BBA department  is  Mrs. Ritika Desai Tiwari.",
                "category": "hod",
                "keywords": ["hod", "bba", "business administration", "ritika desai tiwari", "head of department", "faculty"],
                "alternateQuestions": [
                    "BBA department ka head kaun hai?",
                    "Who is the head of BBA?",
                    "Name of HOD of BBA?",
                    "Who manages BBA department?",
                    "BBA HOD kaun hai?"
                ]
            },
            {
                "question": "Who is the HOD of MBA?",
                "answer": "The Head of the MBA department is  Mrs. Ritika Desai Tiwari.",
                "category": "hod",
                "keywords": ["hod", "mba", "master of business administration", "ritika desai tiwari", "head of department", "faculty"],
                "alternateQuestions": [
                    "MBA department ka head kaun hai?",
                    "Who is the head of MBA?",
                    "Name of HOD of MBA?",
                    "Who manages MBA department?",
                    "MBA HOD kaun hai?"
                ]
            },
            {
                "question": "Who is the HOD of BCA?",
                "answer": "The Head of the BCA is department Mrs. Rachita Vyas Dongre.",
                "category": "hod",
                "keywords": ["hod", "bca", "bachelor of computer applications", "rachita vyas dongre", "head of department", "faculty"],
                "alternateQuestions": [
                    "BCA department ka head kaun hai?",
                    "Who is the head of BCA?",
                    "Name of HOD of BCA?",
                    "Who manages BCA department?",
                    "BCA HOD kaun hai?"
                ]
            },

            {
                "question": "Who is the HOD of MCA?",
                "answer": "The Head of the MCA department is Mrs. Rachita Vyas Dongre.",
                "category": "hod",
                "keywords": ["hod", "mca", "master of computer applications", "rachita vyas dongre", "head of department", "faculty"],
                "alternateQuestions": [
                    "MCA department ka head kaun hai?",
                    "Who is the head of MCA?",
                    "Name of HOD of MCA?",
                    "Who manages MCA department?",
                    "MCA HOD kaun hai?"
                ]
            },
            {
                "question": "Who is the HOD of M Tech?",
                "answer": "The Head of the M Tech department is Mr. L.P. Ladhe.",
                "category": "hod",
                "keywords": ["hod", "mtech", "m tech", "l.p. ladhe", "head of department", "faculty"],
                "alternateQuestions": [
                    "M Tech ke head kaun hai",
                    "M Tech department ke head kon hai",
                    "M Tech HOD kaun hai?"
                ]
            },
            {
                "question": "Who is the subordinate of M Tech?",
                "answer": "The subcordinate of the M Tech department is Mr. Sanidhya Nagar.",
                "category": "hod",
                "keywords": ["subordinate", "mtech", "m tech", "sanidhya nagar", "faculty"],
                "alternateQuestions": [
                    "M Tech ka subordinate kaun hai",
                    "Who is the subordinate of M Tech",
                    "M Tech subordinate kaun hai?"
                ]
            },
            {
                "question": "Who is the  Maths Assistant professor in the college?",
                "answer": "The  Maths Assistant professor is Mrs. Jaya Jain.",
                "category": "assistant_professor ",
                "keywords": ["maths assistant professor", "maths"],
                "alternateQuestions": [
                    "What is the name of Maths Assistant Professor?",
                    "Maths Assistant Professor kaun hai?",
                    "Who is the Maths Assistant Professor in SDITS?",
                ]
            },
            {
                "question": "Who is the  Chemistry Assistant professor in the college?",
                "answer": "The  Maths Assistant professor is Mr. Sandeep Dongre",
                "category": "assistant_professor ",
                "keywords": ["chemistry assistant professor", "chemistry"],
                "alternateQuestions": [
                    "What is the name of Chemistry Assistant Professor?",
                    "Chemistry Assistant Professor kaun hai?",
                    "Who is the Chemistry Assistant Professor in SDITS?",
                ]
            },
            {
                "question": "Who is the  English Assistant professor in the college?",
                "answer": "The English Assistant professor is Mr. Pradeep Mishra",
                "category": "assistant_professor ",
                "keywords": ["english assistant professor", "english"],
                "alternateQuestions": [
                    "What is the name of English Assistant Professor?",
                    "English Assistant Professor kaun hai?",
                    "Who is the English Assistant Professor in SDITS?",
                ]
            },
            {
                "question": "Who is the  Civil Engineering (CE) Assistant professor in the college?",
                "answer": "The Civil Engineering (CE) Assistant professor is Mr. Ashish Paliwal",
                "category": "assistant_professor ",
                "keywords": ["Civil Engineering (CE) assistant professor", "CE", 'Civil Engineering '],
                "alternateQuestions": [
                    "What is the name of Civil Engineering (CE) Assistant Professor?",
                    "Civil Engineering (CE) Assistant Professor kaun hai?",
                    "Who is the Civil Engineering (CE) Assistant Professor in SDITS?",
                    "Who is the CE Assistant professor in college?",
                ]
            },
            {
                "question": "Who is the  MCA Assistant professor in the college?",
                "answer": "The MCA Assistant professor is Mr. Ashish Paliwal",
                "category": "assistant_professor ",
                "keywords": ["MCA assistant professor", "MCA"],
                "alternateQuestions": [
                    "What is the name of MCA Assistant Professor?",
                    "MCA Assistant Professor kaun hai?",
                    "Who is th MCA Assistant Professor in SDITS?",
                ]
            },
            {
                "question": "Who is the  CSE/DS Assistant professor in the college?",
                "answer": "The CSE/DS Assistant professor is Mr. Ankit Bakshi",
                "category": "assistant_professor ",
                "keywords": ["CSE/DS assistant professor", "CSE/DS", "CSE", "DS"],
                "alternateQuestions": [
                    "What is the name of CSE/DS Assistant Professor?",
                    "CSE/DS Assistant Professor kaun hai?",
                    "Who is the CSE/DS Assistant Professor in SDITS?",
                    "Who is the CSE Assistant professor in college?",
                    "Who is the DS Assistant professor in college?",
                ]
            },

            {
                "question": "Where is the Department of Electrical and Electronics Engineering (EEE)?",
                "answer": "Go straight and take a right. Then go ahead and turn left, and take another left. Walk forward—Room No. 116 is just in front of the water cooler.",
                "category": "department_location",
                "keywords": ["eee department", "electrical department", "electronics department","electrical location"],
                "alternateQuestions": [
                    "Electrical department kaha hai?",
                    "Where is Electrical department?",
                    "Electronics department location?",
                    " How reach Electrical department ?"
                ]
            },
            {
                "question": "Where is the Civil Department?",
                "answer": "Go straight and take a right. Then go ahead and take a left, and again take a left. Walk straight, and in that row, it is the second last room.",
                "category": "department_location",
                "keywords": ["civil department", "ce location"],
                "alternateQuestions": [
                    "Civil department kaha hai?",
                    "Where is CE department?",
                    "Civil engineering location?",
                    "How to reach civil department?"
                ]
            },
            {
                "question": "Where is the Mechanical  Department?",
                "answer": "Go straight and take a right. Then go ahead and take a left, and take another left. The first room there is Room No. 114.",
                "category": "department_location",
                "keywords": ["mechanical department", "me location"],
                "alternateQuestions": [
                    "Mechanical department kaha hai?",
                    "Where is ME department?",
                    "Mechanical engineering location?",
                    "How to reach Mechanical department?"
                ]
            },
            {
                "question": "Where is the Computer Science & Engineering  Department?",
                "answer": "Go straight to stairs and turn right at room number .",
                "category": "department_location",
                "keywords": ["Computer science department", "cse location"],
                "alternateQuestions": [
                    "Computer Science department kaha hai?",
                    "Where is CSE department?",
                    "Computer Science engineering location?",
                    "How to reach Computer science department?"
                ]
            },
            {
                "question": "Where is the Placement and innovation cell ?",
                "answer": " Go straight and walk beside the stairs at Room Number    .",
                "category": "department_location",
                "keywords": ["Placement and innovation cell", "placement cell  location"],
                "alternateQuestions": [
                    "Placement and innovation cell kaha hai?",
                    "Address is Placement and innovation cell?",
                    "Training and palcement cell kaha hai?",
                    "How to reach Placement and innovation cell?"
                ],
            },
            {
                "question": "Where is the computer lab ?",
                "answer": " Go straight through stairs and turn right at Room Number     .",
                "category": "department_location",
                "keywords": ["computer lab", "computer lab location"],
                "alternateQuestions": [
                    "Computer lab kaha hai?",
                    "Where is computer lab in the college?",
                    "How to reach the computer lab?",
                    "Addess of computer lab?"],
            },
            {
                "question": "Where is the Mathematical  Department?",
                "answer": "Go straight through stairs  and  turn right and room number is 206.",
                "category": "department_location",
                "keywords": ["mathematical department", "mathematical location", "maths"],
                "alternateQuestions": [
                    "Mathematical department kaha hai?",
                    "Where is mathematical department?",
                    "Mathematical engineering location?",
                    "How to reach Mathematical department ?"
                ]
            },
            {
                "question": "Where is the English Language Lab?",
                "answer": "Go straight and turn right. The  Room No. 118.",
                "category": "department_location",
                "keywords": ["english lab", "language lab", "room 118", "lab location"],
                "alternateQuestions": [
                    "English lab kaha hai?",
                    "Where is language lab?",
                    "EL lab location?",
                    "How to reach English lab?"
                ]
            },


        ];

        await FAQ.insertMany(faqs, { ordered: false });
        console.log('FAQs seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding FAQs:', error);
        process.exit(1);
    }
};

seedFAQs();