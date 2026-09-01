import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/siteConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  // Only used for small accents (IDs, timers) — don't preload on every page
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),

  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },

  description: SITE.description,
  keywords: [...SITE.keywords],

  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    images: [
      {
        url: "/icon1.png",
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: ["/icon1.png"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${SITE.url}/#organization`,

  name: SITE.name,
  alternateName: SITE.shortName,

  url: SITE.url,
  logo: `${SITE.url}/icon1.png`,
  image: `${SITE.url}/icon1.png`,

  description: SITE.description,

  email: SITE.email,
  telephone: SITE.phoneTel,

  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },

  sameAs: [SITE.social.instagram, SITE.social.linkedin]
};


const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",

  "@id": `${SITE.url}/#website`,

  url: SITE.url,
  name: SITE.name,

  publisher: {
    "@id": `${SITE.url}/#organization`
  }
};


  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} light h-full antialiased`}
      style={{ colorScheme: "light" }}
    >
      <head>
        <meta
          name="apple-mobile-web-app-title"
          content="Vivexa Institute of Technology"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>

      <body className="min-h-full">{children}</body>
    </html>
  );
}