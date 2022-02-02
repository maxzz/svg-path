import React from "react";
import { toastWarning } from "./UiToaster";

export function toast(message: string) {
    console.log(`%c${message}`, 'color: orange');
    toastWarning(message);
}

export function toastSVGParse(message: string) {
    console.log(`%c${message}`, 'color: pink');
    toastWarning(message);
}

//TODO: set atom to add message to the list of errors popup
