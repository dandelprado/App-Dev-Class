### Creating the Renderer

First, we must tell Three.js where to construct the 3D viewport.

```html
<div id ="threejsContainer"></div>
```

1. In the **main.js** file right after importing the Three.js library, let's add this line right in the beginning of the code

```javascript
let renderer, scene, container, camera;
```

2. And inside the `start()` function, we need to add the Three.js renderer and scene definitions

```javascript
renderer = new THREE.WebGLRenderer({ antialias: true });
```

The parameter `antialias` smooths the lines and edges of the 3D objects, improving the render quality. 

3. Now, we need to tell Three.js renderer the size of our 3D viewport.

```javascript
renderer.setSize(window.innerWidth, window.innerHeight);
```

We are instructing Three.js that our 3D viewport will occupy the browser window's `innerWidth` and `innerHeight` dimensions, taking up the entire screen.

4. Now, we have to point the previously constructed `threejsContainer` div to the Three.js container.

```javascript
container = document.getElementById( '#threejsContainer' );
container.appendChild( renderer.domElement );
```

`renderer.domElement` is the canvas element that Three.js creates when we run the following command: `new THREE.WebGLRenderer()`. This canvas is where Three.js will render the 3D scene.

5. Finally, we need to create the scene that will contain all the 3D elements.

```javascript
scene = new THREE.Scene();
```

### Creating the Camera

1. The camera will represent the viewpoint of the scene.

```javascript
camera = new THREE.Perspectiveamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
```

Let's move the camera a bit back in order to be able to see the center of the scene.

```javascript
camera.position.z = 5;
```

### Creating our First 3D Mesh

1. In Three.js, 3D objects are made up of two components: geometry and material. The geometry part is the 3D shape of the object, which is made up of 3D vertices connected by edges and faces, and the material part is the color and texture of the object. 

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
```

In the first line, we created a `THREE.BoxGeometry`, which is a cube primitive which are the most basic 3D forms you can hae in the 3D space. The numbers inside the `()` are the dimensions of the cube: width(x), height (y), and depth (z) sizes. 

The second line is the material definition: `THREE.MeshBasicMaterial` is the most basic kind of material you can have in Three.js. 

2. Now, we need to create a suitable object that combines the two.

```javascript
const cube = new THREE.Mesh( geometry, material );
```

In 3D Language, a mesh is defined as a collection of vertices and polygons. 

3. Finally, to add the cube mesh in the scene. 

```javascript
scene.add( cube );
```

### Rendering our Scene

in order to see the 3D scene, we need to tell Three.js to render the scene. 

```javascript
renderer.render( scene, camera );
```
