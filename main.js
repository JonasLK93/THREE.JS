import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

var mouse = { x: 0, y: 0 };
var flashlight;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1600);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(-100);

const controls = new PointerLockControls(camera, renderer.domElement);

const images = ["images/1.jpg", "images/2.jpg", "images/3.png", "images/4.png", "images/5.jpg", "images/6.jpg"]
let imageI = 0;

  
const positions = [
  [-600, 1200, 0], [600, 1200, 0], [0, 1200, 0],
  [-600, 1200, 600], [600, 1200, 600], [0, 1200, 600],
  [-600, 1200, -600], [600, 1200, -600], [0, 1200, -600],
  [0, 0, -1200], [600, 0, -1200], [-600, 0, -1200],
  [0, 600, -1200], [600, 600, -1200], [-600, 600, -1200],
  [0, 0, 1200], [600, 0, 1200], [-600, 0, 1200],
  [0, 600, 1200], [600, 600, 1200], [-600, 600, 1200],
  [-1200, 600, 0], [-1200, 600, 600], [-1200, 600, -600],
  [-1200, 0, -600], [-1200, 0, 0], [-1200, 0, 600],
  [1200, 600, 0], [1200, 600, 600], [1200, 600, -600],
  [1200, 0, -600], [1200, 0, 600], [1200, 0, ],
  [600, -600, 0], [600, -600, 600], [600, -600, -600],
  [0, -600, 0], [0, -600, 600], [0, -600, -600],
  [-600, -600, 0], [-600, -600, 600], [-600, -600, -600]
];

for (let i = 0; i < positions.length; i++) {
  imageI = Math.floor(Math.random() * images.length);
  const [x, y, z] = positions[i];
 
  scene.add(getGround(x, y, z, imageI));
}


function getGround(x, y, z, imageI) {
    let texture = new THREE.TextureLoader().load(images[imageI])
    const groundGeometry = new THREE.BoxGeometry(600, 600, 600);
    const groundMaterial = new THREE.MeshStandardMaterial({ map:texture});
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.set(x, y, z);
    return ground;
  }

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

let TurnOFF = 30000;
let id = setInterval(flicker, 100);

function flicker() {
  spotlight.intensity = Math.floor((Math.random() * 5) + 3) / 10;
}

let stop = setInterval(() => {
  spotlight.intensity = 0;
  clearInterval(id);
  setTimeout(() => {
    id = setInterval(flicker, 100);
  }, 750);
}, TurnOFF);

const loader = new GLTFLoader();

loader.load('models/scene.gltf', function (gltf) {
  flashlight = gltf.scene;
  scene.add(flashlight);
  flashlight.add(spotlight);
  flashlight.position.z = -90;    
  flashlight.position.x = -25; 
  flashlight.position.y = -40;
    camera.rotation.y = Math.PI;
}, undefined, function (error) {
  console.error(error);
});

const spotlight = new THREE.SpotLight(0xffffff);
spotlight.angle = 0.7;
spotlight.penumbra = 1;
spotlight.decay = 2;


function onMouseMove(event) {
  controls.lock();
  mouse.x = (event.movementX / window.innerWidth);
  mouse.y = (event.movementY / window.innerHeight);
  
  var vector = new THREE.Vector3(-mouse.x, -mouse.y, 0.5);
  vector.unproject(camera);
  var dir = vector.sub(camera.position).normalize();
  var target = new THREE.Vector3().addVectors(camera.position, dir.multiplyScalar(100));

  var distance = camera.position.z / dir.z;
  var pos = camera.position.clone().add(dir.multiplyScalar(distance));

  spotlight.position.copy(pos);

  flashlight.lookAt(target);

}

document.addEventListener('mousemove', onMouseMove, false);

animate();
