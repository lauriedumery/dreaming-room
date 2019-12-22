import * as THREE from '../vendor/three.js-master/build/three.module.js';
import Stats from '../vendor/three.js-master/examples/jsm/libs/stats.module.js';
import { OrbitControls } from '../vendor/three.js-master/examples/jsm/controls/OrbitControls.js';

const Scene = {

    //Pour ne pas réécrire tous le temps le ciblage des éléments
    vars: {
        container: null,
        scene: null,
        renderer: null,
        camera: null,
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

    init: () => {
        let vars = Scene.vars;

        // Préparation du container de la scene
        vars.container = document.createElement('div'); 
        vars.container.classList.add("fullscreen");
        document.body.appendChild(vars.container);

        // Création de la scène
        vars.scene = new THREE.Scene();
        vars.scene.background = new THREE.Color(0xa0a0a0);

        // Création renderer
        vars.renderer = new THREE.WebGLRenderer({ antialias: true });
        vars.renderer.setPixelRatio(window.devicePixelRatio);
        vars.renderer.setSize(window.innerWidth, window.innerHeight);
        vars.renderer.shadowMap.enabled = true;
        vars.renderer.shadowMapSoft = true;
        vars.container.appendChild(vars.renderer.domElement);

        // Ajout de la camera avec plusieurs paramètres
        vars.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        vars.camera.position.set(-1.5, 210, 572);

        // Création de la lumière globale
        const lightIntensityHemisphere = 0.7;
        let light = new THREE.HemisphereLight(0xFFFFFF, 0x444444,lightIntensityHemisphere);
        light.position.set(0,700, 0);
        vars.scene.add(light);

        // Mise en place du sol
        let mesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(2000, 2000), // Le sol
            new THREE.MeshLambertMaterial({ color: new THREE.Color(0x888888) }) // Le materiaux du sol
        );
        mesh.rotation.x = -Math.PI / 2; // Sans rotation il s'affiche face à nous, l'angle se calcul en radiant
        mesh.receiveShadow = false;
        vars.scene.add(mesh);

        // Helpers pour avoir des infos qu'on enlèvera après
        let grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        vars.scene.add(grid);

        // Ajout du controleur sur la camera
        // vars.controls = new OrbitControls(vars.camera, vars.renderer.domElement);
        // vars.controls.target.set(0, 0, 0);
        // Pour limiter les mouvements de la caméra
        // vars.controls.minDistance = 300;
        // vars.controls.maxDistance = 600;
        // vars.controls.minPolarAngle = Math.PI / 4;
        // vars.controls.maxPolarAngle = Math.PI / 2;
        // vars.controls.minAzimuthAngle = - Math.PI / 4;
        // vars.controls.maxAzimuthAngle = Math.PI / 4;
        // vars.controls.update();

        // Pour gérer le redimentionnment de la fenêtre
        window.addEventListener('resize', Scene.onWindowResize, false);

        vars.stats = new Stats;
        vars.container.appendChild(vars.stats.dom);

        Scene.animate();
    }
};

Scene.init();
