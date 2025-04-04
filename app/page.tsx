import { Metadata } from "next"
import RepoExplorer from "@/components/repo-explorer"
import FloatingButton from "@/components/FloatingButton"

export const metadata: Metadata = {
  title: "GitHub Repo Explorer",
  description: "Explore GitHub repositories with ease",
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center lg:p-24 md:p-16 p-8 py-16">
      <RepoExplorer />
      <FloatingButton />
    </main>
  )
}

