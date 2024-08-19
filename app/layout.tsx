import type { Metadata } from "next";
//import { Inter } from "next/font/google";
import { Inter, Grey_Qo } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--inter",
});
const grey_Qo = Grey_Qo({
  subsets: ["latin"],
  weight: "400",
  variable: "--grey-qo",
})

export const metadata: Metadata = {
  title: {
    template: "%s | Karrot Market",
    default: "Karrot Market",
  },
  description: "Sell and buy all the things",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${grey_Qo.variable} bg-gray-900 text-white max-w-screen-sm mx-auto`}>
        {children}
      </body>
    </html>
  );
}
