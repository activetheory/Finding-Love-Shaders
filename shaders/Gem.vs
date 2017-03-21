varying vec3 vPos;
varying vec3 vEyeDir;
varying vec3 vLightDir;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
    vec3 lightPosition = vec3(0.0);

    vUv = uv;
    vPos = position;
    vEyeDir = normalize(cameraPosition - position.xyz);
    vLightDir = normalize(lightPosition - position.xyz);
    vNormal = normalMatrix * normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
