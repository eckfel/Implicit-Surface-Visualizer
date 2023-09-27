from flask import request, Flask, jsonify
from flask_cors import CORS
from waitress import serve
import meshing.marching_cubes_3d as marching_cubes
import meshing.dual_contour_3d as dual_contour
import meshing.utils_3d as utils_3d
import re

# Port exposed for API usage
PORT = 443

app = Flask(__name__)

# Allow cors for functional prototype. Proper rules should be set up for a real application
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'



# Method for generating a 3D model out of a implicit surface function. All information needs to be given in the JSON format
# Parameters:
# - visualizationFunction (string) : function for which a 3D model should be generated
# - limits (number) : limits for which area in the coordinate plane the 3D model is calculated
# - algorithm ('marching_cubes'|'dual_contour') : selects an algorithm with which the model will be generated with
@app.route("/meshing", methods=['POST'])
def meshing():
    content_type = request.headers.get('Content-Type')
    # Check if data is given in JSON
    if (content_type == 'application/json'):

        # Extract parameters
        json_params = request.json
        limits = json_params["limits"]
        test_function = json_params["visualizationFunction"]

        # Translate JS style exponent symbol with python style
        test_function = test_function.replace("^","**")
        # Convert everything to lower case to allow preferred way of writing variables
        test_function = test_function.lower()
        # compiling the pattern for alphanumeric string
        pat = re.compile(r"[xyz0-9\-\+/*()\s\.%]+")
        
        # Checks whether the whole string matches the re.pattern or not
        if not re.fullmatch(pat, test_function):
            return 'Unprocessable Entity (Invalid characters used)', 422

        # Use received function as function for the generation algorithms. For a real application use 'ast' library for higher security. Using eval() is highly dangerous!
        def f (x,y,z):
            return eval(test_function, {"x": x, "y": y, "z": z})

        # Calculate 3D model    
        try:
            if json_params["algorithm"]=="marching_cubes":
                mesh = marching_cubes.marching_cubes_3d(f, -limits,limits,-limits,limits,-limits,limits)
            else:
                mesh = dual_contour.dual_contour_3d(f, dual_contour.normal_from_function(f),-limits,limits,-limits,limits,-limits,limits)
        except Exception as e:
            return 'Unprocessable Entity (Failed to process: {}'.format(str(e)), 422


        # Send JSON response 
        response = jsonify({'mesh': utils_3d.make_obj_string(mesh)})
        return response

    else:
        return 'Content-Type not supported!', 415


if __name__ == "__main__":
    # Start server
    serve(app, host="0.0.0.0", port=PORT)
