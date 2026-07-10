import { AddProjectModal } from '@/components/modals';
import { Button } from '@/components/ui'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'



const AddProject = () => {
    const [createModalOpen, setCreateModalOpen] = useState<boolean>(true);
    return (
      <>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">Projects</h2>
          <Button onClick={() => setCreateModalOpen(true)} disabled={!createModalOpen}>
            <Plus className="w-4 h-4" />
            New Project
          </Button>
            </div>
            <AddProjectModal isOpen={createModalOpen} onClose={()=>setCreateModalOpen(false)}  />
      </>
  )
}

export default AddProject