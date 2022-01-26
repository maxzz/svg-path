import React from 'react';
import { useAtom } from 'jotai';
import { openPanelOptsAtom } from '../../store/store';
import { Accordion } from '../UI/Accordion';
import { SectionPane } from '../UI/SectionPane';
import { PanelCanvasControlsInternals } from './PanelCanvasControls';

export default function PanelOptions() {
    const [open, setOpen] = useAtom(openPanelOptsAtom);
    return (
        <div className="">
            <SectionPane open={open} onClick={() => setOpen(v => !v)}>
                Options
            </SectionPane>
            <Accordion toggle={open}>
                <div className="text-sm bg-slate-300 overflow-hidden">

                    <div className="px-3 py-3 bg-slate-400/40 rounded flex items-center space-x-2">
                        <PanelCanvasControlsInternals />
                    </div>
                    {/* <br />
                    Configuration. Ground zero
                    <br />
                    <br /> */}
                </div>
            </Accordion>
        </div>
    );
}
