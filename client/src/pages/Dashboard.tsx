import { DashboardLayout } from '@/components/layout/index'
import React, { useState } from 'react'
import { KPI_CARDS, AddProject } from './../components/min/Dashboard/index';
import { useGetLatestProjects } from '@/hooks/projectHook';
import { DataTable } from '@/components/ui/DataTable';
import getColumns from '@/components/lib/Columns';
import { EmptyState } from '@/components/feedback';
import { FolderOpen } from 'lucide-react';
import { Card } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { Project } from './../@types/project.t';


const Dashboard = () => {

  const maxProjects:number = 10;
  const { data: allProject = [], isLoading } = useGetLatestProjects();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] =useState<Project | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);


  const activeProjects = allProject?.length ?? 0;
  const projectsCount = allProject?.length ?? 0;
  console.log(projectsCount, selectedProject, deleteModalOpen)

  const columns = getColumns({navigate,setSelectedProject,setDeleteModalOpen});

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Welcome back! Here's an overview of your projects and keys.
          </p>
        </div>

        {/* Upgrade Banner */}

        {/* KPI Cards - Needs to work on it */}
        <KPI_CARDS projectsCount={projectsCount} activeProjects={activeProjects} maxProjects={maxProjects} />
        <AddProject/>
        {
          projectsCount === 0 || isLoading ? (
          <Card>
              <EmptyState
                icon={FolderOpen}
                title="No Projects Yet"
                description="Create your first project to get started."
              />
            </Card>
          ): (
              
              <DataTable
                searchable
                searchPlaceholder='Search projects...'
                onRowClick={(p) => navigate(`/projects/${p.id}`)}
                data={!isLoading ? allProject : []}
                keyExtractor={(p) => p.id}
                columns={columns}
                onSearchChange={setSearchQuery}
                searchValue={searchQuery}
              />
          )
          }
      </div>
    </DashboardLayout>
  )
}

export default Dashboard