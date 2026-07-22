import { DashboardLayout } from '@/components/layout';
import { Button } from '@/components/ui';
import { DataTable } from '@/components/ui/DataTable';
import { Plus } from 'lucide-react';
import React, { useState } from 'react'
import getColumns  from '@/components/lib/Columns';
import { useDeleteProject, useGetProjects, useUpdateProjectState } from '@/hooks/projectHook';
import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from '@/components/modals';
import { Project } from '@/@types/project.t';



const ProjectPage = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1)

    // const [projectState, setProjectState] =useState<UpdateProjectStateInput>({isActive: false});

    const { data: allProject = [], isLoading } = useGetProjects()
    const deleteMutation = useDeleteProject();
    const updateProjectState = useUpdateProjectState()

    const navigate = useNavigate();
    const [selectedProject, setSelectedProject] =useState<Project | null>(null);
    
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

    
    
    const onUpdateProjectState = () => {
        if (!selectedProject) return;
        
        updateProjectState.mutate({
            id: selectedProject?.id,
            projectData: {
                isActive: !selectedProject?.isActive
            }
        })
    }
    const columns = getColumns({ navigate, setSelectedProject, setDeleteModalOpen, onUpdateProjectState });

    const onDeleteCalled = () => {
        if (selectedProject) {
            deleteMutation.mutate(selectedProject?.id)
            setDeleteModalOpen(false)
        }
    }

    // console.log(searchQuery, currentPage, setCurrentPage, setSearchQuery, deleteModalOpen)
    return (    
        <DashboardLayout>
        <div className="max-w-6xl mx-auto">
        {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
                        Projects
                    </h1>
                    <p className="text-secondary-600 text-xl dark:text-secondary-400">
                        Manage your projects, API keys.
                    </p>
                </div>
            </div>
                <Button className='w-full mb-2' variant='success' size='lg' >
                    <Plus className="w-4 h-4" />
                    New Project
                </Button>
            </div>
            
            {/* All Project */}
            <DataTable
                searchable
                onRowClick={(p) => navigate(`/project/${p.id}`)}
                keyExtractor={(p) => p.id}
                data={!isLoading ? allProject : []}
                totalItems={allProject.length}
                searchPlaceholder='Search.....'
                columns={columns}
                onSearchChange={setSearchQuery}
                searchValue={searchQuery}
                paginated
                pageSize={5}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />


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

        </DashboardLayout>
    )
}

export default ProjectPage