//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 5, 09, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->\

var canvas = document.getElementById('webgl');

var gl = WebGLUtils.getWebGLContext(canvas);
var VShader=new Object();
var FShader=new Object();
var ShaderFileName=[];
var ProgramArray= new Object();

function main() {
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    ShaderFileName.push("BEZIERCURVE");
	WebGLUtils.readShaderFile(gl, '../RayEngine/project/CubicBezierCurveDemo/Default.vert', 'v','BEZIERCURVE');
	WebGLUtils.readShaderFile(gl, '../RayEngine/project/CubicBezierCurveDemo/Default.frag', 'f','BEZIERCURVE');
}


function tick() {
    requestAnimationFrame(tick);
    drawBezierCurve();
}

function start(){
	
	if (!WebGLUtils.initShaders(gl, 'BEZIERCURVE')) {
        console.log('Failed to intialize shaders.');
        return;
    }

    drawBezierCurve();

    tick();
}



function drawBezierCurve()
{
    var n = initVertexBuffers();
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.Point, n, 4);
    gl.drawArrays(gl.LINE_STRIP, 0, n);
}

function initVertexBuffers() {

	//draw bezier
	var p0=new Point(document.getElementById("p0x").value,document.getElementById("p0y").value);
	var p1=new Point(document.getElementById("p1x").value,document.getElementById("p1y").value);
	var p2=new Point(document.getElementById("p2x").value,document.getElementById("p2y").value);
	var p3=new Point(document.getElementById("p3x").value,document.getElementById("p3y").value);
	var bCurve=new BezierCurve(p0,p1,p2,p3,0.01);
	var n=bCurve.CalcuBezierCurve();
    var vertices = bCurve.ConvertToVertices();


	//

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }


    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(ProgramArray["BEZIERCURVE"], 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    return n;
}

main();