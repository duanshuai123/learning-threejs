// once everything is loaded, we run our Three.js stuff.
    function init() {
        let line = [];
        line.push([2495374.034144071 , 186313.2482976706 , 1.7853056 ] );
        line.push([2495370.141431099 , 186308.4525617276 , 1.7853056 ] );
        line.push([2495368.769788962 , 186306.1385105281 , 1.7853056 ] );
        line.push([2495367.401418144 , 186302.5785288669 , 1.7853056 ] );
        line.push([2495366.628931304 , 186298.6085169427 , 1.8768597 ] );
        line.push([2495366.262818396 , 186293.1948556768 , 1.9684138 ] );
        line.push([2495377.261024353 , 186292.5647490969 , 2.6092927 ] );
        line.push([2495378.221027896 , 186285.1804582758 , 2.7008469 ] );
        line.push([2495375.993008185 , 186277.5766021489 , 2.7008469 ] );
        line.push([2495369.997564546 , 186278.041125315 , 2.2430763 ] );
        line.push([2495365.403877525 , 186278.8020095036 , 2.4261844 ] );
        line.push([2495360.892660363 , 186220.7040435973 , 2.059968 ] );
        line.push([2495360.872491755 , 186217.8924120648 , 1.9684138 ] );
        line.push([2495361.712568753 , 186217.4667777845 , 1.9684138 ] );
        line.push([2495362.66591136 , 186217.4656547843 , 1.9684138 ] );
        line.push([2495363.219935854 , 186217.4769707327 , 1.9684138 ] );
        line.push([2495363.570244602 , 186218.2358437281 , 1.9684138 ] );
        line.push([2495364.833716663 , 186219.3325906201 , 1.9684138 ] );
        line.push([2495370.570825408 , 186220.1191081532 , -247.241928 ] );
        line.push([2495373.53845708 , 186217.0183894653 , -113.481346 ] );
        line.push([2495371.612632154 , 186212.5305338406 , 2.059968 ] );
        line.push([2495369.258795 , 186212.1735307219 , 2.059968 ] );
        line.push([2495364.849452961 , 186211.5068079039 , 1.8768597 ] );
        line.push([2495364.051657658 , 186211.4905126169 , 1.9684138 ] );
        line.push([2495363.352745796 , 186211.5174270955 , 1.9684138 ] );
        line.push([2495362.927334447 , 186211.1792176751 , 1.9684138 ] );
        line.push([2495362.791970459 , 186210.2084871235 , 1.9684138 ] );
        line.push([2495353.008653022 , 186208.8862296431 , 5.5390248 ] );
        line.push([2495355.66746559 , 186244.7861706101 , 2.3346303 ] );
        line.push([2495355.501223975 , 186246.9555497058 , 2.4261844 ] );
        line.push([2495355.044245414 , 186250.3340970959 , 2.4261844 ] );
        line.push([2495353.03833952 , 186255.1947453487 , 2.6092927 ] );
        line.push([2495356.598833663 , 186259.9734198615 , 2.6092927 ] );
        line.push([2495356.828370739 , 186260.1325700991 , 2.6092927 ] );
        line.push([2495356.945000852 , 186260.3923895862 , 2.6092927 ] );
        line.push([2495357.051540926 , 186261.1462832863 , 2.6092927 ] );
        line.push([2495360.035418553 , 186302.304549012 , 1.8768597 ] );
        line.push([2495360.294657213 , 186304.2663673458 , 1.7853056 ] );
        line.push([2495359.986328318 , 186305.7943988382 , 1.7853056 ] );
        line.push([2495358.823718258 , 186305.7294692434 , 1.6937514 ] );
        line.push([2495358.36443315 , 186305.421463496 , 1.6937514 ] );
        line.push([2495355.047122691 , 186313.7050006134 , 1.7853056 ] );
        line.push([2495364.263665033 , 186318.8977730592 , 1.7853056 ] );
        line.push([2495376.247903829 , 186315.5795423325 , 1.7853056 ] );
        line.push([2495374.034144071 , 186313.2482976706 , 1.7853056 ] );

        //var vectorMath = new vectorMath();
        var result = CorrectLH.correct_line_height(line);

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        var scene = new THREE.Scene();
        // create a camera, which defines where we're looking at.
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        // create a render and set the size
        var renderer = new THREE.WebGLRenderer();
        renderer.setClearColorHex();
        renderer.setClearColor(new THREE.Color(0xEEEEEE));
        renderer.setSize(window.innerWidth, window.innerHeight);

        // show axes in the screen
        var axes = new THREE.AxisHelper(20);
        scene.add(axes);

        // // create the ground plane
        // var planeGeometry = new THREE.line(60, 20);
        // var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
        // var plane = new THREE.Mesh(planeGeometry, planeMaterial);


         // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(60, 20);
        var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;

        // add the plane to the scene
        scene.add(plane);

        // create a cube
        var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        // position the cube
        cube.position.x = -4;
        cube.position.y = 3;
        cube.position.z = 0;

        // add the cube to the scene
        scene.add(cube);

        // create a sphere
        var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: true});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        // position the sphere
        sphere.position.x = 20;
        sphere.position.y = 4;
        sphere.position.z = 2;

        // add the sphere to the scene
        scene.add(sphere);

        // position and point the camera to the center of the scene
        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(scene.position);

        // add the output of the renderer to the html element
        document.getElementById("WebGL-output").appendChild(renderer.domElement);

        // render the scene
        renderer.render(scene, camera);
    }
    window.onload = init;