import React from "react";

export function toast(message: string) {
    console.log(`%c${message}`, 'color: orange');
}

//TODO: set atom to add message to the list of errors popup
