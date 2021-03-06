import './style.css';
import './preLoader.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

var time = 0;
var clickable = true;
var planetsData;

window.addEventListener('click', onDocumentMouseDown, false);
window.addEventListener('wheel', (event) => { event.preventDefault();}, { passive: false });

// Initial Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#threeBackground') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera);
camera.position.set(0, 225, 600);
camera.rotation.x = 150;

// Light Setup
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Background Setup
const spaceTexture = new THREE.TextureLoader().load('Images/space.jpg');
scene.background = spaceTexture;


window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


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
    }

    animate() {
        this.instance.rotation.y += this.rotationSpeed / 1000;
        this.instance.position.x = this.distanceFromParent*Math.cos(time * this.revolutionSpeed); //+ this.parentPosition.x;
        this.instance.position.z = this.distanceFromParent*Math.sin(time * this.revolutionSpeed); //+ this.parentPosition.z;
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
planets.push(new Planet(10, 'uranusTexture.jpeg', 6, 0.35, 290, "Uranus"));
planets.push(new Planet(10, 'neptuneTexture.jpeg', 6.5, 0.15, 340, "Neptune"));


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
planets[7].instance.add(uranusRing1, uranusRing2);


const controls = new OrbitControls(camera, renderer.domElement);


function animate() {
    requestAnimationFrame(animate);

    for(var i=0; i<planets.length; i++){
        planets[i].animate();
    }
    time += 0.01;

    controls.update();
    renderer.render(scene, camera);
    
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
    if(clickable == true){
        $("#planetInfo").animate({opacity: 1}, 500, 'swing');
        clickable = false;
        for(let i=0;i<planetsData.length;i++)
        {
            if(planetsData[i].getElementsByTagName("NAME")[0].childNodes[0].nodeValue == id)
            {
                document.getElementById("planetName").innerHTML = planetsData[i].getElementsByTagName("NAME")[0].childNodes[0].nodeValue;
                document.getElementById("planetImage").src = planetsData[i].getElementsByTagName("IMAGE")[0].childNodes[0].nodeValue;
                document.getElementById("planetInfoText").innerHTML = planetsData[i].getElementsByTagName("INFO")[0].childNodes[0].nodeValue;
                document.getElementById("planetDiscovery").innerHTML = planetsData[i].getElementsByTagName("DISCOVERY")[0].childNodes[0].nodeValue;
                document.getElementById("planetMoons").innerHTML = planetsData[i].getElementsByTagName("MOONS")[0].childNodes[0].nodeValue;
                document.getElementById("planetTemperature").innerHTML = planetsData[i].getElementsByTagName("TEMPERATURE")[0].childNodes[0].nodeValue;
                document.getElementById("planetRotation").innerHTML = planetsData[i].getElementsByTagName("ROTATION")[0].childNodes[0].nodeValue;
                document.getElementById("planetRevolution").innerHTML = planetsData[i].getElementsByTagName("REVOLUTION")[0].childNodes[0].nodeValue;
                document.getElementById("planetType").innerHTML = planetsData[i].getElementsByTagName("TYPE")[0].childNodes[0].nodeValue;
            }
        }
    }
}

function backButtonClick() { 
    $("#planetInfo").animate({opacity: 0.0}, 500, 'swing');
    clickable = true;
}

document.getElementById("backButton").addEventListener("click", backButtonClick);

//XML
function load(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200){
            loadXML(this);
        }
    };
    xhttp.open("GET", "data.xml", true);
    xhttp.send();
}

function loadXML(xml){
    var xmlDoc = xml.responseXML;
    planetsData = xmlDoc.getElementsByTagName("PLANET");
}

window.addEventListener('load', load);