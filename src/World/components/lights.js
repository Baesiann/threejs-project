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
        3                   // intensity
    );

    // Create a direction light
    const mainLight = new DirectionalLight('white', 5);
    // move the light right, up, and towards us
    mainLight.position.set(5, 10, 7);

    // enable shadows
    mainLight.castShadow = true;
    // mainLight.shadow.mapSize.width = 1024; // default is 512
    // mainLight.shadow.mapSize.height = 1024;

    return { ambientLight, mainLight };
}

export { createLights };