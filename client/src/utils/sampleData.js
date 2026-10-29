/**
 * Sample resumes and job descriptions for rapid testing and portfolio demonstration.
 */

export const SAMPLE_RESUMES = [
  {
    id: 'sde-high',
    title: 'Aditya Sharma - Full Stack SDE (High ATS ~90)',
    role: 'Full Stack Software Engineer',
    fileName: 'Aditya_Sharma_FullStack.pdf',
    text: `ADITYA SHARMA
aditya.sharma.cse@gmail.com | +91 9876543210 | Bangalore, India
LinkedIn: https://linkedin.com/in/adityasharma-dev | GitHub: https://github.com/adityasharma-code | Portfolio: https://adityasharma.dev

PROFESSIONAL SUMMARY
Results-driven Full-Stack Software Engineer with expertise in React, Node.js, and cloud microservices. Proven track record of improving system latency by 45% and shipping features to 250,000+ monthly active users. Passionate about performant system architecture and clean code.

EDUCATION
Bachelor of Technology in Computer Science & Engineering
National Institute of Technology, Karnataka | 2020 – 2024
CGPA: 8.92 / 10.0 (Top 5% of graduating class)

TECHNICAL SKILLS
• Programming Languages: JavaScript (ES6+), TypeScript, Python, Java, C++, SQL, HTML5, CSS3
• Frontend Development: React.js, Next.js, Redux Toolkit, Tailwind CSS, Vite, Jest, Webpack
• Backend & APIs: Node.js, Express.js, RESTful APIs, GraphQL, Microservices Architecture, Socket.io
• Databases & Caching: MongoDB, PostgreSQL, Redis, Mongoose, Prisma ORM
• Cloud & DevOps: Docker, Kubernetes, AWS (EC2, S3, Lambda), GitHub Actions CI/CD, Linux, Nginx
• Methodologies & Tools: Git, Postman, Agile/Scrum, Jira, System Design, Data Structures & Algorithms

PROFESSIONAL EXPERIENCE
Software Engineer Intern | CloudScale Technologies, Bangalore (Jan 2024 – June 2024)
• Architected high-throughput payment settlement microservice using Node.js, Express, and Redis, reducing checkout latency by 42% for 200,000+ daily transactions.
• Built responsive, accessible merchant analytics dashboard with React, TypeScript, and Tailwind CSS, increasing user session duration by 28%.
• Automated continuous integration and deployment pipeline using GitHub Actions and Docker, reducing deployment cycle from 45 minutes to 7 minutes.
• Optimized PostgreSQL database queries by introducing compound indexing and connection pooling, decreasing peak server CPU utilization by 35%.

TECHNICAL PROJECTS
AI Resume Analyzer Pro | React, Node.js, Express, MongoDB, Tailwind CSS
• Engineered end-to-end ATS resume evaluation platform parsing text from PDFs and scoring compatibility across 5 distinct recruitment metrics.
• Implemented rule-based natural language parser extracting 180+ technical skills and matching candidates against specific job descriptions.
• Designed fully responsive, theme-adaptive UI with Recharts visualizations, handling 1,500+ mock analysis records with zero memory leaks.

Distributed Task Queue Engine | Python, Redis, Docker, FastAPI
• Built asynchronous distributed task scheduler in Python and Redis handling worker concurrency and automatic retry backoff.
• Processed 50,000+ background jobs per hour with 99.98% reliability and sub-100ms task dispatch overhead.

CERTIFICATIONS & AWARDS
• AWS Certified Cloud Practitioner (Amazon Web Services, 2024)
• Winner, Smart India Hackathon 2023 (1st place among 75 national college teams)
• Global Rank 412 on LeetCode Weekly Contest (Solved 500+ Data Structures & Algorithms problems)
`,
  },
  {
    id: 'entry-cse',
    title: 'Priya Patel - Junior CSE Student (Moderate ATS ~72)',
    role: 'Graduate SDE Trainee',
    fileName: 'Priya_Patel_Resume.pdf',
    text: `PRIYA PATEL
priya.patel2024@gmail.com | +91 9123456789 | Mumbai, India
LinkedIn: https://linkedin.com/in/priyapatel-cs | GitHub: https://github.com/priyapatel-tech

CAREER OBJECTIVE
Enthusiastic Computer Science Engineering student seeking an entry-level Software Engineer role to leverage knowledge of React, JavaScript, and database systems.

EDUCATION
B.Tech in Computer Science and Engineering
Vellore Institute of Technology | 2020 - 2024
CGPA: 8.2 / 10

SKILLS
• Languages: Java, Python, C++, JavaScript
• Web Technologies: React, HTML, CSS, Node.js, Express
• Databases: MySQL, MongoDB
• Tools: Git, GitHub, VS Code, Postman

PROJECTS
E-Commerce Web Portal | React, Node.js, MongoDB
• Developed a full-stack online shopping website with product listing, cart management, and user authentication.
• Created REST APIs using Express.js and integrated MongoDB for persistent product storage.
• Used React state hooks for interactive cart updates and responsive UI layouts.

Campus Placement Portal | React, Node.js, MySQL
• Built web application for students to apply for on-campus company drives and track application statuses.
• Designed database tables in MySQL to manage company listings, eligibility criteria, and candidate applications.
• Implemented role-based login for placement coordinators and student applicants.

ACHIEVEMENTS
• Solved 250+ coding problems on HackerRank and LeetCode.
• Organized annual college coding symposium with 300+ participants.
`,
  },
  {
    id: 'weak-resume',
    title: 'Rahul Verma - Needs Work / Low Impact (Weak ATS ~40)',
    role: 'Student',
    fileName: 'Rahul_Draft_CV.pdf',
    text: `Rahul Verma
Delhi, India

About Me:
I am a hardworking student looking for an IT job in software development.

Education:
B.Tech CSE from Delhi University (2024)

Skills:
HTML, CSS, JavaScript, Python, C

Projects:
• Worked on website project using HTML and CSS.
• Helped create an app in college.
• Did database testing.
• Fixed bugs in user login page.
`,
  },
];

