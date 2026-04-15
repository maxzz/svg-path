import { useAtom } from 'jotai';
import { openPanelCmdsAtom } from '../../store/store';
import { SectionPane } from '../ui/SectionPane';
import { Accordion } from '../ui/Accordion';
import { PathCommandEditor } from './PanelCommandsEditor';

export function PanelCommands() {
    const [open, setOpen] = useAtom(openPanelCmdsAtom);
    return (
        <div className="">
            <SectionPane open={open} onClick={() => setOpen(v => !v)}>
                <div className="pr-1 pt-1 flex-1">
                    Path Commands
                </div>
            </SectionPane>
            <Accordion toggle={open}>
                <div className="text-sm bg-slate-300 overflow-hidden">
                    <PathCommandEditor />
                </div>
            </Accordion>
        </div>
    );
}
