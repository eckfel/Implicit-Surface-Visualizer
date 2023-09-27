import './App.scss';
import Render from './Components/Render';
import React, { useState, useRef } from 'react';
import Header from './Components/Header';
import Loading from './Components/Loading';
import Inputs from './Components/Inputs';
import Settings from './Components/Settings';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import Tooltip from '@mui/material/Tooltip';
import variables from './App.scss'

// Set color scheme form Material UI components
const theme = createTheme({
  palette: {
    primary: {
      main: variables.dark,
      light: variables.light
    },
    secondary: {
      main: variables.contrast
    }
  },
  status: {
    background: variables.bright,

  },
});


// Main component bundling all other components
function App() {

  //##################################################################
  // Variable declaration
  //##################################################################

  // Name of file for object rendered on start of application to prevent waiting for request from backend
  const [file] = useState("sphere.obj");
  // Indicator for when application is waiting for a response from the backend
  const [isLoading, setLoading] = useState(false);
  // State of function of the implicit surface that should be displayed 
  const [visualizationFunction, setVisualizationFunction] = useState("x*x+y*y+z*z-30");
  // Algorithm used for the generation of the 3D model of the implicit surface
  const [algorithm, setAlgorithm] = useState("marching_cubes");
  // Boundaries until which value limits the 3D model is generated
  const [limits, setLimits] = useState(10);
  // Model string used for storing current model for download
  const [modelString, setModelString] = useState("");
  // State if axes helper should be displayed or not
  const [axesHelp, setAxesHelp] = useState(false);
  // State if edge wireframe should be displayed over material of surface
  const [showWireframe, setShowWireframe] = useState(false);
  // State if solid material (solid object) or wireframe material should be used
  const [showFaces, setShowFaces] = useState(true);
  // Reference to render component to call functions of component
  const renderRef = useRef()

  //##################################################################
  // Functions
  //##################################################################

  // Function to request from backend 3D model from function of implicit surface
  // Params:
  // - visualizationFunctionInput (string|null) : used for generating the 3D model in the background. Will take current state if set to null. Can be set explicitly to avoid async issues of setState() of React
  // - limitsInput (number|null) : indicates up to which boundaries model will be generated. Will take current state if set to null. Can be set explicitly to avoid async issues of setState() of React
  // - algorithmInput ('marching_cubes'|'dual_contour'|null) : decides which algorithm is used for generating 3D model. Will take current state if set to null. Can be set explicitly to avoid async issues of setState() of React
  const onRequestObject = (visualizationFunctionInput = null, limitsInput = null, algorithmInput = null) => {
    // Skip if application is already waiting for a model
    if (isLoading) {
      return
    }
    // Set loading flag 
    setLoading(true)
    fetch("http://127.0.0.1:443/meshing",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visualizationFunction: visualizationFunctionInput ? visualizationFunctionInput : visualizationFunction,
          limits: limitsInput ? limitsInput : limits,
          algorithm: algorithmInput ? algorithmInput : algorithm
        })
      })
      .then((response) => {
        setLoading(false)
        // Do not load new model if invalid characters are used or a model could not be generated (often too large/complex for used library)
        if (response.status === 422) {
          return null
        }
        return response.json()
      })
      .then((data) => {
        if (data) {
          setModelString(data['mesh'])
          renderRef.current.replaceObjectFromString(data['mesh'])
        }
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      }
      )
  }

  function toggleAxesHelp() {
    setAxesHelp(!axesHelp)
  }
  function toggleWireframe() {
    setShowWireframe(!showWireframe)
  }
  function toggleFaces() {
    setShowFaces(!showFaces)
  }

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Inputs
          visualizationFunction={visualizationFunction}
          setVisualizationFunction={setVisualizationFunction}
          submitFunction={onRequestObject}
          isLoading={isLoading} />
        <Settings
          limits={limits}
          setLimits={setLimits}
          setVisualizationFunction={setVisualizationFunction}
          submitFunction={onRequestObject}
          isLoading={isLoading}
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          modelString={modelString}
          axesHelp={axesHelp}
          toggleAxesHelp={toggleAxesHelp}
          showWireframe={showWireframe}
          toggleWireframe={toggleWireframe}
          showFaces={showFaces}
          toggleFaces={toggleFaces}
        />
        <Loading isLoading={isLoading} />
        <Header />
        <Tooltip title="Reset Camera Position"><button className='Reset-Camera' onClick={() => renderRef.current.resetCamera()}><CameraswitchIcon /></button></Tooltip>
        <Render
          ref={renderRef}
          file={file}
          axesHelp={axesHelp}
          showWireframe={showWireframe}
          showFaces={showFaces}
        />
      </ThemeProvider>
    </div>
  );
}

export default App;
