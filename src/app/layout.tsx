import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import "./globals.css";

import { CustomAppBar } from "./CustomAppBar";
import { CustomFooter } from "./CustomFooter";
import { CssBaseline } from "@mui/material";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "2S Lab IoT Platform Extension",
  description: "2S Lab IoT Platform Extension",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppRouterCacheProvider>
          <CssBaseline />
          <CustomAppBar />

          <div style={{ marginBottom: "2rem" }}>
            {children}
          </div>



          <CustomFooter />
        </AppRouterCacheProvider>

      </body>
    </html>
  );
}
