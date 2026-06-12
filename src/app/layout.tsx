import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { Toaster } from "sonner";
import { DemoProvider } from "@/store/demoStore";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-be",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Webresfolio — Expense Control System | Rayudu Gari Military Hotel",
  description: "Complete Expense Visibility & Control — track, approve, and report every expense.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${beVietnam.variable} h-full`}>
      <body
        className="min-h-full antialiased"
        style={{ fontFamily: "var(--font-be, 'Be Vietnam Pro', system-ui, sans-serif)" }}
      >
        <DemoProvider>
          {children}
          <Toaster
            position="bottom-right"
            richColors
            toastOptions={{
              style: {
                fontFamily: "var(--font-be, 'Be Vietnam Pro', system-ui, sans-serif)",
                fontSize: "13px",
                fontWeight: 500,
              },
            }}
          />
        </DemoProvider>
      </body>
    </html>
  );
}
