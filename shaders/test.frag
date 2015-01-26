precision mediump float;

uniform vec3 foreground;
uniform vec3 background;

#pragma glslify: blend = require(../)

void main() {
    vec3 rgb = blend(background, foreground);
    gl_FragColor = vec4(rgb, 1.0);
}