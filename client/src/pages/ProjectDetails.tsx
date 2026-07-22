import { useGetProject } from '@/hooks/projectHook';
import React from 'react'
import { useParams } from 'react-router-dom';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string|number }>();
  const { data: project, isLoading } = useGetProject(projectId)
  // console.log("Hi", project)
  return (
    <div className='bg-red-400 text-2xl text-center'>
      <p className='text-4xl text-slate-50'>
        {!isLoading ? project?.name : "Still Loading"}
      </p>
    </div>
  )
}

export default ProjectDetails