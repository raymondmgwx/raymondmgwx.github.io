//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 6, 17, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->\

var canvas = document.getElementById('webgl');

var gl = WebGLUtils.getWebGLContext(canvas);

var VShader=new Object();
var FShader=new Object();
var ShaderFileName=[];
var ProgramArray= new Object();

var gridVertData;
var draggablePoints;
var cam;

function main() {
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    ShaderFileName.push("NURBSCURVE");
	WebGLUtils.readShaderFile(gl, '../RayEngine/project/NURBSCurveDemo/Default.vert', 'v',"NURBSCURVE");
	WebGLUtils.readShaderFile(gl, '../RayEngine/project/NURBSCurveDemo/Default.frag', 'f',"NURBSCURVE");

    cam=new Camera();
    cam.Perspective(50, window.innerWidth / window.innerHeight, 1, 2000 );
    cam.LookAt(500, 500, 1050, 0, 0, 0, 0, 1, 0);


}


function start(){


        if (!WebGLUtils.initShaders(gl, "NURBSCURVE")) {
            console.log('Failed to intialize shaders.');
            return;
        }
        drawNURBSCurve();


}


function drawNURBSCurve()
{

  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  var u_MvpMatrix = gl.getUniformLocation(ProgramArray["NURBSCURVE"], 'u_MvpMatrix');
  if (!u_MvpMatrix) { 
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  }


   gl.uniformMatrix4fv(u_MvpMatrix, false, cam.CameraMatrix4x4.ConvertToFloat32Array());
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    gl.drawArrays(gl.LINE_STRIP, 0, n);


}


function initVertexBuffers(gl) {

    var nurbsControlPoints = [];
    var nurbsKnots = [];
    var nurbsDegree = 3;

    for ( var i = 0; i <= nurbsDegree; i ++ ) {

        nurbsKnots.push( 0 );

    }

    for ( var i = 0, j = 20; i < j; i ++ ) {

        nurbsControlPoints.push(
            new Vector4(
                Math.random() * 400 - 200,
                Math.random() * 400,
                Math.random() * 400 - 200,
                1 // weight of control point: higher means stronger attraction
            )
        );

        var knot = ( i + 1 ) / ( j - nurbsDegree );
        nurbsKnots.push(new MathUtils().Clamp( knot, 0, 1 ) );

    }
    var nurbsCurve = new NURBSCurve(nurbsDegree, nurbsKnots, nurbsControlPoints);
    var n=nurbsCurve.getPoints(200);
    var vertices= nurbsCurve.ConvertToVertices();



    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }


    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(ProgramArray["NURBSCURVE"], 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    return n.length;
}
main();