export const SAMPLE_JOBS = [
  {
    id: 'full-stack',
    title: 'Full Stack Software Engineer',
    company: 'FinTech Innovations Inc.',
    description: `We are looking for a Full Stack Software Engineer to join our core engineering team.

Responsibilities:
• Architect, build, and maintain scalable microservice APIs and modern web applications.
• Collaborate with product managers and UX designers to craft intuitive user experiences.
• Optimize application performance, caching, and database queries for low latency.
• Write clean, testable code with automated unit and integration tests.

Required Skills & Qualifications:
• Strong proficiency in JavaScript, TypeScript, React, and Node.js.
• Hands-on experience with Express.js, RESTful APIs, and microservices architecture.
• Strong database experience with MongoDB or PostgreSQL, including query optimization.
• Solid understanding of Git, Docker, and CI/CD pipelines.
• Excellent problem solving and communication skills.

Preferred Skills & Plus:
• Experience with Redis caching and AWS services (EC2, S3, Lambda).
• Familiarity with Next.js and Tailwind CSS.
• Knowledge of distributed messaging systems like Kafka or RabbitMQ.`,
  },
  {
    id: 'frontend',
    title: 'Frontend React Developer',
    company: 'SaaS Platform Labs',
    description: `Seeking a talented Frontend Developer to build high-performance client applications.

Responsibilities:
• Build responsive, accessible, and pixel-perfect web interfaces using React.
• Manage global application state using Redux Toolkit or React Context.
• Collaborate closely with backend engineers on REST and GraphQL API integrations.
• Champion web performance, Core Web Vitals, and responsive mobile design.

Requirements:
• 1+ years experience building production React applications.
• Deep expertise in JavaScript (ES6+), TypeScript, HTML5, and CSS3 / Tailwind CSS.
• Hands-on experience with state management (Redux, Zustand, or Context).
• Proficient with Git, Vite/Webpack, and frontend automated testing (Jest, Cypress).

Nice to have:
• Experience with Next.js SSR/SSG.
• Familiarity with UI libraries and Figma design handoff.`,
  },
  {
    id: 'backend',
    title: 'Backend Systems Engineer',
    company: 'DataFlow Systems',
    description: `Join our backend infrastructure team to build resilient, distributed backend services.

Key Requirements:
• Must have strong proficiency in Node.js, Express, Python, or Go.
• Deep expertise in relational and NoSQL databases: PostgreSQL, MySQL, MongoDB.
• Hands-on experience designing REST APIs and event-driven architectures.
• Experience with Docker containerization, Kubernetes, and Linux server environments.
• Required: Redis caching, Git version control, Postman API testing.

Bonus:
• AWS or GCP cloud certifications.
• Experience scaling applications to handle 100,000+ concurrent requests.`,
  },
];
