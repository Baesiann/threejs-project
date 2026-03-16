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

    remove(object) {
        const index = this.interactable.indexOf(object);
        if (index > -1) {
            this.interactable.splice(index, 1);
        }
    }

    // changed to handle meshes as well
    findRootObject(object) {
        while (object.parent && !this.interactable.includes(object)) {
            object = object.parent;
        }
        return object;
    }

    onClick(event) {

        const rect = this.renderer.domElement.getBoundingClientRect();

        this.clickMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.clickMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.clickMouse, this.camera);

        // console.log(this.interactable);

        // // Hardcore debug: print all intersections
        // const allHits = this.raycaster.intersectObjects(this.scene.children, true);
    
        // console.log("Total objects hit by ray:", allHits.length);
        
        // if (allHits.length > 0) {
        //     const hit = allHits[0].object;
        //     console.log("Top-most hit object name/type:", hit.name, hit.type);
        //     console.log("Hit object userData:", hit.userData);
            
        //     // Check if this hit exists in your interactable list
        //     const isRegistered = this.interactable.some(obj => obj === hit || obj.contains?.(hit));
        //     console.log("Is this object in the interactable list?", isRegistered);
        // }

        const found = this.raycaster.intersectObjects(
            this.interactable,
            true
        );

        if (found.length > 0) {
            let clickedObject = found[0];

            // iterate through intersections
            for (let i = 0; i < found.length; i++) {
                let current = found[i].object;
                // console.log("found in raycaster index ", i, found[i].object.userData);

                // Walk up the tree for this hit
                let count = 0;
                while (current) {
                    if (this.interactable.includes(current)) {
                        clickedObject = current;
                        break;
                    }
                    current = current.parent;
                    count++;
                }
                if (clickedObject.userData) break;   // found a match
            }

            if (clickedObject) {
                window.dispatchEvent(new CustomEvent('game:objectClicked', {
                    detail: clickedObject.userData
                }));
            }
        }

    }
}

export { createRaycaster };

/**
 * OLD if (found > 0) -- wont detect meshes
 * 
        if (found.length > 0) {
            const rootObject = this.findRootObject(found[0].object);

            // dispatch the userData on click
            window.dispatchEvent(new CustomEvent('game:objectClicked', { detail: rootObject.userData }));

            // console.log("Clicked:", rootObject.userData);
        }
 */