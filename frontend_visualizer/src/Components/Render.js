import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import variables from '../App.scss'


// Component rendering the 3D model of the implicit surface
const Render = forwardRef((props, ref) => {

    //##################################################################
    // Variable declaration
    //##################################################################

    const [scene] = useState(new THREE.Scene());
    const [currentObj, setCurrentObj] = useState(undefined);
    const [camera] = useState(new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000))
    const [renderer] = useState(new THREE.WebGLRenderer())
    // Front light shining on front object when camera in default position
    const [light] = useState(new THREE.PointLight('white', 0.95))
    // Back light shining on back object when camera in default position. Not using Hemispheric feature
    const [backgroundLight] = useState(new THREE.HemisphereLight('white', 0.000008, 0.9))
    // Ambient light shining light on object from all direction for better visibility
    const [ambientLight] = useState(new THREE.AmbientLight('white', 0.02))
    // Allows camera controls
    const [controls] = useState(new OrbitControls(camera, renderer.domElement))
    // Used to load model on startup from file to not have to wait when starting application
    const [objLoader] = useState(new OBJLoader())
    // Display x,y,z axis at point (0,0,0)
    const [axesHelper] = useState(new THREE.AxesHelper(10))
    // Edges placed on top of object faces
    const [wireframe, setWireframe] = useState(undefined)
    // Material used when object faces should be rendered (Solid object)
    const [material] = useState(new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: 1, // positive value pushes polygon further away to display edge wireframe on top of material
        polygonOffsetUnits: 1 // positive value pushes polygon further away to display edge wireframe on top of material
    }))
    // Material used when only wireframe should be displayed
    const [wireframeOnly] = useState(new THREE.MeshPhongMaterial({
        wireframe: true,
        color: variables.contrast,
        side: THREE.DoubleSide,
    }))


    //##################################################################
    // Exposed functions
    //##################################################################

    useImperativeHandle(ref, () => ({
        replaceObjectFromString(object_string) {
            replaceObjectFromString(object_string)
        },
        resetCamera() {
            resetCamera()
        }
    }))

    //##################################################################
    // Initialization 
    //##################################################################

    function initialize() {
        scene.background = new THREE.Color(variables.dark);
        // Set size of the canvas to the full screen size of browser
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Attach the canvas to the HTML element with id "renderElement"
        document.getElementById("renderElement").appendChild(renderer.domElement);

        // Position and place lights
        light.position.set(2.5, 7.5, 15)
        backgroundLight.position.set(-2.5, -7.5, -30)
        scene.add(ambientLight, light, backgroundLight)

        // Place Axes and appearance of Object  according to settings
        toggleAxesHelp()
        toggleWireframe()
        // Reset camera position
        resetCamera()

        // Object Loader for loading Wavefront .obj files
        if (!currentObj) {
            placeObject(props.file)
        }

        // Resize area on changing screen size
        window.addEventListener('resize', onWindowResize, false)
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
            render()
        }

        // Animation for interactive Scene
        function animate() {
            requestAnimationFrame(animate)

            controls.update()

            render()
        }

        // Update canvas
        function render() {
            renderer.render(scene, camera)
        }

        // Start animation
        animate();
    }

    //##################################################################
    // Functions
    //##################################################################

    // Load an object from a .obj (wavefront encoding) file and place it in the scene, used to place initial object in scene on startup without need for request to backend
    function placeObject(fileName) {
        objLoader.load(
            fileName,
            (object) => {
                setCurrentObj(object)
                placeMaterialOnObject(object, material)
                scene.add(object)
                generateWireframe(object)
            },
            (xhr) => {
                // Can be used to show loading progress
                //console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )
    }

    // Replace currently loaded object with an object from a string in the wavefront encoding
    function replaceObjectFromString(object_string) {
        // Remove an object if one is present
        if (currentObj) {
            scene.remove(currentObj);
        }
        // Generate object from string
        let object = objLoader.parse(object_string);
        setCurrentObj(object)
        placeMaterialOnObject(object, material)
        scene.add(object)
        generateWireframe(object)
        controls.rotateSpeed = -0.5
    }

    // Put material on all faces of loaded object
    function placeMaterialOnObject(object, material) {
        if (object && object.children && object.children[0]) {
            object.children[0].material = material
            object.traverse(function (child) {
                if (child.isMesh) {
                    child.material = material
                }
            })
        }
    }

    // Generate Edge wireframe that can be placed on top of material
    function generateWireframe(object) {
        if (object && object.children && object.children[0]) {
            var geo = new THREE.EdgesGeometry(object.children[0].geometry);
            var mat = new THREE.LineBasicMaterial({ color: variables.contrast });
            var wireframe = new THREE.LineSegments(geo, mat);
            setWireframe(wireframe)
        } else {
            setWireframe(undefined)
        }
    }

    // Adds or removes axes helper depending on settings
    function toggleAxesHelp() {
        if (props.axesHelp) {
            scene.add(axesHelper);
        } else {
            scene.remove(axesHelper);
        }
    }

    // Sows object with faces, faces + edge wireframe or only general wireframe depending on settings
    function toggleWireframe() {
        if (currentObj) {
            if (props.showFaces) {
                placeMaterialOnObject(currentObj, material)
                if (props.showWireframe && wireframe) {
                    currentObj.add(wireframe);
                } else {
                    currentObj.remove(wireframe)
                }

            } else {
                placeMaterialOnObject(currentObj, wireframeOnly)
            }
        }
    }

    // Resets viewport
    function resetCamera() {
        if (controls) {
            // Reset the controls for camera movement
            controls.reset()
            controls.enableDamping = true
            controls.rotateSpeed = 0.5
            controls.maxDistance = 150
            controls.minDistance = 2
        }

        if (camera) {
            // Initialization camera, rendering canvas, lighting, mouse orbit control and statistics
            camera.position.z = 40
            camera.position.x = 0
            camera.position.y = 0
        }
    }

    //Initialize Component after everything is loaded
    useEffect(() => {
        initialize()
    })

    // Div that canvas is bound to
    return (
        <div id="renderElement" />
    )
})
export default Render