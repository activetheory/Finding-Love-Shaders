class Terrain {
    constructor() {
        this.group = new THREE.Group();

        Promise.all([Utils.loadShader('Terrain'), this.loadGeometry()]).then(data => {
            let obj = data[0];
            let geom = data[1];
            this.mat = this.getShader(obj.vs, obj.fs);
            let mesh = new THREE.Mesh(geom, this.mat);
            this.group.add(mesh);

            ShaderUIL.push(this.mat);
        });
    }

    loadGeometry() {
        return new Promise((resolve, reject) => {
            Utils.loadGeometry('plane').then(geom => {
                geom.scale(0.12, 0.12, 0.12);
                geom.translate(0, 6, 0);

                geom.computeBoundingBox();

                let posArray = geom.attributes.position.array;
                let uvArray = geom.attributes.uv.array;
                let count = geom.attributes.uv.count;
                for (let i = 0; i < count; i++) {
                    let x = posArray[i * 3 + 0];
                    let z = posArray[i * 3 + 2];
                    let u = Utils.range(x, geom.boundingBox.min.x, geom.boundingBox.max.x, 0, 1);
                    let v = Utils.range(z, geom.boundingBox.min.z, geom.boundingBox.max.z, 0, 1);
                    uvArray[i * 2 + 0] = u;
                    uvArray[i * 2 + 1] = v;
                }

                resolve(geom);
            });
        });
    }

    getShader(vs, fs) {
        let uniforms = {
            time: {type: 'f', value: 0},
            transition: {type: 'f', value: 1},
            transHeight: {type: 'f', value: 1},
            transDirection: {type: 'f', value: 1},
            baseColor: {type: 'c', value: new THREE.Color(0xfef0ff)},
            multiplyColor: {type: 'c', value: new THREE.Color(0xead4ed)},
            lightPos: {type: 'v3', value: new THREE.Vector3(100, 100, 0)},
            lightColor: {type: 'c', value: new THREE.Color(0xfff9e6)}
        };

        let shader = new THREE.ShaderMaterial({
            vertexShader: vs,
            fragmentShader: fs,
            uniforms
        });

        shader.extensions.derivatives = true;

        // shader.wireframe = true;

        return shader;
    }

    update() {
        if (this.mat) {
            this.mat.uniforms.time.value = performance.now() * 0.00025;
        }
    }
}
