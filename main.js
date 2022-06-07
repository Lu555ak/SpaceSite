import './style.css';
import * as THREE from 'three';

function initializeThreeBackground(){
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector("#threeBackground")
    });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    renderer.render(scene, camera);
}

initializeThreeBackground();