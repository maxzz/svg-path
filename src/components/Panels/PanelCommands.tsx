import React from 'react';
import { useAtom } from 'jotai';
import { openPanelCmdsAtom } from '../../store/store';
import { SectionPane } from '../UI/SectionPane';
import { Accordion } from '../UI/Accordion';
import { PathCommandEditor } from './PanelCommandsEditor';

export function PanelCommands() {
    const [open, setOpen] = useAtom(openPanelCmdsAtom);
    return (
        <div className="">
            <SectionPane open={open} onClick={() => setOpen(v => !v)}>
                Path Commands
            </SectionPane>
            <Accordion toggle={open}>
                <div className="text-sm bg-slate-300 overflow-hidden">
                    <PathCommandEditor />
                </div>
            </Accordion>
        </div>
    );
}
