#pragma glslify: pnoise3D = require(glsl-noise/periodic/3d)
#pragma glslify: snoise3D = require(glsl-noise/simplex/3d)

float grain(vec2 texCoord, vec2 resolution, float frame, float multiplier) {
    vec2 mult = texCoord * resolution;
    float offset = snoise3D(vec3(mult / multiplier, frame));
    float n1 = pnoise3D(vec3(mult, offset), vec3(1.0/texCoord * resolution, 1.0));
    return n1 / 2.0 + 0.5;
}

float grain(vec2 texCoord, vec2 resolution, float frame) {
    return grain(texCoord, resolution, frame, 2.5);
}

float grain(vec2 texCoord, vec2 resolution) {
    return grain(texCoord, resolution, 0.0);
}

#pragma glslify: export(grain)