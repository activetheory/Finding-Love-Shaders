class Gem {
    constructor() {
        this.group = new THREE.Group();

        Utils.loadShader('Gem').then(obj => {
            let geom = new THREE.TetrahedronGeometry(1.5, 0);
            this.mat = this.getShader(obj.vs, obj.fs);
            let mesh = new THREE.Mesh(geom, this.mat);
            this.group.add(mesh);

            ShaderUIL.push(this.mat);
        });
    }

    getShader(vs, fs) {
        let uniforms = {
            lightColor: {type: 'c', value: new THREE.Color(0xA06CD5)},
            strength: { type: 'f', value: 1.1 },
            shininess: { type: 'f', value: 1 },
            radius: { type: 'f', value: 1 },
            time: { type: 'f', value: 1 },
            LTPower: { type: 'f', value: 0 },
            LTScale: { type: 'f', value: 0.2 },
            LTDistortion: { type: 'f', value: 0 },
            LTAmbient: { type: 'f', value: 1 },
            darkness: {type: 'f', value: 0}
        };

        let shader = new THREE.ShaderMaterial({
            vertexShader: vs,
            fragmentShader: fs,
            uniforms
        });

        // shader.wireframe = true;

        return shader;
    }

    update() {
        if (this.mat) {
            this.mat.uniforms.time.value = performance.now() * 0.00025;
        }
    }
}
