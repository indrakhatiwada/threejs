import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js";
const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const gui = new dat.GUI();
const world = {
  plane: {
    width: 10,
    height: 10,
    widthSegments: 10,
    heightSegments: 10,
  },
};
//function to manipulate the plane from dat.gui
const generatePlane = () => {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );
  const { array } = planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];
    array[i + 2] = z + Math.random();
  }
  const position = planeMesh.geometry.attributes.position;

  const colors = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4);
  }
  console.log(colors);
  //add raycasting to change the color of vertices

  planeMesh.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );
};

gui.add(world.plane, "height", 1, 20).onChange(generatePlane);
gui.add(world.plane, "width", 1, 20).onChange(generatePlane);
gui.add(world.plane, "widthSegments", 1, 40).onChange(generatePlane);
gui.add(world.plane, "heightSegments", 1, 40).onChange(generatePlane);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
renderer.setPixelRatio(devicePixelRatio);
camera.position.z = 5;
const controls = new OrbitControls(camera, renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);
const light = new THREE.DirectionalLight(0xffffff, 1);
scene.add(light);
const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);
light.position.set(0, 0, 1);

//normalizing mouse objects

const mouse = {
  x: undefined,
  y: undefined,
};
const control = new OrbitControls(camera, renderer.domElement);
function animate() {
  requestAnimationFrame(animate);

  // planeMesh.rotation.x += 0.01;
  // planeMesh.rotation.y += 0.01;
  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    //select each intersects face
    console.log(intersects[0].object.geometry.attributes);
  }
}
animate();

//event listeners
addEventListener("mousemove", (event) => {
  //normalize the mouse co-ordinates
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});
