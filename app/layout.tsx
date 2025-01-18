import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/components/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GitHub Repo Explorer - Explore GitHub Repositories Effortlessly",
  description:
    "GitHub Repo Explorer lets you browse public and private GitHub repositories, copy file structures, and access details with ease. Supports GitHub OAuth and theme toggling for developers.",
  keywords: [
    "GitHub Repo Explorer",
    "GitHub OAuth app",
    "GitHub API explorer",
    "repository browser",
    "private repo access",
    "developer tools",
    "copy file structure",
    "Next.js",
    "React TypeScript app",
  ].join(", "),
  author: "Subhadip Saha (www.subhadip.me)",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
  },
  openGraph: {
    title: "GitHub Repo Explorer",
    description:
      "Effortlessly browse repositories, access private repos, and copy file structures for documentation. GitHub OAuth-supported.",
    url: "https://gh-explore.subhadip.me/",
    siteName: "GitHub Repo Explorer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GitHub Repo Explorer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@SubhadipDev",
    creator: "@SubhadipDev",
    title: "GitHub Repo Explorer",
    description:
      "Explore public and private GitHub repositories with ease. Supports file structure copying, theme toggling, and OAuth for developers.",
    images: [
      {
        url: "/og-image.png",
        alt: "GitHub Repo Explorer",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* General Meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://gh-explore.subhadip.me/" />

        {/* Favicons */}
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        {/* Open Graph Meta */}
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta
          property="og:description"
          content={metadata.openGraph.description}
        />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta
          property="og:image"
          content={metadata.openGraph.images[0].url}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={metadata.openGraph.locale} />

        {/* Twitter Meta */}
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:site" content={metadata.twitter.site} />
        <meta name="twitter:creator" content={metadata.twitter.creator} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta
          name="twitter:description"
          content={metadata.twitter.description}
        />
        <meta name="twitter:image" content={metadata.twitter.images[0].url} />
        <meta name="twitter:image:alt" content={metadata.twitter.images[0].alt} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
