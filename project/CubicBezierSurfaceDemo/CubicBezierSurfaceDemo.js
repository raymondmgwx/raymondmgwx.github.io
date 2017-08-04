//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 5, 10, 2017  by Raymond Wang                             //
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
    ShaderFileName.push("BEZIERSURFACE","GRID");
	WebGLUtils.readShaderFile(gl, '../project/CubicBezierSurfaceDemo/Default.vert', 'v',"BEZIERSURFACE");
	WebGLUtils.readShaderFile(gl, '../project/CubicBezierSurfaceDemo/Default.frag', 'f',"BEZIERSURFACE");
    WebGLUtils.readShaderFile(gl, '../project/CubicBezierSurfaceDemo/Grid.vert', 'v',"GRID");
    WebGLUtils.readShaderFile(gl, '../project/CubicBezierSurfaceDemo/Grid.frag', 'f',"GRID");

    cam=new Camera();
    cam.Perspective(30, 1, 1, 100);
    cam.LookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);


}

function tick() {
    requestAnimationFrame(tick);
    drawBezierSurface();
	
	
	if(draggablePoints.closestPoint ){

		drawGrid();
	}
}

function start(){


        if (!WebGLUtils.initShaders(gl, "BEZIERSURFACE")) {
            console.log('Failed to intialize shaders.');
            return;
        }
        drawBezierSurface();

        if ( !WebGLUtils.initShaders(gl, "GRID")) {
            console.log('Failed to intialize shaders.');
            return;
        }
        drawGrid();


        new InputEventHandler(canvas,draggablePoints,cam);

}


//points:martix[row][col],val:Vector3
function drawGrid(){
   // console.log("grid");
    var gridVertices = [];
    var dragObjectsPointv = [];

	for(var r=0;r<=3;r++){
		for(var c=0;c<=3;c++){
            if(c==1||c==2){
                gridVertices.push(gridVertData[r][c].x,gridVertData[r][c].y,gridVertData[r][c].z);
            }
            gridVertices.push(gridVertData[r][c].x,gridVertData[r][c].y,gridVertData[r][c].z);
            dragObjectsPointv.push(new ObservablePoint(gridVertData[r][c]));
		}
	}

    var index=0;
    for(var r=0;r<=3;r++){
        for(var c=0;c<=3;c++){
            if(index<12)
            {
                gridVertices.push(gridVertData[r][c].x,gridVertData[r][c].y,gridVertData[r][c].z);
                gridVertices.push(gridVertData[r+1][c].x,gridVertData[r+1][c].y,gridVertData[r+1][c].z);
            }
            index++;
        }
    }


    draggablePoints=new DraggablePoints(dragObjectsPointv);

    var gridVertexBuffer = gl.createBuffer();
    if (!gridVertexBuffer) {
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, gridVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gridVertices), gl.STATIC_DRAW);

    var FSIZE = gridVertices.BYTES_PER_ELEMENT;
    var a_Position = gl.getAttribLocation(ProgramArray["GRID"], 'a_Position');
    if(a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(a_Position);


    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    var u_MvpMatrix = gl.getUniformLocation(ProgramArray["GRID"], 'u_MvpMatrix');
    if (!u_MvpMatrix) {
        console.log('Failed to get the storage location of u_MvpMatrix');
        return;
    }


    gl.uniformMatrix4fv(u_MvpMatrix, false, cam.CameraMatrix4x4.ConvertToFloat32Array());
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays( gl.LINES, 0, gridVertices.length/3);
}


function drawBezierSurface()
{

  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  var u_MvpMatrix = gl.getUniformLocation(ProgramArray["BEZIERSURFACE"], 'u_MvpMatrix');
  if (!u_MvpMatrix) { 
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  }


   gl.uniformMatrix4fv(u_MvpMatrix, false, cam.CameraMatrix4x4.ConvertToFloat32Array());
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  gl.drawElements(gl.TRIANGLE_STRIP, n, gl.UNSIGNED_SHORT, 0);


}


function initVertexBuffers(gl) {


    var bSurface=new BezierSurface(new Vector3(-1,0,-1), 0.5, 0.5, 20, 20);
 
    var vertices=bSurface.elements.dVertices;
    var indices=bSurface.elements.dIndices;
    gridVertData=bSurface.controlPoints;


    var vertexBuffer = gl.createBuffer();
    var indexBuffer = gl.createBuffer();
    if (!vertexBuffer || !indexBuffer) {
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    var FSIZE = vertices.BYTES_PER_ELEMENT;
    var a_Position = gl.getAttribLocation(ProgramArray["BEZIERSURFACE"], 'a_Position');
    if(a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	
    return indices.length;
}
main();