import type { EducationEntry } from "@/lib/types";

export const educationEntries: EducationEntry[] = [
  {
    id: "edu-001",
    program: "Diploma in Computer Science Engineering",
    institution: "SAPTAC, Bengaluru, Karnataka",
    startDate: "2023",
    endDate: "2026",
    current: true,
    semester: "Semester 5",
    pathway: "Cybersecurity",
    coursework: [
      "Computer Networks",
      "Operating Systems",
      "Database Management",
      "Web Technologies",
      "Cybersecurity Fundamentals",
      "Data Structures",
      "Network Security",
      "Cryptography",
      "Software Engineering",
      "Mobile Computing",
    ],
    highlights: [
      "Currently in Semester 5, focusing on Cybersecurity pathway",
      "Hands-on labs in network security and cryptography",
      "Practical projects in web technologies and OS internals",
    ],
  },
  {
    id: "edu-002",
    program: "SSLC",
    institution: "St. Joseph's High School, Bengaluru, Karnataka",
    startDate: "2020",
    endDate: "2024",
    highlights: [
      "Completed secondary education with strong academic performance",
      "Built foundational knowledge in mathematics and science",
      "First exposure to computers and programming",
    ],
  },
];
