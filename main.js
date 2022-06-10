import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

var animationActive = true;

window.addEventListener('click', onDocumentMouseDown, false);

// Initial Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#threeBackground') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera);
camera.position.set(0, 300, 600);
camera.rotation.x = 100;

// Light Setup
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Background Setup
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

//Stars
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);
  
    const [x, y, z] = Array(3)
      .fill()
      .map(() => THREE.MathUtils.randFloatSpread(50));
  
    star.position.set(x, y, z);
    scene.add(star);
}
  
  Array(200).fill().forEach(addStar);

class Planet{
    constructor(size, texture, rotationSpeed, revolutionSpeed, distanceFromParent, id){
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
        
        planet.click = function() { planetClick(id); }
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
planets.push(new Planet(40, 'sunTexture.jpg', 2.5, 0, 0, "Sun"));
planets.push(new Planet(5, 'mercuryTexture.jpeg', 2.5, 2, 50, "Mercury"));
planets.push(new Planet(6.5, 'venusTexture.jpeg', -0.5, 1.8, 80, "Venus"));
planets.push(new Planet(7, 'earthTexture.jpeg', 5, 1.4, 110, "Earth"));
planets.push(new Planet(6, 'marsTexture.jpg', 4, 1.2, 130, "Mars"));
planets.push(new Planet(20, 'jupiterTexture.jpeg', 9, 0.8, 180, "Jupiter"));
planets.push(new Planet(15, 'saturnTexture.jpeg', 8, 0.6, 250, "Saturn"));
planets.push(new Planet(10, 'neptuneTexture.jpeg', 6, 0.35, 290, "Neptune"));
planets.push(new Planet(10, 'uranusTexture.jpeg', 6.5, 0.15, 340, "Uranus"));


// Add planet ring
var saturnRing = new THREE.Mesh( 
    new THREE.RingGeometry(17, 24, 50 ),
    new THREE.MeshBasicMaterial( { color: 0xCCC5A8, side: THREE.DoubleSide } )
);
saturnRing.rotateX(Math.PI / 2);
scene.add(saturnRing);
planets[6].instance.add(saturnRing);

var uranusRing1 = new THREE.Mesh( 
    new THREE.RingGeometry(17.8, 18, 50 ),
    new THREE.MeshBasicMaterial( { color: 0xCCC5A8, side: THREE.DoubleSide } )
);
uranusRing1.rotateX(Math.PI / 17);
var uranusRing2 = new THREE.Mesh( 
    new THREE.RingGeometry(17.7, 18, 50 ),
    new THREE.MeshBasicMaterial( { color: 0xCCC5A8, side: THREE.DoubleSide } )
);
uranusRing2.rotateX(Math.PI / -17);
scene.add(uranusRing1, uranusRing2);
planets[8].instance.add(uranusRing1, uranusRing2);


const controls = new OrbitControls(camera, renderer.domElement);
function animate() {
    if(animationActive == true){
        requestAnimationFrame(animate);
    
        for(var i=0; i<planets.length; i++){
            planets[i].animate();
        }
        controls.update();
        renderer.render(scene, camera);
    }
    
}

animate();

// Click Check
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
function onDocumentMouseDown( event ) {
event.preventDefault();
mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
raycaster.setFromCamera( mouse, camera );
console.log(scene.children);
var intersects = raycaster.intersectObjects( scene.children );
console.log(intersects[1]);
if ( intersects.length > 0 ) {
    intersects[0].object.click();
}}


function planetClick(id){
    animationActive = false;
}

