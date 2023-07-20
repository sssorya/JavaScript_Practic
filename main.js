 	import * as THREE from 'three';
        import { OrbitControls } from 'OrbitControls';
        import { GLTFLoader } from 'GLTFLoader';

        function init() {
            let canvas = document.getElementById('canvas');

            const scene = new THREE.Scene();
            scene.background = new THREE.Color("#E2DFE1");

            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
            camera.position.set(550, 300, 500);
            camera.lookAt(scene.position);

            const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);

            const loader = new GLTFLoader();
            const textureLoader = new THREE.TextureLoader();

            const texture = textureLoader.load('./model/images/earthmap1k.jpg');
            const material = new THREE.MeshPhongMaterial({
                map: texture,
            });

            loader.load('./model/scene.gltf', gltf => {
                const model = gltf.scene;
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.material = material;
                    }
                });
                scene.add(model);
            }, 
            function (error) {
                console.log('Error: ' + error)
            });

            const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(0, 0), 
                new THREE.MeshBasicMaterial({color: "#E2DFE1"})
            );
            plane.receiveShadow = true;
            plane.position.set(0, -1, 0);
            plane.rotation.x = -Math.PI / 2;
            scene.add(plane);

            const light1 = new THREE.DirectionalLight(0xffffff, 1);
            light1.position.set(2, 5, -15);
            light1.lookAt(0, -1, 0);
            scene.add(light1);

            const light2 = new THREE.DirectionalLight(0xffffff, 1);
            light2.position.set(2, 0, 5);
            light2.lookAt(0, 1, 0);
            scene.add(light2);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.5;
            controls.enableDamping = true;

            window.addEventListener('resize', onWindowResize, false);
            
            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }

            function animate() {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            }
            animate();
        }

        init();
