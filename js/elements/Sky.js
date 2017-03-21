class Sky {
    constructor() {
        this.group = new THREE.Group();

        Utils.loadShader('Sky').then(obj => {
            let geom = new THREE.IcosahedronGeometry(100, 4);
            this.mat = this.getShader(obj.vs, obj.fs);
            let mesh = new THREE.Mesh(geom, this.mat);
            this.group.add(mesh);

            ShaderUIL.push(this.mat);
        });
    }

    getShader(vs, fs) {
        let uniforms = {
            time: {type: 'f', value: 0},
            sat: {type: 'f', value: 0},
            color: {type: 'c', value: new THREE.Color(0x49BEAA)}
        };

        let shader = new THREE.ShaderMaterial({
            vertexShader: vs,
            fragmentShader: fs,
            uniforms
        });

        shader.side = THREE.BackSide;

        return shader;
    }

    update() {
        if (this.mat) {
            this.mat.uniforms.time.value = performance.now() * 0.000025;
        }
    }
}
