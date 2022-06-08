import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Vector3 } from 'three';

// Initial Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#threeBackground') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
renderer.render(scene, camera);

// Light Setup
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Background Setup
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;


const sunTexture = new THREE.TextureLoader().load('Textures/sunTexture.jpg');
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(30, 50, 50),
  new THREE.MeshStandardMaterial({ map: sunTexture })
);
sun.position.set(0,0,0);
scene.add(sun);

class Planet{
    constructor(size, texture, rotationSpeed, revolutionSpeed, distanceFromParent, parentPosition){
        var planetTexture = new THREE.TextureLoader().load('Textures/' + texture);
        var planet = new THREE.Mesh(
            new THREE.SphereGeometry(size, 50, 50),
            new THREE.MeshStandardMaterial({ map: planetTexture })
        );
        var ring = new THREE.Mesh( 
            new THREE.RingGeometry( distanceFromParent, distanceFromParent+0.3, distanceFromParent ),
            new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } )
        );
        ring.rotateX(Math.PI / 2);
        scene.add( planet, ring );

        this.instance = planet;
        this.distanceFromParent = distanceFromParent;
        this.rotationSpeed = rotationSpeed;
        this.revolutionSpeed = revolutionSpeed;
        this.parentPosition = parentPosition;
        this.time = 0;
    }

    animate() {
        this.time += 0.01;
        this.instance.rotation.y += this.rotationSpeed / 1000;
        this.instance.position.x = this.distanceFromParent*Math.cos(this.time) + 0;
        this.instance.position.z = this.distanceFromParent*Math.sin(this.time) + 0;
    }
}

let A = new Planet(5, 'sunTexture.jpg', 5, 5, 50, sun.position);


const controls = new OrbitControls(camera, renderer.domElement);
function animate() {
    requestAnimationFrame(animate);
    A.animate();

    controls.update();

    renderer.render(scene, camera);
}

animate();
