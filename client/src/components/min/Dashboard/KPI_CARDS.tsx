import { Card } from '@/components/ui/index'
import { FolderKanban, Activity } from 'lucide-react'
import React from 'react'


interface KPI_CARD_TYPE{
  projectsCount: number;
  activeProjects: number;
  maxProjects: number;
}

const KPI_CARDS = ({projectsCount, activeProjects, maxProjects}:KPI_CARD_TYPE) => {
  return (
       <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-secondary-600 dark:text-secondary-400">Total Projects</span>
              <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-secondary-900 dark:text-white mb-1">
              {projectsCount}
            </div>
            <div className="text-sm text-secondary-500">
              {maxProjects === -1 ? 'Unlimited' : `${maxProjects - projectsCount} remaining`}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-secondary-600 dark:text-secondary-400">Active Projects</span>
              <div className="w-10 h-10 bg-accent-50 dark:bg-accent-900/20 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-secondary-900 dark:text-white mb-1">
              {activeProjects}
            </div>
            <div className="text-sm text-secondary-500">
              {projectsCount === 0 ? 'No projects yet' : `${Math.round((activeProjects / projectsCount) * 100)}% active`}
            </div>
          </Card>
        </div>

  )
}

export default KPI_CARDS