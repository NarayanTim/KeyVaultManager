import { DashboardLayout } from '@/components/layout/index'
import React, { useState } from 'react'
import { KPI_CARDS, AddProject } from './../components/min/Dashboard/index';
import { useGetLatestProjects, useDeleteProject, useUpdateProjectState } from '@/hooks/projectHook';
import { DataTable } from '@/components/ui/DataTable';
import getColumns from '@/components/lib/Columns';
import { EmptyState } from '@/components/feedback';
import { FolderOpen } from 'lucide-react';
import { Card } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { Project } from './../@types/project.t';
import { ConfirmModal } from '@/components/modals';


const Dashboard = () => {

  const maxProjects: number = 10; // How Manay Project can be added based on mership type
  
  const { data: allProject = [], isLoading } = useGetLatestProjects();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const deleteMutation = useDeleteProject()
  const updateProjectState = useUpdateProjectState()

  const navigate = useNavigate();
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);


  const activeProjects = allProject?.length ?? 0;
  const projectsCount = allProject?.length ?? 0;

  const onUpdateProjectState = (project: Project) => {
      if (!project) return;
      updateProjectState.mutate({
          id: project?.id,
          projectData: {
              isActive: !project?.isActive
          }
      })
      setSelectedProject(null)
    }

    const onDeleteCalled = () => {
        if (selectedProject) {
            deleteMutation.mutate(selectedProject?.id)
            setDeleteModalOpen(false)
        }
    }
  
  
  const columns = getColumns({navigate,setSelectedProject,setDeleteModalOpen, onUpdateProjectState});

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
                data={!isLoading ? allProject : []}
                onRowClick={(p) => navigate(`/project/${p.id}`)}
                keyExtractor={(p) => p.id}
                columns={columns}
                onSearchChange={setSearchQuery}
                searchValue={searchQuery}
                paginated
                pageSize={1}
                currentPage={currentPage}
                totalItems={allProject.length}
                onPageChange={setCurrentPage}
              />
          )
          }
      </div>
      <>
      
        <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={onDeleteCalled}
                title="Delete Project"
                description={
                    <>
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-secondary-900 dark:text-white">
                        {selectedProject?.name}
                        </span>
                        ? This action cannot be undone and will permanently delete all associated
                        environment variables and API keys.
                    </>
                }
                confirmText='Deleted Project'
                variant='danger'
                loading={deleteMutation.isPending}
            
                />
      
      </>
    
    </DashboardLayout>
  )
}

export default Dashboard