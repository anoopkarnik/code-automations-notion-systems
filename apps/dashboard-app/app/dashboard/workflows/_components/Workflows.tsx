import { Card } from '@repo/ui/molecules/shadcn/Card'
import React, { useEffect, useState } from 'react'
import { getWorkflows } from '../../../../actions/workflows/workflow'
import { useSession } from 'next-auth/react'
import Workflow from './Workflow'

const Workflows = () => {
    const [workflows,setWorkflows] = useState<any>([])
    const session = useSession();
    const userId = session.data?.user?.id;

    useEffect(()=>{
        async function fetchWorkflows(){
            const flows = await getWorkflows(userId || '');
            setWorkflows(flows);
        }
        fetchWorkflows()
    },[])
  return (
    <div className='grid grid-cols-1 sm:grid-cols2 md:grid-cols-3 w-full p-10 overflow-y-auto gap-4'>
        {workflows?.map((workflow:any) => (
            <Workflow key={workflow.id} workflow={workflow}/>
        ))}
    </div>
  )
}

export default Workflows