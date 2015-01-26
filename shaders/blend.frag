precision mediump float;

uniform sampler2D background;

varying vec2 screenPosition;

//#pragma glslify: blend = require(../)

#pragma glslify: noise3D = require(glsl-noise/periodic/3d)
#pragma glslify: noise2D = require(glsl-noise/periodic/2d)
#pragma glslify: snoise2D = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3D = require(glsl-noise/simplex/3d)
#pragma glslify: blend = require(glsl-blend-soft-light)
#pragma glslify: luma = require(glsl-luma)

const float timer = 1.0;

const float permTexUnit = 1.0/512.0;        // Perm texture texel-size
const float permTexUnitHalf = 0.5/512.0;    // Half perm texture texel-size

float width = 512.0;
float height = 512.0;

const float grainamount = 0.5; //grain amount
const bool colored = false; //colored noise?
const float coloramount = 0.6;
const float grainsize = 1.6; //grain particle size (1.5 - 2.5)
const float lumamount = 1.0; //

uniform float effect;
uniform float time;

float grainf(vec2 texCoord, vec2 resolution, float frame) {
    float size = 2.5;
    vec2 mult = texCoord * resolution;
    // float offset = noise3D(vec3(mult / size, frame), vec3(1.0/texCoord * resolution, 1.0));
    float offset = snoise3D(vec3(mult / size, frame));
    // float n1 = snoise3D(vec3(mult, offset));
    float n1 = noise3D(vec3(mult, offset), vec3(1.0/texCoord * resolution, 0.0));
    return n1 / 2.0 + 0.5;
}

float grainStatic(vec2 texCoord, vec2 resolution) {
    float size = 2.5;
    vec2 mult = texCoord * resolution;
    float offset = noise3D(vec3(mult / size, 0.0), vec3(1.0/texCoord * resolution, 1.0));
    float n1 = noise3D(vec3(mult, offset), vec3(1.0/texCoord * resolution, 0.0));
    return n1 / 2.0 + 0.5;
}


vec3 grainColor(vec2 texCoord, vec2 resolution, float frame) {
    return vec3(
        grainf(texCoord, resolution, frame*-1.5),
        grainf(texCoord, resolution, frame),
        grainf(texCoord, resolution, frame*1.5)
    );
}

void main() {
    vec3 col = texture2D(background, screenPosition).rgb;
    float zoom = 0.35;
    float gf = grainf(screenPosition, vec2(512.0) * zoom, time);
    // vec3 g = grainColor(screenPosition, vec2(512.0) * zoom, time);
    vec3 g = vec3(gf);

    //get the luminance of the image
    float luminance = luma(col);
    vec3 desaturated = vec3(luminance);

    //mix to N% sepia
    // vec3 sepia = desaturated*vec3(227.0/255.0, 196.0/255.0, 129.0/255.0);
    // vec3 sepiaCol = desaturated;
    // vec3 sepiaCol = mix(col, sepia, 0.65);

    //blend the noise with soft light
    vec3 gcol = blend(desaturated, g);

    //a bit of a falloff for our grain
    float response = smoothstep(0.05, 0.5, luminance);
    gcol = mix(gcol, desaturated, pow(response,2.0));

    gl_FragColor = vec4(gcol, 1.0);
    gl_FragColor.rgb = mix(col, gl_FragColor.rgb, effect);

    //noisiness response curve based on scene luminance
    // vec3 lumcoeff = vec3(0.299,0.587,0.114);
    // float luminance = mix(0.0,dot(col, lumcoeff),lumamount);
    // float lum = smoothstep(0.2,0.0,luminance);
    // lum += luminance;
    
    // g = mix(g,vec3(0.0),pow(lum,4.0));
    // col = col+g*grainamount;
    // gl_FragColor = vec4(col, 1.0);

    // gl_FragColor = vec4(col, 1.0);
    // gl_FragColor = vec4(blend(col, g), 1.0);
    // gl_FragColor = vec4(g, 1.0);
    
    // float noise = snoise3D(vec3(texCoord*256.0 + 2.0/512.0, 0.0));
    // gl_FragColor = vec4(vec3(noise), 1.0);

    // vec3 rotOffset = vec3(1.425,3.892,5.835); //rotation offset values  
    // vec2 rotCoordsR = coordRot(texCoord, timer + rotOffset.x);
    // vec3 noise = vec3(snoise3D(vec3(vec2(width/grainsize,height/grainsize),0.0)));
  
    // // if (colored)
    // // {
    // //     vec2 rotCoordsG = coordRot(texCoord, timer + rotOffset.y);
    // //     vec2 rotCoordsB = coordRot(texCoord, timer + rotOffset.z);
    // //     noise.g = mix(noise.r,noise3d(vec3(rotCoordsG*vec2(width/grainsize,height/grainsize),1.0)),coloramount);
    // //     noise.b = mix(noise.r,noise3d(vec3(rotCoordsB*vec2(width/grainsize,height/grainsize),2.0)),coloramount);
    // // }


    

    // vec4 bgColor = texture2D(background, screenPosition);
    // vec4 fgColor = texture2D(foreground, screenPosition);

    // vec3 color = blend(bgColor.rgb, fgColor.rgb);
    // gl_FragColor = vec4(fgColor.rgb, 1.0);
}