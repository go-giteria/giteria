import { ReactNode } from 'react'
import { Card } from './Card'
import { Button } from './Button'

interface Repository {
  id: number
  name: string
  full_name: string
  description?: string
  private: boolean
  fork: boolean
  mirror: boolean
  template: boolean
  empty: boolean
  html_url: string
  ssh_url: string
  clone_url: string
  stars: number
  forks: number
  watchers: number
  open_issues_count: number
  default_branch: string
  created_at: string
  updated_at: string
  language?: string
  owner: {
    id: number
    username: string
    avatar: string
  }
}

interface RepoCardProps {
  repo: Repository
  showActions?: boolean
}

export function RepoCard({ repo, showActions = true }: RepoCardProps) {
  const getRepoIcon = () => {
    if (repo.fork) return '🍴'
    if (repo.mirror) return '🪞'
    if (repo.template) return '📋'
    if (repo.private) return '🔒'
    return '📁'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card hover className="group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">{getRepoIcon()}</span>
            <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600">
              <a href={repo.html_url} className="hover:underline">
                {repo.full_name}
              </a>
            </h3>
          </div>
          
          {repo.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {repo.description}
            </p>
          )}
          
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center">
              <span className="mr-1">⭐</span>
              <span>{repo.stars.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center">
              <span className="mr-1">🍴</span>
              <span>{repo.forks.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center">
              <span className="mr-1">👁</span>
              <span>{repo.watchers.toLocaleString()}</span>
            </div>
            
            {repo.language && (
              <div className="flex items-center">
                <span className="mr-1">💻</span>
                <span>{repo.language}</span>
              </div>
            )}
            
            <div className="flex items-center">
              <span className="mr-1">📅</span>
              <span>Updated {formatDate(repo.updated_at)}</span>
            </div>
          </div>
        </div>
        
        {showActions && (
          <div className="flex flex-col space-y-2 ml-4">
            <Button variant="ghost" size="sm">
              ⭐ Star
            </Button>
            <Button variant="secondary" size="sm">
              🍴 Fork
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}