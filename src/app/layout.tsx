import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Crispian — Full-Stack Engineer | Remote-Ready",
  description:
    "Personal portfolio of Crispian, a Full-Stack Software Engineer specializing in modern web technologies. Available for remote opportunities worldwide.",
  keywords: [
    "Crispian",
    "Full-Stack Engineer",
    "Software Engineer",
    "Remote Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Portfolio",
  ],
  authors: [{ name: "Crispian" }],
  openGraph: {
    title: "Crispian — Full-Stack Engineer | Remote-Ready",
    description:
      "Personal portfolio of Crispian, a Full-Stack Software Engineer available for remote opportunities worldwide.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

