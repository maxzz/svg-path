import { useAtom } from "jotai";
import React from "react";
import { svgAtom } from "../../store/store";
import { IconMenu } from "../UI/icons/Icons";

function CommandName({ command, abs }: { command: string; abs: boolean; }) {
    return (
        <label className={`flex-0 overflow-hidden focus-within:text-blue-500`}>
            {/* <input className="px-1 w-full text-xs text-center text-slate-900 bg-slate-500 focus:outline-none" defaultValue={"M"} /> */}
            <button className="px-1 pb-[1px] rounded-l-sm text-xs text-center text-slate-900 bg-slate-500 ">{command}</button>
        </label>
    );
}

function CommandInput() {
    return (
        <label className={`flex-1 max-w-[2rem] rounded-tl-sm overflow-hidden focus-within:text-blue-500`}>
            <input className="px-1 pb-[1px] w-full h-full text-xs text-center text-slate-900 focus:border-blue-500 bg-slate-200 focus:outline-none" defaultValue={"11"} />
        </label>
    );
}

export function PathCommandEditor() {
    const [svg] = useAtom(svgAtom);
    console.log('svg', [...svg.path]);

    return (
        <div className="my-1">
            {/* Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-items-start space-x-0.5">
                    <CommandName command="m" abs={true} />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                </div>
                <button className="flex-0 px-1 mt-0.5 active:scale-[.97]">
                    <IconMenu className="w-4 h-4" />
                </button>
            </div>
            {/* Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-items-start space-x-0.5">
                    <CommandName command="m" abs={true} />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                </div>
                <button className="flex-0 px-1 mt-0.5 active:scale-[.97]">
                    <IconMenu className="w-4 h-4" />
                </button>
            </div>
            {/* Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-items-start space-x-0.5">
                    <CommandName command="m" abs={true} />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                </div>
                <button className="flex-0 px-1 mt-0.5 active:scale-[.97]">
                    <IconMenu className="w-4 h-4" />
                </button>
            </div>
            {svg.path.map((path, idx) => (
                <React.Fragment key={idx}>
                    <div className="">{path.asString()}</div>
                </React.Fragment>
            ))}
        </div>
    );
}
