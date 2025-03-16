### Common 3D Primitives

* Torus Knot

```js
const geometryTorusKnot = new THREE.TorusKnotGeometry(0.25, 0.075, 64, 16);
const materialTorusKnot = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const torusKnot = new THREE.Mesh(geometryTorusKnot, materialTorusKnot);
torusKnot.position.set(-2, 1.5, 0);
scene.add(torusKnot);
```

Line by line explanation:

1. Define the geometry of the torus knot.

`const geometryTorusKnot = new THREE.TorusKnotGeometry(0.25, 0.075, 64, 16);`

- `THREE.TorusKnotGeometry` generates the shape of a torus knot, which is a twisted 3D curve resembling a knotted ring.

-  parameters specify the dimensions and complexity of the shape:

    - `0.25`: radius of the torus knot's major circle (overall size)

    - `0.075`: radius of the tube forming the torus knot (thickness)

    - `64`: number of segments around the major circle (affects smoothness)

    - `16`: number of segments around the tube (affects smoothness of the cross-section)

2. Define the material

`const materialTorusKnot = new THREE.MeshStandardMaterial({ color: 0x00ff00 });`

- `THREE.MeshStandardMaterial` is used to apply a material to the torus knot.

- color is set to bright pink (`0xff00cc`) in hexadecimal RBG format.

- material will react to lights in the scene, making the torus knot visually affected by lighting (e.g., reflections, shading).

3. Create the mesh

`const torusKnot = new THREE.Mesh(geometryTorusKnot, materialTorusKnot);`

- combines the geometry and material to create a 3D object (a mesh) that can be rendered in the scene.

4. Position the torus knot

`torusKnot.position.set(-2, 1.5, 0);`

- sets the torus knot's position in 3D space: 

    - `x: -2`: moves it 2 units to the left

    - `y: 1.5`: raises it 1.5 units up

    - `z: 0`: keeps it at the default depth position

4. Add the torus knot to the scene

`scene.add(torusKnot);`

- adds the torus knot to the scene, making it part of the 3D environment.

#### Other 3D Primitives
1. Torus (0.4, 0.1, 16, 32)
2. Plane (0.5, 0.5)
3. Sphere (0.35, 16, 16)
4. Capsule (0.25, 0.5, 4, 8)
5. Cube (0.5, 0.5, 0.5)
6. Ring (0.2, 0.5, 32)
7. Circle (0.5, 64)
8. Cylinder (0.35, 0.35, 0.75)
9. Cone (0.5, 1.32)
