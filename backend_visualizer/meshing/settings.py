"""Stores some global settings, mostly to save on a lot of repetitive arguments.
These are mostly of interest for demonstrating different variants of the algorithms as discussed
in the accompanying article."""


# Both marching cube and dual contouring are adaptive, i.e. they select
# the vertex that best describes the underlying function. But for illustrative purposes
# you can turn this off, and simply select the midpoint vertex.
ADAPTIVE = True

# In dual contouring, if true, crudely force the selected vertex to belong in the cell
CLIP = False
# In dual contouring, if true, apply boundaries to the minimization process finding the vertex for each cell
BOUNDARY = True
# In dual contouring, if true, apply extra penalties to encourage the vertex to stay within the cell
BIAS = True
# Strength of the above bias, relative to 1.0 strength for the input gradients
BIAS_STRENGTH = 0.01

# Default bounds to evaluate over
XMIN = -10
XMAX = 10
YMIN = -10
YMAX = 10
ZMIN = -10
ZMAX = 10