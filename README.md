# glsl-film-grain

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

![img](http://i.imgur.com/uXUivnH.png)

[(click for demo)](http://mattdesl.github.io/glsl-film-grain)

Natural looking film grain using 3D noise functions. Inspired by [Martins Upitis](http://devlog-martinsh.blogspot.ca/2013/05/image-imperfections-and-film-grain-post.html). 

This is a fairly expensive technique to achieve film grain, but it looks more realistic than a [hash function](https://www.npmjs.com/package/glsl-random) and also produces better motion.

Simplest example:

```glsl
#pragma glslify: grain = require(glsl-film-grain)

void main() {
    float grainSize = 2.0;
    float g = grain(texCoord, resolution / grainSize);
    vec3 color = vec3(g);
    gl_FragColor = vec4(color, 1.0);
}
```

Results in:

![grain](http://i.imgur.com/OEBZs8B.png)


See [blending tips](#blending-tips) and the [demo source](demo.js) for details.

## Usage

[![NPM](https://nodei.co/npm/glsl-film-grain.png)](https://www.npmjs.com/package/glsl-film-grain)

#### `f = grain(texCoord, resolution[, frame[, q]])`

Returns a float for the monochromatic grain with the given options:

- `texCoord` the UV coordinates of your scene
- `resolution` the resolution of your scene in pixels, optionally scaled to adjust the grain size
- `frame` the animation frame, which is an offset into the Z of the 3D noise
- `q` is a coefficient for the offset calculation, and may evoke subtly different motion. Defaults to 2.5

## blending tips

There are a lot of ways to blend the noise onto the 3D scene or image. The solution used in the demo uses [glsl-blend-soft-light](https://www.npmjs.com/package/glsl-blend-soft-light) and [glsl-luma](https://www.npmjs.com/package/glsl-luma).

```glsl
    vec3 g = vec3(grain(texCoord, p));
  
    //blend the noise over the background, 
    //i.e. overlay, soft light, additive
    vec3 color = blend(backgroundColor, g);
    
    //get the luminance of the background
    float luminance = luma(backgroundColor);
    
    //reduce the noise based on some 
    //threshold of the background luminance
    float response = smoothstep(0.05, 0.5, luminance);
    color = mix(color, backgroundColor, pow(response, 2.0));
    
    //final color
    gl_FragColor = vec4(color, 1.0);
```

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/glsl-film-grain/blob/master/LICENSE.md) for details.
