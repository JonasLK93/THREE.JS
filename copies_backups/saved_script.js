import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

var mouse = {x: 0, y: 0};
var flashlight 
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 2, 800);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(80);
camera.position.setX(0);

renderer.render(scene, camera);

const controls = new OrbitControls(camera,renderer.domElement)
controls.enableZoom = false;

const images = ["images/1.jpg", "images/2.jpg", "images/3.png", "images/4.png", "images/5.jpg", "images/6.jpg", "images/3.png"]

for (let i = 0 ; i < 7; i++){
    let x = 0;
    let y = 0;
    let z = 0;
    let pitch = 0;
    let yaw = 0;
    switch (i) {
        case 1:
        x = 600
        y = 0
        z = 0
        pitch = 0
        yaw = 1

        scene.add(getGround(x, y, z, pitch, yaw, i))
        break;    
        case 2:
            x = -600
            y = 0
            z = 0
            pitch = 0
            yaw = -1
            scene.add(getGround(x, y, z, pitch, yaw, i))
        break;  
        case 3: 
        x = 0
        y = 600
        z = 0
        pitch = 1
        yaw = 0
        scene.add(getGround(x, y, z, pitch, yaw, i))
        break;  
        case 4:
            x = 0
            y = -600
            z = 0
            pitch = -1
            yaw = 0
            scene.add(getGround(x, y, z, pitch, yaw, i))
        break;  
        case 5:
            pitch = 0
            yaw = 0
            x = 0
            y = 0
            z = 600
            scene.add(getGround(x, y, z, pitch, yaw, i))
        break;  
        case 6:
            pitch = 0
            yaw = 2
            x = 0
            y = 0
            z = -600
            scene.add(getGround(x, y, z, pitch, yaw, i))
        break;
        }
}


function getGround(x, y, z, pitch, yaw, i) {
    let texture = new THREE.TextureLoader().load(images[i])
    const groundGeometry = new THREE.BoxGeometry(600, 600, 600);
    const groundMaterial = new THREE.MeshStandardMaterial({ map:texture});
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.set(x, y, z);
    ground.rotation.set(pitch * (Math.PI / 2), yaw * (Math.PI / 2), 0);
    
    return ground;
  }
  
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera); 
}

let TurnOFF = Math.random() * 100000
let id = setInterval(flicker, 100);

function flicker() {
  spotlight.intensity = Math.floor((Math.random() * 5)+5)/10
}

let stop = setInterval(()=>{
  spotlight.intensity = 0;
  clearInterval(id)
  setTimeout(()=>{
    id = setInterval(flicker, 100);
  }, 750)
}, TurnOFF)

const loader = new GLTFLoader();

loader.load( 'models/scene.gltf', function ( gltf ) {
  flashlight = gltf.scene
	scene.add( flashlight);
  flashlight.add(spotlight);
  flashlight.rotation.y = 3
  flashlight.position.z = 30;
  flashlight.position.x = 1
  flashlight.position.y = -40;

  document.addEventListener('mousemove', onMouseMove, false);
}, undefined, function ( error ) {
	console.error( error );
} );


const spotlight = new THREE.SpotLight(0xffffff);

spotlight.angle = .80;
spotlight.penumbra = 1
spotlight.decay = 20;

animate();

function onMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
  vector.unproject(camera);
  var dir = vector.sub(camera.position).normalize();
  var target = new THREE.Vector3().addVectors(camera.position, dir.multiplyScalar(100));


  var vector2 = new THREE.Vector3(mouse.x, -mouse.y, 0.5);
	vector2.unproject( camera );
  
	var dir = vector2.sub( camera.position )
	var distance = - camera.position.z / dir.z;
	var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

	spotlight.position.copy(pos);
  flashlight.lookAt(target);
   
}


