import '../App.scss';
import '../Styles/Settings.scss';
import React, { useState, forwardRef } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';


// Component for changing settings of the application or load example functions for as implicit surface
const Settings = forwardRef((props, ref) => {

    //##################################################################
    // Variable declaration
    //##################################################################

    // Used to wait until user is done sliding the slider
    const [timeout, setTimeoutVar] = useState(null);
    // Used for the limitation of the maximum value for the slider which is adapted depending on the algorithm
    const [maxLimit, setMaxLimit] = useState(40);

    //##################################################################
    // Functions
    //##################################################################

    // Called when user clicks on an example. Puts formula of example in state and requests model from backend
    function onChooseExample(example) {
        props.setVisualizationFunction(example)
        props.submitFunction(example)
    }

    // Called when user drags slider. Model with updated limits is requested from backend when user stops using slider
    function onSliderChange(event) {
        // Set state
        props.setLimits(event.target.value)

        // Deletes a prior timeout if existing
        if (timeout) {
            clearTimeout(timeout);
            setTimeoutVar(null)
        }

        // Make a new timeout set which requests model from backend if time runs out before being cancelled
        setTimeoutVar(setTimeout(function () {
            props.submitFunction(null, event.target.value)
        }, 1000))
    }

    // Called when user select a different type of algorithm and request model generated from selected algorithm. Adapts slider max value according to selected algorithm
    function onAlgorithmChange(event) {
        props.setAlgorithm(event.target.value)
        if (event.target.value === "marching_cubes") {
            setMaxLimit(40)
            props.submitFunction(null, null, event.target.value)
        } else {
            setMaxLimit(10)
            if (props.limits > 10) {
                props.setLimits(10)
                props.submitFunction(null, 10, event.target.value)
            } else {
                props.submitFunction(null, null, event.target.value)
            }
        }
    }

    // Prepares a file that will be downloaded to users local machine
    function saveFile(filename, data) {
        const blob = new Blob([data], { type: 'text/csv' });
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else {
            const elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    }

    return (
        <div className='App-settings'>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <h4 className='RemoveVerticalMargin'>Examples</h4>
                </AccordionSummary>
                <AccordionDetails>
                    <p className='RemoveTopMargin Example' onClick={() => onChooseExample("x*x+y*y+z*z-30")}>Sphere</p>
                    <p className='RemoveTopMargin Example' onClick={() => onChooseExample("(x^2+y^2+z^2+6^2-3^2)^2-4*6^2*(x^2+y^2)")}>Torus</p>
                    <p className='RemoveTopMargin Example' onClick={() => onChooseExample("x^2+y^2-z^2")}>A1</p>
                    <p className='RemoveTopMargin Example' onClick={() => onChooseExample("x^4+y^4+z^4-100")}>Squared off Sphere</p>
                    <p className='RemoveTopMargin Example' onClick={() => onChooseExample("x+y^2-z^2")}>Saddle</p>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <h4 className='RemoveVerticalMargin'>Generation</h4>
                </AccordionSummary>
                <AccordionDetails>
                    <Tooltip title="Limits up to which coordinates the 3D model will be generated from the input function. With a higher limit parts of the functions farther away from the origin will be modeled, but it will also take more time to calculate the 3D model.">
                        <div>Limits</div>
                    </Tooltip>
                    <Slider
                        aria-label="Limits"
                        value={props.limits}
                        onChange={onSliderChange}
                        valueLabelDisplay="auto"
                        min={2}
                        max={maxLimit}
                        disabled={props.isLoading}
                    />
                    <Tooltip title="Choose an algorithm with which the 3D model should be generated">
                        <div>Algorithm</div>
                    </Tooltip>
                    <br />
                    <select className="custom-select" name="algorithm" id="cars" onChange={onAlgorithmChange} value={props.algorithm}>
                        <option value="marching_cubes">Marching Cubes</option>
                        <option value="dual_contour">Dual Contour</option>
                    </select>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <h4 className='RemoveVerticalMargin'>Visualization</h4>
                </AccordionSummary>
                <AccordionDetails>
                    <div className='box'>
                        <Tooltip title="Display three lines for each the x, y, and z axes directing in the positive direction from the origin">
                            <div>Axes Helper</div>
                        </Tooltip>
                        <label className="switch">
                            <input defaultChecked={props.showAxesHelper} type="checkbox" onChange={() => props.toggleAxesHelp()} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className='box AddTopMargin'>
                        <Tooltip title="Highlight the edges on top of the solid surface of the 3D model">
                            <div>Show Edges</div>
                        </Tooltip>
                        <label className="switch">
                            <input checked={props.showWireframe} type="checkbox" onChange={() => props.toggleWireframe()} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className='box AddTopMargin'>
                        <Tooltip title="Display model as solid object or show the wireframe of the object">
                            <div>Show Faces</div>
                        </Tooltip>
                        <label className="switch">
                            <input checked={props.showFaces} type="checkbox" onChange={() => props.toggleFaces()} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <h4 className='RemoveVerticalMargin'>Export</h4>
                </AccordionSummary>
                <AccordionDetails>
                    <button className='Download-button' onClick={() => saveFile("model.obj", props.modelString)} variant="contained">Download .obj</button>
                </AccordionDetails>
            </Accordion>
        </div>
    );
})

export default Settings;
