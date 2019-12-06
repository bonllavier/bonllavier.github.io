import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/loaders/GLTFLoader.js';

let camera, scene, renderer;

//HERE WE EXECUTE ALL THAT THE MAIN METHOD HAVE
main();

function main() {

	// MAIN METHOD THAT GOING TO INITIATE CAMERA, SCENE AND THE FIRST ROTATING CUBE
	const canvas = document.querySelector('#c');
	renderer = new THREE.WebGLRenderer({canvas});

	const fov = 50;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 20000;
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, 2, 33);
	//camera.position.set(-1001.310, 60.035, -644.038);
	camera.rotation.set(0.25, 0, 0);

	//I DONT KNOW IF THIS IS NECCESARY, DOESNT SEEM TO HAVE ANY IMPACT
	camera.aspect = canvas.clientWidth / canvas.clientHeight;
	camera.updateProjectionMatrix();
	//

	scene = new THREE.Scene();
	const intensity = 1;
	const color = "0xFFFFFF";
	const light = new THREE.DirectionalLight(color, intensity);
	light.position.set(-1, 2, 4);
	scene.add(light);
	scene.background = new THREE.Color(0xd2d2d2);


	var loader = new GLTFLoader();
	loader.load('./gltf/javb92_wepage_threejs.gltf', function (gltf) {
		scene.add(gltf.scene);
	}, undefined, function (error) {
		console.error(error);
	});

	function resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
		  renderer.setSize(width, height, false);
		}
		return needResize;
	}
	
	let ver1 = true;
	//console.log(scene.children);
	function render(time, time2) {
		time *= 0.00001; // convert time to seconds
		time2 *= 0.00001; // convert time to seconds
		if (resizeRendererToDisplaySize(renderer)) {
		  const canvas = renderer.domElement;
		  camera.aspect = canvas.clientWidth / canvas.clientHeight;
		  camera.updateProjectionMatrix();
		}

		for (let cont = 0; cont < scene.children.length; cont++) {
			scene.children[cont].rotation.y = time;
			if (scene.children[1] && ver1 === true) {
				if (scene.children[1].children[8].name === "Plane"){
					console.log(scene.children[1].children[8]);
				}
				
				
				ver1 = false;
			}
			if (scene.children[1]) {
				for (let x = 0; x < scene.children[1].children.length ; x++ ) {
					if (scene.children[1].children[x].name === "Plane"){
						scene.children[1].children[x].material.map.offset.set(0, time);
					}
					if (scene.children[1].children[x].name === "Cylinder"){
						scene.children[1].children[x].material.map.offset.set(0,time);
					}
				}

				
				
				//scene.children[1].children[8].material.map.wrapT = THREE.RepeatWrapping;
				//scene.children[1].children[8].material.map.wrapS = THREE.RepeatWrapping;
				//scene.children[1].children[8].material.map.repeat.set(45, 45);

			}
			//scene.children[cont].rotation.y = time;
		}
		
		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);
}
