import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/controls/OrbitControls.js';
import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/loaders/OBJLoader2.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/loaders/MTLLoader.js';
import {MtlObjBridge} from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js';


// ES modules
//import { GLTFLoader } from './GLTFLoader.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/loaders/GLTFLoader.js';

let camera, scene, renderer;

//HERE WE EXECUTE ALL THAT THE MAIN METHOD HAVE
main();

function main() {

    // MAIN METHOD THAT GOING TO INITIATE CAMERA, SCENE AND THE FIRST ROTATING CUBE
    const canvas = document.querySelector('#c');
    renderer = new THREE.WebGLRenderer({
        canvas
    });

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


  // {
    // const mtlLoader = new MTLLoader();
    // mtlLoader.load('./resources/javb92_wepage_threejs.mtl', (mtlParseResult) => {
      // const objLoader = new OBJLoader2();
      // const materials =  MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
	  // console.log(materials);
	  // for (let mats in materials) {
		  // console.log(mats.Material);
	  // }
	  // //materials.Material.side = THREE.DoubleSide;
      // objLoader.addMaterials(materials);
      // objLoader.load('./resources/javb92_wepage_threejs.obj', (root) => {
        // scene.add(root);
		// root.position.set(0, 0, 0);
		// root.scale.set(1, 1, 1);
      // });
    // });
  // }

	
	var loader = new GLTFLoader();
	loader.load( './gltf/javb92_wepage_threejs.gltf', function ( gltf ) {
		scene.add( gltf.scene );
	}, undefined, function ( error ) {
		console.error( error );
	} );
  
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

  function render() {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}


