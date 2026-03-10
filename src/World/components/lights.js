import { 
    DirectionalLight,
    AmbientLight,
    HemisphereLight
} from 'three';

function createLights() {
    // Create an ambient light
    // const ambientLight = new AmbientLight('white', 2);
    const ambientLight = new HemisphereLight(
        'white',            // bright sky color
        'darkslategrey',    // dim ground color
        5                   // intensity
    );

    // Create a direction light
    const mainLight = new DirectionalLight('white', 5);
    // move the light right, up, and towards us
    mainLight.position.set(10, 10, 10);

    return { ambientLight, mainLight };
}

export { createLights };