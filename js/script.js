import * as THREE from '../vendor/three.js-master/build/three.module.js';
import Stats from '../vendor/three.js-master/examples/jsm/libs/stats.module.js';
import { OrbitControls } from '../vendor/three.js-master/examples/jsm/controls/OrbitControls.js';
import { DragControls } from '../vendor/three.js-master/examples/jsm/controls/DragControls.js';
import { GLTFLoader } from '../vendor/three.js-master/examples/jsm/loaders/GLTFLoader.js'; 

const Scene = {

    //Pour ne pas réécrire tous le temps le ciblage des éléments
    vars: {
        container: null,
        scene: null,
        renderer: null,
        camera: null,
        draggableObjects: [],
    },

    animate: () => {
        Scene.render(); // Pour dessiner
        requestAnimationFrame(Scene.animate); // Demande au navigateur de faire l'animation
    },

    render: () => {
        Scene.vars.renderer.render(Scene.vars.scene, Scene.vars.camera);
        Scene.vars.stats.update();
    },

    onWindowResize: () => {
        let vars = Scene.vars;
        vars.camera.aspect = window.innerWidth / window.innerHeight; 
        vars.camera.updateProjectionMatrix(); // MAJ de l'aspect de la camera
        vars.renderer.setSize(window.innerWidth, window.innerHeight); // Change la taille du render
    },

    loadGLTF: (file, draggable) => {
        let loader = new GLTFLoader();

        loader.load(
            './models/' + file,
            function(gltf) {
                Scene.vars.scene.add(gltf.scene);

                var childrenModel = gltf.scene.children[0].children[0].children[0].children[0].children; // pour dissocier chaque enfants du model
                var numDraggableObjects = [14, 17, 18, 25, 35, 39, 41, 42, 43, 46, 47, 66, 87, 88, 89]; // numéros  des enfants du model qui seront draggables
                var numRemoveObjects = [31, 97, 102, 103]; // numéros des enfants du model qui ne seront pas visibles
                var noDraggableObjects = new THREE.Group();

                for(var i = 0; i < childrenModel.length; i++) {
                    if (numDraggableObjects.includes(i)){
                        Scene.vars.draggableObjects.push(childrenModel[i]); // ajout de la possibilité de bouger les petits objets
                        childrenModel[i].position.x = -500;
                    }
                    if (numRemoveObjects.includes(i)) {
                        childrenModel[i].position.x = -5000;
                        childrenModel[i].position.y = -5000;
                    }
                }

                // console.log(vars.);
                // callback();
            }
        );
    },

    init: () => {
        let vars = Scene.vars;

        // Préparation du container de la scene
        vars.container = document.createElement('div'); 
        vars.container.classList.add("fullscreen");
        document.body.appendChild(vars.container);

        // Création de la scène
        vars.scene = new THREE.Scene();
        vars.scene.background = new THREE.Color(0x6ab2c7);

        // Création renderer
        vars.renderer = new THREE.WebGLRenderer({ antialias: true });
        vars.renderer.setPixelRatio(window.devicePixelRatio);
        vars.renderer.setSize(window.innerWidth, window.innerHeight);
        vars.renderer.shadowMap.enabled = true;
        vars.renderer.shadowMapSoft = true;
        vars.container.appendChild(vars.renderer.domElement);

        // Ajout de la camera avec plusieurs paramètres
        vars.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
        vars.camera.position.set(400, 400, 400);

        // Création de la lumière globale
        const lightIntensityHemisphere = 1;
        let light = new THREE.HemisphereLight(0xFFFFFF, 0x444444,lightIntensityHemisphere);
        light.position.set(0,700, 0);
        vars.scene.add(light);

        let grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        vars.scene.add(grid);

        // Ajout du modèle 3D
        Scene.loadGLTF('scene.gltf', true);

        // Ajout du controleur sur la camera
        vars.controls = new OrbitControls(vars.camera, vars.renderer.domElement);
        vars.controls.target.set(0, 0, 0);

        // Pour limiter les mouvements de la caméra
        vars.controls.minDistance = 300;
        vars.controls.maxDistance = 1200;
        vars.controls.minPolarAngle = Math.PI / 3;
        vars.controls.maxPolarAngle = Math.PI / 3;
        vars.controls.minAzimuthAngle = -Math.PI/5;
        vars.controls.maxAzimuthAngle = -Math.PI/5;

        vars.controls.update();

        // Ajout du controler draggable

        var controls2 = new DragControls( vars.draggableObjects, vars.camera, vars.renderer.domElement );

        // Pour gérer le redimentionnment de la fenêtre
        window.addEventListener('resize', Scene.onWindowResize, false);

        vars.stats = new Stats;
        vars.container.appendChild(vars.stats.dom);

        Scene.animate();
    }
};

Scene.init();
