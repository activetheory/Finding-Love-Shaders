class Main {
    constructor() {
        this.initThree();
        this.resize();
        this.initUIL();
        requestAnimationFrame(this.render.bind(this));
    }

    initThree () {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.controls = new THREE.OrbitControls(this.camera);
        this.camera.position.z = 4;
        document.body.appendChild(this.renderer.domElement);
        window.onresize = () => this.resize();

        let _this = this;

        let view = (function() {
            let hash = location.hash.slice(1);
            switch (hash) {
                case 'Gem': return new Gem(); break;
                case 'Sky': return new Sky(); break;
                case 'Terrain':
                    _this.camera.position.z = 50;
                    _this.camera.position.y = 30;
                    return new Terrain();
                break;
                default: throw 'No view found';
            }
        })();
        this.scene.add(view.group);
        this.view = view;
    }

    initUIL() {
        window.uil = new UIL.Gui({css:'top: 0; right: 50px;', size: 300, center: true});
    }

    resize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    render() {
        this.view.update && this.view.update();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}

window.onload = () => new Main();
