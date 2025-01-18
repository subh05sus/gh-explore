import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const owner = searchParams.get("owner")
  const repo = searchParams.get("repo")

  if (!owner || !repo) {
    return NextResponse.json({ error: "Missing owner or repo parameter" }, { status: 400 })
  }

  try {
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET
    })

    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    }

    if (token?.accessToken) {
      headers['Authorization'] = `Bearer ${token.accessToken}`
    }

    const [repoData, contentsData] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, { headers }),
    ])

    if (!repoData.ok || !contentsData.ok) {
      throw new Error("Failed to fetch repository data")
    }

    const repoJson = await repoData.json()
    const contentsJson = await contentsData.json()

    const fileStructure = await buildFileStructure(owner, repo, contentsJson, headers)

    return NextResponse.json({
      name: repoJson.name,
      description: repoJson.description,
      stars: repoJson.stargazers_count,
      watchers: repoJson.watchers_count,
      defaultBranch: repoJson.default_branch,
      fileStructure,
      createdAt: repoJson.created_at,
      updatedAt: repoJson.updated_at,
      language: repoJson.language,
      license: repoJson.license?.name || null,
      openIssues: repoJson.open_issues_count,
      forks: repoJson.forks_count,
      private: repoJson.private
    })
  } catch (error) {
    console.error("Error fetching repository details:", error)
    return NextResponse.json({ error: "Failed to fetch repository details" }, { status: 500 })
  }
}

async function buildFileStructure(owner: string, repo: string, contents: any[], headers: HeadersInit, path = "") {
  const structure = []

  for (const item of contents) {
    if (item.type === "file") {
      structure.push({
        name: item.name,
        type: "file",
        path: item.path,
      })
    } else if (item.type === "dir") {
      const subContentsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${item.path}`, { headers })
      const subContents = await subContentsResponse.json()

      structure.push({
        name: item.name,
        type: "dir",
        path: item.path,
        children: await buildFileStructure(owner, repo, subContents, headers, item.path),
        collapsed: false
      })
    }
  }

  return structure.reverse()
}

