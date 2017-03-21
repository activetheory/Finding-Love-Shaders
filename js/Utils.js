class Utils {
    static toRadians(deg) {
        return deg * (Math.PI/180);
    }

    static headsTails(heads, tails) {
        return !Utils.doRandom(0, 1) ? heads : tails;
    }

    static doRandom(min, max, precision) {
        function rand(min, max) {
    		return lerp(Math.random(), min, max);
    	}

    	function lerp(ratio, start, end) {
    		return start + (end - start) * ratio;
    	}

        if (typeof precision == 'number') {
			var p = Math.pow(10, precision);
			return Math.round(rand(min, max) * p) / p;
		} else {
			return Math.round(rand(min - 0.5, max + 0.5));
		}
    }

    static loadShader(name) {
        return new Promise((resolve, reject) => {
            Promise.all([fetch(`shaders/${name}.vs`), fetch(`shaders/${name}.fs`)]).then(data => {
                let vs, fs;
                data.forEach(response => {
                    if (response.url.indexOf('vs') > -1) vs = response.text();
                    else fs = response.text();
                });

                Promise.all([vs, fs]).then(data => {
                    vs = data[0];
                    fs = data[1];

                    resolve({vs, fs});
                });
            })

        });
    }

    static loadGeometry(name) {
        return new Promise((resolve, reject) => {
            fetch(`geometry/${name}.json`).then(response => {
                response.text().then(text => {
                    let loader = new THREE.BufferGeometryLoader();
                    let geom = loader.parse(JSON.parse(text));
                    console.log(geom);
                    resolve(geom);
                });
            })

        });
    }

    static range(oldValue, oldMin, oldMax, newMin, newMax, clamped) {
		let oldRange = (oldMax - oldMin);
		let newRange = (newMax - newMin);
		let newValue = (((oldValue - oldMin) * newRange) / oldRange) + newMin;
		if (clamped) return _this.clamp(newValue, Math.min(newMin, newMax), Math.max(newMin, newMax));
		return newValue;
	}
}

class ShaderUIL {
    constructor(mat) {
        this.group = window.uil.add('group', {name: location.hash.slice(1)});
        this.group.open();

        for (var key in mat.uniforms) {
            let obj = mat.uniforms[key];
            switch (obj.type) {
                case 'f': this.createNumber(obj, key); break;
                case 'c': this.createColor(obj, key); break;
            }
        }
    }

    createNumber(obj, key) {
        let params = {
            name: key,
            type: 'html',
            value: obj.value,
            callback: val => {
                obj.value = val;
            }
        };

        this.group.add('number', params);
    }

    createColor(obj, key) {
        let params = {
            name: key,
            type: 'html',
            value: obj.value.getHex(),
            callback: val => {
                if (Array.isArray(val)) obj.value.setRGB(val[0], val[1], val[2]);
                else obj.value.set(val);
            }
        };

        this.group.add('color', params);
    }

    static push(mat) {
        new ShaderUIL(mat);
    }
}
