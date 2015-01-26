var triangle = require('a-big-triangle')
var loop = require('raf-loop')
var Texture = require('gl-texture2d')
var EmptyTexture = require('gl-white-texture')
var load = require('img')

//get a shader
var glslify = require('glslify')
var createShader = glslify({
    fragment: './shaders/blend.frag',
    vertex: './shaders/blend.vert'
})

var size = 512
var dpr = 1// window.devicePixelRatio||1

//create our WebGL test example
var app = create({
    shader: createShader,
    width: size * dpr,
    height: size * dpr 
}).start()

var canvas = app.gl.canvas

//add to DOM
require('domready')(function() {
    require('dom-css')(canvas, {
        width: size,
        height: size
    })

    document.body.style.margin = '0'
    document.body.appendChild(canvas)
})

function create(opt) {
    opt = opt || {}

    var image = require('lena').transpose(1, 0, 2)

    //setup context & textures
    var gl = require('webgl-context')(opt)
    var shader = typeof opt.shader === 'function' ? opt.shader(gl) : opt.shader

    var tex = Texture(gl, image)
    // var tex = EmptyTexture(gl)
    // load('screen.png', function(err, image) {
    //     if (err) throw err
    //     tex = Texture(gl, image)
    // })
    // var tex = require('gl-checker-texture')(gl, { colors: [
    //     [0x50,0x50,0x50,0xff],
    //     [0x46,0x46,0x46,0xff]
    // ]})

    gl.disable(gl.DEPTH_TEST)

    var time = 0
    var frame = 0
    var effect = true
    var app = loop(render)
    app.gl = gl

    //draw it initially
    render(0)

    gl.canvas.addEventListener('click', function(ev) {
        effect = !effect
    })

    //return the context
    return app

    function render(dt) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

        shader.bind()
        shader.uniforms.background = 0
        shader.uniforms.effect = effect ? 1 : 0
        time += dt

        if (time > 35) {
            frame += 0.15
            time = 0
            shader.uniforms.time = frame
        }

        tex.bind()
        triangle(gl)
    }
}