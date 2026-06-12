import type { User } from "@/types";

export const USERS: User[] = [
  {
    id: "u1",
    name: "Rayudu Gari",
    role: "owner",
    email: "owner@rayudugari.in",
    phone: "+91 98490 11234",
    initials: "RG",
    department: "Owner",
  },
  {
    id: "u2",
    name: "Narasimha Rao",
    role: "manager",
    email: "manager@rayudugari.in",
    phone: "+91 97040 55678",
    initials: "NR",
    department: "Operations Manager",
  },
  {
    id: "u3",
    name: "Venkat Reddy",
    role: "supervisor",
    email: "venkat@rayudugari.in",
    phone: "+91 95050 22341",
    initials: "VR",
    department: "Head Supervisor",
  },
  {
    id: "u4",
    name: "Priya Sharma",
    role: "supervisor",
    email: "priya@rayudugari.in",
    phone: "+91 93930 44512",
    initials: "PS",
    department: "Kitchen Supervisor",
  },
  {
    id: "u5",
    name: "Suresh Kumar",
    role: "supervisor",
    email: "suresh@rayudugari.in",
    phone: "+91 91010 77823",
    initials: "SK",
    department: "Store Supervisor",
  },
];

export const getUserByRole = (role: string) => USERS.find((u) => u.role === role) || USERS[0];
