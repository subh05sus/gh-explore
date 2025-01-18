"use client"

import { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Folder, File, GitBranch, Star, Eye, Users, Calendar, Copy, ChevronRight, ChevronDown, Github } from 'lucide-react'
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"

interface RepoDetails {
  name: string
  description: string
  stars: number
  watchers: number
  defaultBranch: string
  fileStructure: FileNode[]
  createdAt: string
  updatedAt: string
  language: string
  license: string
  openIssues: number
  forks: number
  private: boolean
}

interface FileNode {
  name: string
  type: "file" | "dir"
  path: string
  children?: FileNode[]
  collapsed?: boolean
}

export default function RepoExplorer() {
  const { data: session } = useSession()
  const [repoUrl, setRepoUrl] = useState("")
  const [repoDetails, setRepoDetails] = useState<RepoDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRepoDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const url = new URL(repoUrl)
      const urlDetails = url.pathname.split('/')
      const owner = urlDetails[urlDetails.length-2];
      const repo = urlDetails[urlDetails.length-1];
      if (!owner || !repo) {
        throw new Error("Invalid GitHub repository URL")
      }
      const response = await fetch(`/api/github?owner=${owner}&repo=${repo}`)
      if (!response.ok) {
        throw new Error("Failed to fetch repository details")
      }
      const data = await response.json()
       // Set collapsed to true for all directories initially
       const collapseFiles = (files: FileNode[]): FileNode[] => {
        return files.map(file => ({
          ...file,
          collapsed: true,
          children: file.type === 'dir' && file.children ? collapseFiles(file.children) : file.children,
        }))
      }
      data.fileStructure = collapseFiles(data.fileStructure) // Collapse all directories
      setRepoDetails(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const toggleCollapse = (node: FileNode) => {
    if (node.type === "dir") {
      node.collapsed = !node.collapsed
      setRepoDetails({ ...repoDetails! })
    }
  }

  const renderFileStructure = (node: FileNode) => (
    <motion.div
      key={node.path}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center cursor-pointer" onClick={() => toggleCollapse(node)}>
        {node.type === "dir" && (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: node.collapsed ? 0 : 90 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={16} />
          </motion.div>
        )}
        {node.type === "dir" ? <Folder className="inline-block mr-2" size={16} /> : <File className="inline-block mr-2" size={16} />}
        {node.name}
      </div>
      <AnimatePresence>
        {node.type === "dir" && !node.collapsed && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4  pl-2"
          >
            {node.children.map((child, index) => (
              <div key={child.path} className="relative">
                {index < node.children!.length - 1}
                {renderFileStructure(child)}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  const generateCopyableStructure = (node: FileNode, depth = 0, isLast = false): string => {
    const indent = '    '.repeat(depth)
    const prefix = depth === 0 ? '' : (isLast ? '└── ' : '├── ')
    let result = `${indent}${prefix}${node.name}\n`
    if (node.type === 'dir' && node.children) {
      node.children.forEach((child, index) => {
        result += generateCopyableStructure(child, depth + 1, index === node.children!.length - 1)
      })
    }
    return result
  }

  const copyFullStructure = () => {
    if (repoDetails) {
      const structure = repoDetails.fileStructure.map((node, index) => 
        generateCopyableStructure(node, 0, index === repoDetails.fileStructure.length - 1)
      ).join('')
      navigator.clipboard.writeText(structure)
    }
  }

  return (
  
<Card className="w-full max-w-3xl">
  <CardHeader>
    <div className="flex flex-wrap justify-between items-center gap-2">
      <CardTitle>GitHub Repo Explorer</CardTitle>
      <div className="fixed top-2 right-2">
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        {session ? (
          <Button onClick={() => signOut()}>Sign Out</Button>
        ) : (
          <Button onClick={() => signIn("github")}>
            <Github className="mr-2 h-4 w-4" /> Sign In with GitHub
          </Button>
        )}
      </div>
      </div>
    </div>
    <CardDescription>
      {session
        ? `Signed in as ${session.user?.name}. You can now explore your private repositories.`
        : "Enter a GitHub repository URL to explore its details. Sign in to access private repositories."}
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex flex-wrap md:flex-row flex-col w-full items-center gap-2">
      <Input
        className="flex-1 min-w-0"
        placeholder="https://github.com/owner/repo"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />
      <Button onClick={fetchRepoDetails} disabled={loading} className="md:w-auto w-full">
        {loading ? "Loading..." : "Explore"}
      </Button>
    </div>
    {error && <p className="text-red-500 mt-2">{error}</p>}
    {repoDetails && (
      <div className="mt-4">
        <h2 className="text-2xl font-bold">{repoDetails.name}</h2>
        <p className="text-muted-foreground">{repoDetails.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center">
            <Star className="mr-2" size={16} />
            <span>{repoDetails.stars} stars</span>
          </div>
          <div className="flex items-center">
            <Eye className="mr-2" size={16} />
            <span>{repoDetails.watchers} watchers</span>
          </div>
          <div className="flex items-center">
            <GitBranch className="mr-2" size={16} />
            <span>{repoDetails.defaultBranch}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2" size={16} />
            <span>Created: {new Date(repoDetails.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2" size={16} />
            <span>Updated: {new Date(repoDetails.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            {repoDetails.private ? (
              <span className="text-red-500">Private</span>
            ) : (
              <span className="text-green-500">Public</span>
            )}
          </div>
        </div>
        <div className="mt-4">
          <p><strong>Language:</strong> {repoDetails.language}</p>
          <p><strong>License:</strong> {repoDetails.license || "Not specified"}</p>
          <p><strong>Open Issues:</strong> {repoDetails.openIssues}</p>
          <p><strong>Forks:</strong> {repoDetails.forks}</p>
        </div>
        <h3 className="text-xl font-semibold mt-6">File Structure</h3>
        <Button onClick={copyFullStructure} className="mt-2 mb-4">
          <Copy className="mr-2" size={16} />
          Copy Full Structure
        </Button>
        <div className="mt-2 overflow-x-auto">
          {repoDetails.fileStructure.map(renderFileStructure)}
        </div>
      </div>
    )}
  </CardContent>
</Card>

  )
}

