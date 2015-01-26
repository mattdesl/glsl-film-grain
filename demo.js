var triangle = require('a-big-triangle')
var loop = require('raf-loop')
var Texture = require('gl-texture2d')
var css = require('dom-css')

//get a shader
var glslify = require('glslify')
var createShader = glslify({
    fragment: './shaders/blend.frag',
    vertex: './shaders/blend.vert'
})

//create the testbed
var app = create({
    shader: createShader,
    width: 512,
    height: 512 
}).start()

var canvas = app.gl.canvas

//add to DOM
require('domready')(function() {
    var body = document.body

    css(body, 'margin', 0)
    body.appendChild(canvas)

    var info = body.appendChild(document.createElement('div'))
    info.innerHTML = [
        '<p>click the image to toggle</p>',
        '<p>hover over it to animate the grain</p>'
    ].join('')
    
    css(info, {
        lineHeight: '3px',
        marginLeft: 20,
        fontFamily: '"Georgia", serif'
    })
})

function create(opt) {
    opt = opt || {}

    //setup context & textures
    var gl = require('webgl-context')(opt)
    var shader = typeof opt.shader === 'function' ? opt.shader(gl) : opt.shader

    //get a test image for our background
    var image = require('lena').transpose(1, 0, 2)    
    var tex = Texture(gl, image)

    var time = 0
    var frame = 0
    var effect = true
    var hover = false
    var app = loop(render)
    app.gl = gl

    //draw it initially
    render(0)

    //bind some controls 
    addEvents(gl.canvas)

    return app

    function render(dt) {
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

        //set up uniforms
        shader.bind()
        shader.uniforms.resolution = [gl.drawingBufferWidth, gl.drawingBufferHeight]
        shader.uniforms.background = 0
        shader.uniforms.effect = effect ? 1 : 0
        
        //film grain tends to look good when you update it
        //every N milliseconds, instead of every frame
        time += hover ? dt : 0
        if (time > 54) {
            frame += 0.1
            time = 0
            shader.uniforms.time = frame
        }

        //draw scene
        tex.bind()
        triangle(gl)
    }

    function addEvents(canvas) {
        canvas.addEventListener('click', function(ev) {
            ev.preventDefault()
            effect = !effect
        })
        canvas.addEventListener('mouseover', function(ev) {
            hover = true
        })
        canvas.addEventListener('mouseleave', function(ev) {
            hover = false
        }) 
    }
}