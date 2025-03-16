### 2 Types of Shading Models

Simple Shadong Models and Physical Based Shading (PBR) models are approaches to simulate how light interacts with surfaces in computer graphics. They differe in complexity, accuracy, and application. 

1. Simple Shading Models

- approximate light behavior with straightforward, computationally efficient methods. They are often used when real-time performance is a priority, such as in vidoe games or basic rendering applications.

2. Physical Shading Models

- simulates light behavior based on the principles of physics, aiming for realism taking into account complex phenomena like reflection, refraction, scattering, and energy conservation.

### Common Materials Used in Three.js

`MeshPhongMaterial`

- uses the Phong reflection model to simulate shiny surfaces with specular highlights and supports both ambient and specular reflections.

- use case: shiny, glossy objects like polished metals or plastics

`MeshLambertMaterial`

- uses the Lambertian reflection model to simulate matte surfaces; focuses on diffuse reflection and does not produce specular highlights.

- use case: ieal for non-shiny objects like walls, fabrics, or terrain

`MeshStandardMaterial`

- based on the principles of physically-based rendering(PBR) which provides realistic results by simulating energy conservation, roughness, and metallic properties

- use case: modern realistic renders, such as metals, glass or wood

`MeshPhysicalMaterial`

- extends `MeshStandardMaterial` with additional properties for advanced physical-based rendering which allows for more detailed control over materials.

- use case: high-quality visuals in applications like car rendering, jewelry, or realistic glass

`MeshToonMaterial`

- material that creates a cartoonish, flat-shaded look by quantizing hte lighting for a cel-shading effect.

- use case: stylized or artistic renders, such as games with cartoon-like graphics or comics

`SpriteMaterial`

- material designed for rendering 2D sprites in a 3D scene. Sprites are always oriented toward the camera and are often used for billboards or icons. 

- use case: used for particles, UI elements, or 2D indicators in 3D scenes
