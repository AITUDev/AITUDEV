import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })


export const metadata: Metadata = {
  title: "AITU Dev - Student Tech Team",
  description: "Empowering students at Assiut International Technological University through technology, innovation, and collaborative learning.",
  keywords: "AITU, student tech team, programming, web development, AI, machine learning, Assiut University",
  generator: 'v0.dev',
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-XRQ3VSSSXL`}
          strategy="afterInteractive"/>

        <Script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XRQ3VSSSXL');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
