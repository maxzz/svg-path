import React from 'react';
import './App.css';

function PathPane() {
    return (
        <div className="">pane</div>
    );
}

function PathOptions() {
    return (
        <div className="">options</div>
    );
}

function PathOperations() {
    return (
        <div className="">operations</div>
    );
}

function PathCommands() {
    return (
        <div className="">commands</div>
    );
}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <p className='text-red-700 font-black'>Ground zero</p>
                <PathOptions />
                <PathOptions />
                <PathOperations />
                <PathCommands />
            </header>
        </div>
    );
}

export default App;
