import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/loaders/GLTFLoader.js';

export async function startScene(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas });
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 20000);
    camera.position.set(0, 2, 33);
    camera.rotation.set(0.25, 0, 0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd2d2d2);
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-1, 2, 4);
    scene.add(light);

    try {
        const gltf = await new Promise((resolve, reject) => {
            new GLTFLoader().load('./gltf/javb92_wepage_threejs.gltf', resolve, undefined, reject);
        });
        const model = gltf.scene;
        scene.add(model);
        const scrollingSurfaces = model.children.filter(mesh => mesh.name === 'Plane' || mesh.name === 'Cylinder');

        function render(timestamp) {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            if (canvas.width !== width || canvas.height !== height) {
                renderer.setSize(width, height, false);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }

            const rotation = timestamp * 0.00001;
            light.rotation.y = model.rotation.y = rotation;
            for (const mesh of scrollingSurfaces) mesh.material.map.offset.set(0, rotation);

            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }

        render(performance.now());
        canvas.classList.add('scene-ready');
    } catch (error) {
        renderer.dispose();
        throw error;
    }
}
