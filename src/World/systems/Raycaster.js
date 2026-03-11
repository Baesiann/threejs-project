import { Raycaster, Vector2, Object3D } from "three";

class createRaycaster {
    constructor(camera, scene, renderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;

        this.raycaster = new Raycaster();
        this.clickMouse = new Vector2();
        this.moveMouse = new Vector2();

        this.interactable = [];

        renderer.domElement.addEventListener('pointerdown', this.onClick.bind(this));
    }

    add(object) {
        this.interactable.push(object);
    }

    onClick(event) {

        const rect = this.renderer.domElement.getBoundingClientRect();

        this.clickMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.clickMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.clickMouse, this.camera);

        const found = this.raycaster.intersectObjects(
            this.interactable,
            true
        );

        if (found.length > 0) {
            console.log("Clicked:", found[0].object.userData);
        }

    }
}

export { createRaycaster };