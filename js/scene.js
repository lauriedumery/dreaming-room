import * as THREE from '../vendor/three.js-master/build/three.module.js';
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
        controls: null,
        draggableObjects: [],
    },

    animate: () => {
        Scene.render(); // Pour dessiner
        requestAnimationFrame(Scene.animate); // Demande au navigateur de faire l'animation
    },

    render: () => {
        Scene.vars.renderer.render(Scene.vars.scene, Scene.vars.camera);
    },

    onClickOnOrbitControl : () => {
        // Ajout du controleur sur la camera
        if(Scene.vars.controls != null) {
            Scene.vars.controls.enabled = false;
        }

        Scene.vars.controls = new OrbitControls(Scene.vars.camera, Scene.vars.renderer.domElement);
        Scene.vars.controls.target.set(0, 200, 0);

        document.getElementById("dragControl").classList.remove("selected");
        document.getElementById("orbitControl").classList.add("selected");

        // Pour limiter les mouvements de la caméra
        Scene.vars.controls.minDistance = 300;
        Scene.vars.controls.maxDistance = 1400;
        Scene.vars.controls.minPolarAngle = Math.PI / 4;
        Scene.vars.controls.maxPolarAngle = Math.PI / 2;
        Scene.vars.controls.minAzimuthAngle = -Math.PI/2;
        Scene.vars.controls.maxAzimuthAngle = 0;
        Scene.vars.controls.update();

        console.log(Scene.vars.controls.getAzimuthalAngle());
        console.log(Scene.vars.controls.getPolarAngle());
    },

    onClickOnDragControl : () => {
            // Ajout du controleur draggable
            Scene.vars.controls.enabled = false;
            Scene.vars.controls = new DragControls( Scene.vars.draggableObjects, Scene.vars.camera, Scene.vars.renderer.domElement );
            document.getElementById("orbitControl").classList.remove("selected");
            document.getElementById("dragControl").classList.add("selected");
    },

    onWindowResize: () => {
        let vars = Scene.vars;
        vars.camera.aspect = window.innerWidth / window.innerHeight; 
        vars.camera.updateProjectionMatrix(); // MAJ de l'aspect de la camera
        vars.renderer.setSize(window.innerWidth, window.innerHeight); // Change la taille du render
    },

    loadGLTF: (file) => {
        let loader = new GLTFLoader();

        // Chargement du modèle
        loader.load('./models/' + file, function(gltf) {
                Scene.vars.scene.add(gltf.scene);

                var childrenModel = gltf.scene.children[0].children[0].children[0].children[0].children; // Pour dissocier chaque enfants du model
                var numDraggableObjects = [14, 17, 18, 35, 39, 41, 42, 43, 46, 47, 66, 87, 88, 89]; // Numéros  des enfants du model qui seront draggables
                var numRemoveObjects = [31, 97, 102, 103]; // Numéros des enfants du model qui ne seront pas visibles

                for(var i = 0; i < childrenModel.length; i++) {
                    
                    // Ajout de la possibilité de bouger les petits objets
                    if (numDraggableObjects.includes(i)){
                        Scene.vars.draggableObjects.push(childrenModel[i]); 
                        childrenModel[i].position.x = -500;
                    }

                    // Cache les petits objets moches
                    if (numRemoveObjects.includes(i)) {
                        childrenModel[i].position.x = -5000;
                        childrenModel[i].position.y = -5000;
                    }
                }
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
        vars.scene.background = new THREE.Color(0xf4bebe);

        // Création renderer
        vars.renderer = new THREE.WebGLRenderer({ antialias: true });
        vars.renderer.setPixelRatio(window.devicePixelRatio);
        vars.renderer.setSize(window.innerWidth, window.innerHeight);
        vars.renderer.shadowMap.enabled = true;
        vars.renderer.shadowMapSoft = true;
        vars.container.appendChild(vars.renderer.domElement);

        // Ajout de la camera avec plusieurs paramètres
        vars.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 2, 2000);
        vars.camera.position.set(-1000, 0, 1000);

        // Création de la lumière globale
        const lightIntensityHemisphere = 1;
        let light = new THREE.HemisphereLight(0xFFFFFF, 0x888888,lightIntensityHemisphere);
        light.position.set(0,700, 0);
        vars.scene.add(light);

        // Ajout du modèle 3D
        Scene.loadGLTF('scene.gltf', true);

        // Ajout des contrôleurs
        Scene.onClickOnOrbitControl();
        document.getElementById("orbitControl").addEventListener('click', Scene.onClickOnOrbitControl);
        document.getElementById("dragControl").addEventListener('click', Scene.onClickOnDragControl);

        // Gestion du redimentionnment de la fenêtre
        window.addEventListener('resize', Scene.onWindowResize, false);

        Scene.animate();
    }
};

Scene.init();
