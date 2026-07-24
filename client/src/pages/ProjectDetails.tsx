import EnvVariablesManager from '@/components/EnvironmentVariables/EnvVariablesManager';
import { useGetAllKeys } from '@/hooks/keysHook';
import { useGetProject } from '@/hooks/projectHook';
import React from 'react'
import { useParams } from 'react-router-dom';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading } = useGetProject(projectId)
  const { data: allKeys = [], isKeyLoading } = useGetAllKeys(projectId);

  return (
    <div className='bg-red-400 text-2xl text-center'>
      <p className='text-4xl text-slate-50'>
        {!isLoading ? project?.name : "Still Loading"}
      </p>
      <div className='bg-slate-100'>
        <h1>Still Loading</h1>
      {
        !isKeyLoading && allKeys.map((k) => (
          <h1 key={k.id} className='text-2xl text-amber-700 bg-amber-100'>{k.value}</h1>
        ))
      }
      </div>
      <EnvVariablesManager/>
    </div>
  )
}

export default ProjectDetails