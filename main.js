import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Initial Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#threeBackground') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera);
camera.position.setZ(250);

// Light Setup
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Background Setup
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;


class Planet{
    constructor(size, texture, rotationSpeed, revolutionSpeed, distanceFromParent){
        var planetTexture = new THREE.TextureLoader().load('Textures/' + texture);
        var planet = new THREE.Mesh(
            new THREE.SphereGeometry(size, 50, 50),
            new THREE.MeshStandardMaterial({ map: planetTexture })
        );
        var ring = new THREE.Mesh( 
            new THREE.RingGeometry( distanceFromParent-0.15, distanceFromParent+0.15, 150 ),
            new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } )
        );
        ring.rotateX(Math.PI / 2);
        scene.add( planet, ring );

        this.instance = planet;
        this.distanceFromParent = distanceFromParent;
        this.rotationSpeed = rotationSpeed;
        this.revolutionSpeed = revolutionSpeed;
        //this.parentPosition = parentPosition;

        this.time = 0;
    }

    animate() {
        this.time += 0.01;
        this.instance.rotation.y += this.rotationSpeed / 1000;
        this.instance.position.x = this.distanceFromParent*Math.cos(this.time * this.revolutionSpeed); //+ this.parentPosition.x;
        this.instance.position.z = this.distanceFromParent*Math.sin(this.time * this.revolutionSpeed); //+ this.parentPosition.z;
        //this.instance.position.y = this.parentPosition.y;
    }
}


var planets = [];
planets.push(new Planet(40, 'sunTexture.jpg', 2.5, 0, 0));
planets.push(new Planet(5, 'mercuryTexture.jpeg', 2.5, 2, 50));
planets.push(new Planet(6.5, 'venusTexture.jpeg', -0.5, 1.8, 80));
planets.push(new Planet(7, 'earthTexture.jpeg', 5, 1.4, 110));
planets.push(new Planet(6, 'marsTexture.jpg', 4, 1.2, 130));
planets.push(new Planet(20, 'jupiterTexture.jpeg', 9, 0.8, 180));
planets.push(new Planet(18, 'saturnTexture.jpeg', 8, 0.6, 220));
planets.push(new Planet(10, 'neptuneTexture.jpeg', 6, 0.35, 260));
planets.push(new Planet(10, 'uranusTexture.jpeg', 6.5, 0.15, 290));


const controls = new OrbitControls(camera, renderer.domElement);
function animate() {
    requestAnimationFrame(animate);
    
    for(var i=0; i<planets.length; i++){
        planets[i].animate();
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();
