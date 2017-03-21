uniform vec3 baseColor;
uniform float transition;
uniform float transHeight;
uniform float transDirection;
uniform vec3 multiplyColor;
uniform vec3 lightPos;
uniform vec3 lightColor;
uniform mat4 modelViewMatrix;

varying vec3 vViewPosition;
varying vec3 vWorldPos;
varying vec3 vPos;
varying vec2 vUv;
varying float vAlpha;
varying float vSat;

vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float range(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
    float oldRange = oldMax - oldMin;
    float newRange = newMax - newMin;
    return (((oldValue - oldMin) * newRange) / oldRange) + newMin;
}

float crange(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
    return clamp(range(oldValue, oldMin, oldMax, newMin, newMax), newMin, newMax);
}

vec3 worldLight(vec3 pos, vec3 vpos) {
    vec4 mvPos = modelViewMatrix * vec4(vpos, 1.0);
    vec4 worldPosition = viewMatrix * vec4(pos, 1.0);
    return worldPosition.xyz - mvPos.xyz;
}

float transitionMask(vec2 vuv) {
    float dist = length(vec2(0.5) - vuv);
    float r = range(dist, 0.0, 0.5, 0.0, 1.0);
    float a = step(1.0 - r, transition);
    float b = step(r, transition);
    return mix(a, b, transDirection);
}

float heightMask(vec2 vuv) {
    float dist = length(vec2(0.5) - vuv);
    float r = range(dist, 0.0, 0.5, 0.0, 1.0);
    float a = 1.0 - smoothstep(transHeight - 0.5, transHeight + 0.5, 1.0 - r);
    float b = 1.0 - smoothstep(transHeight - 0.5, transHeight + 0.5, r);

    float height = mix(a, b, transDirection);

    return height;
}

vec3 getDNormal(vec3 viewPos) {
    vec3 dfx = vec3(0.0);
    vec3 dfy = vec3(0.0);

    dfx.x = dFdx(viewPos.x);
    dfx.y = dFdx(viewPos.y);
    dfx.z = dFdx(viewPos.z);

    dfy.x = dFdy(viewPos.x);
    dfy.y = dFdy(viewPos.y);
    dfy.z = dFdy(viewPos.z);

    return cross(dfx, dfy);
}

vec3 calculateLight(vec3 worldPos, vec3 n) {
    vec3 lPos = worldLight(lightPos, vPos);
    float volume = max(dot(normalize(lPos), n), 0.0);

    vec3 color = mix(baseColor, lightColor, volume);
    color *= range(volume, 0.0, 1.0, 0.8, 1.0);

    return color;
}

float getFogAmount() {
    vec2 pos = vPos.xz;
    return pow(smoothstep(25.0, 35.0, length(pos)), 2.0);
}

void main() {
    vec3 normal = normalize(getDNormal(vViewPosition));

    vec3 terrain = calculateLight(vWorldPos, normal) * multiplyColor;
    terrain = rgb2hsv(terrain);
    terrain.y += vSat;
    terrain = hsv2rgb(terrain);
    gl_FragColor = vec4(terrain, 1.0);

    gl_FragColor = mix(gl_FragColor, vec4(0.0), getFogAmount());
    gl_FragColor.a *= transitionMask(vUv);

    if (gl_FragColor.a < 0.01) discard;
}
