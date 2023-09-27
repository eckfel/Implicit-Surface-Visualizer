# Implicit Surface Visualization 

The **Implicit Surface Visualization** Tool is a hobby project that helps to understand and explore implicit surfaces through interactive visualization. Implicit surfaces can be used to describe three-dimensional shapes with an equation $F(x,y,z)=0$. With this tool, you can input your own mathematical functions and display the resulting surfaces in 3D. There are different types of visualizations, two supported algorithms to calculate the implicit surfaces, functions resulting in interesting shapes as examples, and the possibility of exporting the discovered shapes to other 3D software.

## Demo

https://github.com/eckfel/Implicit-Surface-Visualizer/assets/41958490/5e385fb0-a9c4-4073-92e2-d3c5600eb9f6

# Usage

## Prerequisites: 
Docker and Docker-compose `https://docs.docker.com/compose/install/`

## Installation
### Clone repository
Clone repository with SSH:
```
git clone git@github.com:eckfel/Implicit-Surface-Visualizer.git
```

or

Clone repository with HTTPS:
```
git clone https://github.com/eckfel/Implicit-Surface-Visualizer.git
```
### Navigate to the project folder
```
cd visualization-tool/
```
### Build project
```
docker-compose build
```

## Run application
```
docker-compose up
```
Navigate to `http://localhost:3000/` in your browser to view the application.

# Application

## Features

- Type in function which will be rendered as 3D model
- Rotate and zoom
- Load example functions of iconic implicit surface shape
- Change coordinate limits to which models are generated
- Choose between marching cubes and dual contour algorithm fo generation
- Display Axes
- Highlight edges on solid object
- Switch between solid object and wireframe
- Download current model as .obj Wavefront file
- Reset camera
- Tooltips on hovering over settings

## Backend

### Architecture

- Python Flask Server
- RESTful API for communication using JSON for data exchange
- Support for Marching Cubes and Dual Contour algorithm (Implementation used: `https://github.com/BorisTheBrave/mc-dc/tree/master`)

### API

- Reqest: `POST /meshing`
- Content-Type: application/json
- Parameters:
    - `visualizationFunction` (string) : function for which a 3D model should be generated
    - `limits` (number) : limits for which area in the coordinate plane the 3D model is calculated
    - `algorithm` ('marching_cubes'|'dual_contour') : selects an algorithm with which the model will be generated with

## Frontend

### Architecture

- JavaScript ReactJS Webapplication
- Three.js 3D rendering
- Material UI partial element styling
- Components:
    - App: bundles other components
    - Header: decorateion over application
    - Inputs: input field for functoin to be visualized
    - Loading: blurrs screen while waiting for server response
    - Render: hosts canvas for 3D rendering
    - Settings: change settings and load examples

## Open work

- Change eval() function to 'ast' evaluation for increased security
- Replace generation algorithm for more potent one (faster, support for larger models, finer resolution)
- Support more operations like sqrt, ln
- Keep camera position when changing Visualization settings
- Add testing

# Interesting resources
- Polygon Meshes vs. Parametric Surfaces vs. Implicit Surfaces `http://www.hao-li.com/cs420-fs2015/slides/Lecture04.1.pdf`
- Explanation Marching Cubes (2D/3D), Dual Contouring `https://www.boristhebrave.com/2018/04/15/marching-cubes-tutorial/`
- Working implicit surface visualizer `http://mikolalysenko.github.io/implicit-studio/`
- Working JS .obj viewer `https://github.com/xmlyqing00/OBJViewer`
- Using Three.js in React `https://blog.bitsrc.io/starting-with-react-16-and-three-js-in-5-minutes-3079b8829817`
- Object Loader Three.js `https://sbcode.net/threejs/loaders-obj/`
- Collection of algebraic surfaces `https://www.singsurf.org/djep/GWTASurf.php`
