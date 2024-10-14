import CodeMirror from '@uiw/react-codemirror';
// @ts-ignore
import { python } from '@codemirror/lang-python';
import React, { useEffect } from 'react';
import { oneDark } from '@codemirror/theme-one-dark';
import { useContext, useState } from 'react';
import { Button } from '@repo/ui/atoms/shadcn/Button';
import  { Alert, AlertDescription } from '@repo/ui/atoms/shadcn/Alert';
import { useToast } from '../../../../../../../../hooks/useToast';
import { getSession, useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { EditorContext } from '../../../../../../../../providers/editor-provider';
import { createActionAction, updateActionAction } from '../../../../../../../actions/workflows/workflow';import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui/molecules/shadcn/Accordion';
import { Label } from '@repo/ui/atoms/shadcn/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/molecules/shadcn/Select';
import { getDatabases } from '../../../../../../../actions/notion/notion';
import { getNotionConnection } from '../../../../../../../actions/connections/notion-connections';
import SearchableSelect from '@repo/ui/molecules/custom/SearchableSelect';
import { Input } from '@repo/ui/atoms/shadcn/Input';
import GetVariables from './GetVariables';
;

export const PythonCode = ({funcType,nodeType,type,subType,node}: any) => {
    const {toast} = useToast();
    const params = useParams();
    const editorId = params?.editorId
    const router = useRouter();
    const editor = useContext(EditorContext);
    const [code, setCode] = useState(node?.metadata?.code || '// Write your python code here');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [logs, setLogs] = useState('');

    const onSubmit = async () => {
        const session = await getSession()
        const userId = session?.user?.id
        let metadata = {
            code: code
        }
        const params = {
            workflowId: editorId,
            actionId: subType.id,
            metadata,
            sortingOrder: editor.actions.length+1
        }
        let res;
        console.log('params',params)
        if (funcType == 'create'){
            res = await createActionAction(params)
        }
        else{
            res = await updateActionAction({id:node.id, actionId:node.actionId, metadata:metadata })
        }
        if (res.success){
            toast({title: "Success", description: res?.success, variant: 'default'})
            router.refresh()
            router.push(`/automations/editor/${editorId}`)
        }
        else if (res.error){
            toast({title: "Error", description: res?.error, variant: 'destructive'})
        }
    }

    const modifyCode = (value: string) => {
        if (typeof value === 'string') {
            setCode(value);
        }
        else if (typeof value === 'object') {
            setCode(JSON.stringify(value));
        }
    }


    return (
        <div className='flex flex-col gap-4'>
            <GetVariables/>
            <CodeMirror
                value={code}
                onChange={(value) => modifyCode(value)}
                height="500px"
                theme="dark"
                extensions={[python()]}
                className="border rounded"
            />
            <div className='flex w-full justify-center gap-4'>
                <Button size="lg" variant="default" onClick={() => modifyCode('// Write your python code here')}>Clear</Button>
                <Button size="lg" variant="default" type="submit" onClick={onSubmit} > Add / Edit Action</Button>
            </div>
            {output && (
                <Alert>
                <AlertDescription>
                    <pre>{typeof output === 'object' ?
                     JSON.stringify(output) : output }</pre>
                </AlertDescription>
                </Alert>
            )}
            {error && (
                <Alert variant="destructive">
                <AlertDescription>
                    <pre>{error}</pre>
                </AlertDescription>
                </Alert>
            )}
            {logs && (
                <Alert variant="default">
                <AlertDescription>
                    <pre>{logs}</pre>
                </AlertDescription>
                </Alert>
            )}
        </div>
    )
}