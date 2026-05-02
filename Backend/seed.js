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
                "answer": " I am a voice-enabled virtual assistant for SDITS College. I can help you find answers to your questions related to the college.",
                "category": "general",
                "keywords": ["about yourself", "who are you", "assistant"]
            },
            {
                "question": "Who developed you?",
                "answer": "I was developed by Usha Patel, Rajni Verma, and Priti Patel, final year students of the Computer Science Engineering department at SDITS. They created me to assist students with information about the college.",
                "category": "general",
                "keywords": ["created", "made", "developer", "who made you"]
            },

            {
                question: "What is SDITS?",
                answer: "SDITS stands for Shree Dadaji Institute of Technology and Science. It is a premier technical institute located in Khandwa, Madhya Pradesh, offering quality education in engineering and management.",
                category: "general",
                keywords: ["sdits", "shree", "dadaji", "institute", "about"]
            },
            {
                "question": "What is the mission of SDITS Khandwa?",
                "answer": "The mission of SDITS Khandwa is excellence in Engineering Education to produce a new generation of engineers with all-round excellence in frontier technologies, trained for entrepreneurship, innovation, and global challenges.",
                "category": "general",
                "keywords": ["mission SDITS", "SDITS mission", "quest for excellence", "engineering education", "entrepreneurship", "globalization"]
            },
            {
                "question": "Who runs SDITS Khandwa?",
                "answer": "SDITS Khandwa is run by Dadaji Dhuniwale Professional Education And Development Co-operative Society Limited Khandwa.",
                "category": "general",
                "keywords": ["who runs SDITS", "Dadaji Dhuniwale Society", "management", "society", "Khandwa"]
            },
            {
                "question": "What was year SDITS established?",
                "answer": "Shree Dadaji Institute of Technology and Science was established in the year 2004.",
                "category": "general",
                "keywords": ["established", "year", "founded", "started", "2004"]
            },
            {
                "question": "What is the vision of SDITS Khandwa?",
                "answer": "The vision is to provide a creative educational environment that prepares students for emerging trends in science and technology by developing analytical and practical skills.",
                "category": "general",
                "keywords": ["vision SDITS", "SDITS vision", "creative environment", "analytical skills", "practical skills", "emerging trends"]
            },
            {
                "question": "What kind of professionals does SDITS Khandwa aim to develop?",
                "answer": "SDITS aims to develop professionals with technical knowledge, management competence, creative and innovative approach, and a positive outlook for life.",
                "category": "general",
                "keywords": ["professionals", "technical knowledge", "management competence", "innovative", "positive outlook"]
            },
            {
                "question": "What is the quality policy of SDITS Khandwa?",
                "answer": "The quality policy is to produce professionals with excellence in specialization who surpass global competition, with analytical thinking in a student-friendly environment.",
                "category": "general",
                "keywords": ["quality policy", "excellence", "global competition", "analytical thinking", "student friendly"]
            },
            {
                "question": "What does SDITS Khandwa focus on for students?",
                "answer": "SDITS focuses on grooming excellent engineers with a difference, training for entrepreneurship, innovation, and building a knowledge-intensive work culture.",
                "category": "general",
                "keywords": ["focus", "grooming engineers", "entrepreneurship", "innovation", "work culture", "competitive world"]
            },
            {
                "question": "How does SDITS prepare students for globalization?",
                "answer": "SDITS prepares students through training for entrepreneurship and innovations to develop knowledge-intensive work culture to face global challenges.",
                "category": "general",
                "keywords": ["globalization", "global challenges", "entrepreneurship", "innovation", "knowledge intensive"]
            },
            {
                "question": "What skills does SDITS Khandwa inculcate?",
                "answer": "SDITS inculcates analytical and practical skills to help students meet the demanding needs of science and technology.",
                "category": "general",
                "keywords": ["skills", "analytical skills", "practical skills", "science and technology", "inculcate"]
            },
            {
                "question": "What is the aim of SDITS Khandwa?",
                "answer": "The aim is to ignite young minds to take their first step firmly and groom them as excellent engineers who can succeed in changing technology.",
                "category": "general",
                "keywords": ["aim", "ignite young minds", "excellent engineers", "changing technology", "future"]
            },
            {
                "question": "What are the college timings?",
                "answer": "College timings are from 10:15 AM to 4:30 PM.",
                "category": "general",
                "keywords": ["college time", "opening time", "closing time", "when does college open"]
            },
            {
                "question": "Where is the library?",
                "answer": "Come out of the college building. The path to the library is on the side of the front garden.",
                "category": "general",
                "keywords": [ "where is library", "reading room"]
            },
              {
                "question": "What are the library timing?",
                "answer": "SDITS central library is open from 10:30 AM to 3:30 PM on all working days. Extended hours during exams as per notice.",
                "category": "general",
                "keywords": ["library time", "library opening", "library closing", "books", "where is library", "reading room"]
            },
            {
                "question": "Where is the canteen?",
                "answer": "Come out of the college building. The path to the canteen is on the side of the front garden.",
                "category": "general",
                "keywords": ["food", "canteen", "where is canteen"]
            },
            {
                "question": "What is the lunch timing?",
                "answer": "Lunch timing is from 12:05 PM to 12:40 PM.",
                "category": "general",
                "keywords": ["lunch time", "lunch", "break", "lunch break"]
            },
            {
                "question": "Where is the fees counter or Accountant office?",
                "answer": "The fees counter is beside the reception table.",
                "category": "general",
                "keywords": ["fees counter", "accountant", "accountant office", "fees", "payment counter"]
            },
            // {
            //     "question": "Where is the principal's office in the college?",
            //     "answer": "Go straight and turn left. The Principal's office is located there.",
            //     "category": "general",
            //     "keywords": ["principal office", "where is principal office"]
            // },
           
            // {
            //     "question": "Where is the Dean Academic office in the college?",
            //     "answer": "Go straight, and it is on the right side of the stairs in front of you.",
            //     "category": "general",
            //     "keywords": ["dean academic office", "dean office", "academic office"]
            // },
            {
                question: "Who is the DEAN Academic of SDITS?",
                answer: "The Dean Academic of Shree Dadaji Institute of Technology and Science(SDITS) is Dr. Rajneesh Rai",
                category: "general",
                keywords: ["dean", "academic dean", "dean academic"]
            },
             {
                question: "Who is the principal of SDITS?",
                answer: "The principal of SDITS is Dr. Sapna Arzare Mam",
                category: "general",
                keywords: ["principal","principal name" ,"what is the principal name"]
            },
            {
                question: "Who is the Registrar of SDITS?",
                answer: "The Registrar of Shree Dadaji Institute of Technology and Science(SDITS) is Mrs. Deepali Gandhe",
                category: "general",
                keywords: ["registrar", "who is registrar", "registrar SDITS", "college registrar"]
            },
            {
                "question": "Where is the admission cell in the college?",
                "answer": "Go straight and turn right. The admission cell is located there.",
                "category": "general",
                "keywords": ["admission cell", "admission office", "where is admission", "admission address"]
            },

            {
                "question": "What is the intake for BTech at SDITS?",
                "answer": "The approved intake is 60 seats each in CSE, IT, ECE, ME, and Civil Engineering branches. Additional seats for lateral entry and TFW category.",
                "category": "admissions",
                "keywords": ["intake", "seats", "BTech seats", "branch capacity", "CSE seats"]
            },
            {
                "question": "What is the eligibility for BTech admission at SDITS?",
                "answer": "Eligibility: 10+2 with Physics, Chemistry, Mathematics. Minimum 45% marks for General category and 40% for SC/ST/OBC. JEE Main qualified candidates preferred. ",
                "category": "admissions",
                "keywords": ["BTech eligibility", "12th percentage", "PCM", "JEE Main", "admission criteria"]
            },
            {
                "question": "How to take admission in SDITS?",
                "answer": "Admission to BTech is through JEE Main score via MP DTE online counselling. Institute-level admissions are also done on 12th PCM merit after counselling rounds.",
                "category": "admissions",
                "keywords": ["admission process", "JEE Main", "MP DTE", "counselling", "direct admission", "how to apply"]
            },
            {
                "question": "Does SDITS have lateral entry admission?",
                "answer": "Yes, diploma holders can take admission directly to BTech 2nd year through MP DTE lateral entry counselling. 20% seats are reserved for lateral entry.",
                "category": "admissions",
                "keywords": ["lateral entry", "diploma admission", "direct second year", "polytechnic"]
            },
            {
                "question": "What documents are required for SDITS admission?",
                "answer": "Required documents: 10th & 12th marksheet, JEE Main scorecard, TC, Migration Certificate, Caste Certificate if applicable, Aadhaar Card, Passport size photos. ",
                "category": "admissions",
                "keywords": ["documents required", "admission documents", "TC migration", "caste certificate", "photos"]
            },
            {
                "question": "Does SDITS provide study material?",
                "answer": "Yes, departments provide class notes, lab manuals, and question banks. Library has reference books and previous year question papers as per RGPV syllabus.",
                "category": "academics",
                "keywords": ["study material", "notes", "question bank", "lab manual", "previous papers", "RGPV syllabus"]
            },
            {
                "question": "Which courses are offered at SDITS?",
                "answer": "SDITS offers B.Tech in Computer Science & Engineering, Data Science, Electronics & Communication, Mechanical Engineering, Civil Engineering,BBA, BCA, MCA  and MBA program.",
                "category": "academics",
                "keywords": ["courses offered", "BTech branches", "MBA", "CSE IT ECE ME CE", "programs"]
            },
            {
                "question": "When are exams conducted at SDITS?",
                "answer": "Odd semester examinations are conducted in December-January and even semester examinations in May-June by RGPV Bhopal as per academic calendar.",
                "category": "academics",
                "keywords": ["exam dates", "semester exam", "Dec Jan", "May June", "RGPV exam", "academic calendar"]
            },
            {
                "question": "What is the attendance rule at SDITS?",
                "answer": "As per RGPV norms, SDITS requires minimum 75% attendance in each subject in theory and practical to be eligible for appearing in semester examinations.",
                "category": "academics",
                "keywords": ["attendance", "75% attendance", "minimum attendance", "RGPV rule"]
            },
            {
                "question": "Is uniform compulsory at SDITS?",
                "answer": "Yes, SDITS has a prescribed uniform for all students which is compulsory on all working days. Lab coat is mandatory for workshops and laboratories.",
                "category": "academics",
                "keywords": ["uniform", "dress code", "college dress", "lab coat", "compulsory uniform"]
            },
            {
                "question": "What is the grading system at SDITS?",
                "answer": "SDITS follows RGPV 10-point grading system. Performance is evaluated through SGPA and CGPA. Minimum D grade is required to pass in a subject.",
                "category": "academics",
                "keywords": ["grading system", "CGPA", "SGPA", "10 point", "pass grade", "RGPV grades"]
            },
            {
                "question": "What is the campus area of SDITS?",
                "answer": "SDITS campus is spread over 10+ acres of land with academic buildings, workshops, laboratories, library, canteen, and sports ground.",
                "category": "facilities",
                "keywords": ["campus area", "campus size", "acres", "infrastructure", "campus facilities"]
            },
            {
                "question": "Does SDITS have anti-ragging policy?",
                "answer": "Yes, SDITS is a ragging-free campus. Anti-Ragging Committee and Anti-Ragging Squad are constituted as per UGC and AICTE guidelines. Zero tolerance policy.",
                "category": "facilities",
                "keywords": ["anti ragging", "ragging free", "UGC guidelines", "anti ragging committee", "helpline"]
            },
            {
                "question": "Does SDITS have sports facilities?",
                "answer": "Yes, SDITS has playground for outdoor games like cricket, football, volleyball, and facilities for indoor games like table tennis, chess, carrom.",
                "category": "facilities",
                "keywords": ["sports", "playground", "cricket", "football", "volleyball", "indoor games", "sports meet"]
            },
            {
                "question": "Does SDITS have a library?",
                "answer": "Yes, SDITS has a central library with 25,000+ books, national & international journals, e-library, digital library, and reading room facility.",
                "category": "facilities",
                "keywords": ["library", "library books", "e-library", "journals", "reading room", "digital library"]
            },
            {
                "question": "What are library timings at SDITS?",
                "answer": "SDITS central library is open from 10:30 AM to 3:30 PM on all working days. Extended hours during exams as per notice.",
                "category": "facilities",
                "keywords": ["library timing", "library hours", "library open", "reading room timing"]
            },
            {
                "question": "Is WiFi available at SDITS campus?",
                "answer": "Yes, SDITS campus including academic blocks, labs, library is WiFi enabled with internet facility for students and staff.",
                "category": "facilities",
                "keywords": ["campus wifi", "internet facility", "wifi SDITS", "free internet", "wifi campus"]
            },
            {
                "question": "Does SDITS have a canteen?",
                "answer": "Yes, SDITS has a canteen on campus that provides breakfast, lunch, tea, coffee, and snacks at subsidized rates for students and staff.",
                "category": "facilities",
                "keywords": ["food facility", "lunch", "snacks"]
            },

            {
                "question": "Does SDITS have Training and Placement Cell?",
                "answer": "Yes, SDITS has a dedicated Training & Placement Cell that conducts campus recruitment drives, training programs, and career guidance for students.",
                "category": "placements",
                "keywords": ["T&P Cell", "placement cell", "training cell", "TPO", "placement department"]
            },
            {
                "question": "Which companies visit SDITS for placement?",
                "answer": "Companies like TCS, Infosys, Wipro, Tech Mahindra, HCL, and other IT & core companies have visited SDITS for campus placements as per placement records.",
                "category": "placements",
                "keywords": ["placement companies", "TCS", "Infosys", "Wipro", "Tech Mahindra", "recruiters"]
            },
            {
                "question": "What is the average placement package at SDITS?",
                "answer": "As per placement data, the average package at SDITS ranges from ₹3.0 LPA to ₹4.5 LPA. Highest packages have gone up to ₹6-8 LPA.",
                "category": "placements",
                "keywords": ["average package", "placement package", "salary", "LPA", "highest package"]
            },
            {
                "question": "Does SDITS provide placement training?",
                "answer": "Yes, T&P Cell conducts aptitude training, technical training, soft skills, group discussion, and mock interview sessions from 3rd year onwards.",
                "category": "placements",
                "keywords": ["placement training", "aptitude", "soft skills", "GD PI", "mock interview", "training"]
            },
            {
                "question": "Does SDITS help with internships?",
                "answer": "Yes, the Training & Placement Cell assists students in getting summer internships and industrial training as per RGPV curriculum requirements.",
                "category": "placements",
                "keywords": ["internship", "summer training", "industrial training", "internship help"]
            },
            {
                "question": "Can I pay fees online at SDITS?",
                "answer": "Yes, SDITS provides online fee payment facility through net banking, debit card, credit card, and UPI via the student login portal.",
                "category": "fees",
                "keywords": ["online fee payment", "pay fees online", "net banking", "UPI", "debit card", "fee portal"]
            },
            {
                "question": "What is the BTech fees at SDITS?",
                "answer": "The approximate BTech tuition fee at SDITS is ₹50,000 per year as per DTE norms. Hostel, bus, and other fees are separate. Check latest fee notice on sdits.org.",
                "category": "fees",
                "keywords": ["BTech fees", "tuition fees", "SDITS fees", "engineering fees", "annual fees", "fees structure"]
            },
            {
                "question": "Does SDITS offer scholarships?",
                "answer": "Yes, eligible students can apply for MP Govt Post Matric Scholarship for SC/ST/OBC, Medhavi Chhatra Yojana, Mukhya Mantri Jan Kalyan Yojana, and TFW seats.",
                "category": "fees",
                "keywords": ["scholarship", "SC ST OBC scholarship", "Medhavi", "MMJKY", "TFW", "fee waiver"]
            },
            {
                "question": "Where SDITS is located?",
                "answer": "Shree Dadaji Institute of Technology and Science  is located at Rehmapur Indore Road Khandwa Madhya Pradesh -450001.",
                "category": "fees",
                "keywords": ["SDITS address", "adress", "located", "college address"]
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