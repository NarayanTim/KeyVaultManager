import { DashboardLayout } from '@/components/layout/index'
import React from 'react'
import { KPI_CARDS, AddProject } from './../components/min/Dashboard/index';
import { useGetProject } from '@/hooks/projectHook';



const Dashboard = () => {

  // const mockApiKeys = [
  //   {
  //     id: 'key_1',
  //     name: 'Development Key',
  //     project_id: 'proj_1',
  //     key_prefix: 'key_a1b2c3',
  //     key_hash: 'hash_123',
  //     type: 'development',
  //     status: 'active',
  //     last_used_at: '2024-01-20T14:25:00Z',
  //     created_at: '2024-01-15T10:35:00Z',
  //     updated_at: '2024-01-15T10:35:00Z',
  //   },
  //   {
  //     id: 'key_2',
  //     name: 'Production Key',
  //     project_id: 'proj_1',
  //     key_prefix: 'key_x9y8z7',
  //     key_hash: 'hash_456',
  //     type: 'production',
  //     status: 'active',
  //     last_used_at: '2024-01-22T09:15:00Z',
  //     created_at: '2024-01-15T10:40:00Z',
  //     updated_at: '2024-01-15T10:40:00Z',
  //   },
  // ];



  // const projectsCount:number = 2;
  
  const maxProjects:number = 10;
  const { data: allProject = [], isLoading } = useGetProject();
  console.log(allProject, "-------------");
  // const activeProjects = allProject.filter((p) => p.status === 'active').length;
  
  const activeProjects = allProject?.length ?? 0;
  const projectsCount = allProject?.length ?? 0;
  console.log(projectsCount)


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
        {isLoading}

        {/* KPI Cards - Needs to work on it */}
        <KPI_CARDS projectsCount={projectsCount} activeProjects={activeProjects} maxProjects={maxProjects} />
        <AddProject/>
      {/* Min Dive First One */}
      </div>
   </DashboardLayout>
  )
}

export default Dashboard