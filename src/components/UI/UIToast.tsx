import React from "react";

export function toast(message: string) {
    console.log(`%c${message}`, 'color: orange');
}

export function toastSVGParse(message: string) {
    console.log(`%c${message}`, 'color: pink');
}

//TODO: set atom to add message to the list of errors popup
