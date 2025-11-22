import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./style.css";
import Layout from "@/components/Layouts/Layout";
import { AccountsProvider } from "@/context/AccountsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Trading Journal",
  description: "Trading Journal by Eluri Mahesh",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AccountsProvider>
          <Layout>{children}</Layout>
        </AccountsProvider>
      </body>
    </html>
  );
}
