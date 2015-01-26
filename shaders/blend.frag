precision mediump float;

uniform sampler2D background;
uniform float effect;
uniform float time;
uniform vec2 resolution;

varying vec2 screenPosition;

#pragma glslify: grain = require(../)
#pragma glslify: blend = require(glsl-blend-soft-light)
#pragma glslify: luma = require(glsl-luma)

void main() {
    vec3 texColor = texture2D(background, screenPosition).rgb;

    if (effect == 1.0) {
        //some large grain for this demo
        float zoom = 0.35;
        vec3 g = vec3(grain(screenPosition, resolution * zoom, time));

        //get the luminance of the image
        float luminance = luma(texColor);
        vec3 desaturated = vec3(luminance);

        //now blend the noise over top the backround 
        //in our case soft-light looks pretty good
        vec3 color = blend(desaturated, g);

        //and further reduce the noise strength based on some 
        //threshold of the background luminance
        float response = smoothstep(0.05, 0.5, luminance);
        color = mix(color, desaturated, pow(response,2.0));

        gl_FragColor = vec4(color, 1.0);
    } else {
        gl_FragColor = vec4(texColor, 1.0);
    }
}