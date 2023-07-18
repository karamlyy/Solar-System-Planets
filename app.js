let scene, camera, renderer;
        let moveSpeed = 0.1;
        let zoomSpeed = 0.1;
        let rotateSpeed = 0.01;

        init();
        animate();

        function init() {
            // Create the scene
            scene = new THREE.Scene();

            // Set up the camera
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 10;

            // Create the renderer
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            // Add event listeners for keyboard events
            document.addEventListener('keydown', onKeyDown);

            // Create the nucleus (sun)
            const nucleusGeometry = new THREE.SphereGeometry(5, 32, 32);
            const nucleusTexture = new THREE.TextureLoader().load('textures/sun.jpg');
            const nucleusMaterial = new THREE.MeshBasicMaterial({ map: nucleusTexture });
            const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
            scene.add(nucleus);

            // Create the planets
            const mercury = createPlanet(0.383, 'textures/mercury.jpg', 5.79, 0.01); // Mercury
            const venus = createPlanet(0.949, 'textures/venus.jpg', 10.82, 0.008); // Venus
            const earth = createPlanet(1, 'textures/earth.jpg', 14.96, 0.006); // Earth
            const mars = createPlanet(0.532, 'textures/mars.jpg', 22.79, 0.005); // Mars
            const jupiter = createPlanet(11.21, 'textures/jupiter.jpg', 77.84, 0.003); // Jupiter
            const saturn = createPlanet(9.45, 'textures/saturn.jpg', 143.34, 0.002); // Saturn
            const uranus = createPlanet(4.01, 'textures/uranus.jpg', 287.12, 0.001); // Uranus
            const neptune = createPlanet(3.88, 'textures/neptune.jpg', 449.83, 0.001); // Neptune

            scene.add(mercury);
            scene.add(venus);
            scene.add(earth);
            scene.add(mars);
            scene.add(jupiter);
            scene.add(saturn);
            scene.add(uranus);
            scene.add(neptune);

            // Create orbit lines for the planets
            createOrbitLine(5.79, 0x0000FF); // Mercury
            createOrbitLine(10.82, 0x00FF00); // Venus
            createOrbitLine(14.96, 0x964B00); // Earth
            createOrbitLine(22.79, 0xFF0000); // Mars
            createOrbitLine(77.84, 0xFFA500); // Jupiter
            createOrbitLine(143.34, 0xFFFF00); // Saturn
            createOrbitLine(287.12, 0x00FFFF); // Uranus
            createOrbitLine(449.83, 0x0000FF); // Neptune

            // Add ambient light
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
            scene.add(ambientLight);

            // Add point light at the nucleus
            const light = new THREE.PointLight(0xffffff, 1);
            nucleus.add(light);

            // Create a skybox
            const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
            const skyboxMaterials = [
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/skybox_right.jpg'), side: THREE.BackSide }),
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/skybox_left.jpg'), side: THREE.BackSide }),
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/skybox_top.jpg'), side: THREE.BackSide }),
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/skybox_bottom.jpg'), side: THREE.BackSide }),
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/skybox_front.jpg'), side: THREE.BackSide }),
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/skybox_back.jpg'), side: THREE.BackSide })
            ];
            const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
            scene.add(skybox);
        }

        function createPlanet(radius, texturePath, orbitRadius, rotationSpeed) {
            const texture = new THREE.TextureLoader().load(texturePath);
            const material = new THREE.MeshPhongMaterial({ map: texture });
            const planetGeometry = new THREE.SphereGeometry(radius, 32, 32);
            const planet = new THREE.Mesh(planetGeometry, material);

            const planetOrbit = new THREE.Object3D();
            planetOrbit.add(planet);
            scene.add(planetOrbit);

            planetOrbit.position.x = orbitRadius;

            planetOrbit.rotationSpeed = rotationSpeed;

            return planetOrbit;
        }

        function createOrbitLine(orbitRadius, color) {
            const orbitGeometry = new THREE.CircleGeometry(orbitRadius, 100);
            orbitGeometry.vertices.shift(); 
            const orbitMaterial = new THREE.LineBasicMaterial({ color: color });
            const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
            orbitLine.rotation.x = Math.PI * 0.5; 
            scene.add(orbitLine);
        }

        function animate() {
            requestAnimationFrame(animate);
            scene.traverse(function (object) {
                if (object instanceof THREE.Object3D && object.rotationSpeed !== undefined) {
                    object.rotation.y += object.rotationSpeed;
                }
            });

            renderer.render(scene, camera);
        }

        function onKeyDown(event) {
            switch (event.keyCode) {
                case 37: // Left arrow key
                    camera.position.x -= moveSpeed;
                    break;
                case 39: // Right arrow key
                    camera.position.x += moveSpeed;
                    break;
                case 38: // Up arrow key
                    camera.position.y += moveSpeed;
                    break;
                case 40: // Down arrow key
                    camera.position.y -= moveSpeed;
                    break;
                case 87: // 'w' key
                    camera.position.z -= zoomSpeed;
                    break;
                case 83: // 's' key
                    camera.position.z += zoomSpeed;
                    break;
                case 65: // 'a' key
                    scene.rotation.y += rotateSpeed;
                    break;
                case 68: // 'd' key
                    scene.rotation.y -= rotateSpeed;
                    break;
            }
        }

        window.addEventListener('resize', function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });