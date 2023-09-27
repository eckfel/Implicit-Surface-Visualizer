import '../App.scss';
import '../Styles/Inputs.scss'
import React, { useState, forwardRef, useRef, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';

// Component for displaying and editing the formula of the implicit surface that should be rendered
const Inputs = forwardRef((props, ref) => {

    //##################################################################
    // Variable declaration
    //##################################################################

    // Timer to wait for user to stop typing before sending request to backend
    const [timeout, setTimeoutVar] = useState(null);
    const functionInput = useRef()

    //##################################################################
    // Functions
    //##################################################################

    // Places cursor to write into input field
    function focusInput() {
        functionInput.current.focus();
    }

    // Update the function describing the implicit surface in the state and request a model after the user stopped typing for a given time
    async function onVisualizationFunctionChange(event) {
        props.setVisualizationFunction(event.target.value)

        // Clear function that should be executed if timer runs out
        if (timeout) {
            clearTimeout(timeout);
            setTimeoutVar(null)
        }

        // Set a timer to execute function sending request to the backend
        setTimeoutVar(setTimeout(function () {
            props.submitFunction(event.target.value)
        }, 1500))
    }

    //Initialize Component after everything is loaded
    useEffect(() => {
        focusInput()
    })

    return (
        <div className="App-inputs">
            <form onSubmit={(e) => e.preventDefault()}>
                <div className='ImageHelper'>
                    <Tooltip title="Type in a function with the variables 'x', 'y', and 'z'. Supported operations are '+', '-', '*', '/', '^', '%', and round brackets.">
                        <h2 className='RemoveTopMargin'>
                            Function:
                        </h2>
                    </Tooltip>
                </div>
                <input ref={functionInput} disabled={props.isLoading} type="text" value={props.visualizationFunction} onChange={(e) => onVisualizationFunctionChange(e)} />
            </form>
        </div>
    );
})

export default Inputs;
