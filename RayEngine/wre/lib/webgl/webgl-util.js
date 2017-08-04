//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 4, 16, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->



WebGLUtils=function(){


    function initShaders (gl, varName) {
        var program = createProgram(gl, VShader[varName], FShader[varName]);
        if (!program) {
            console.log('Failed to create program');
            return false;
        }

        gl.useProgram(program);
        ProgramArray[varName]= program;
        return true;
    }
    

    function createProgram(gl, vshader, fshader) {
        var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
        var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
        if (!vertexShader || !fragmentShader) {
            return null;
        }

        var program = gl.createProgram();
        if (!program) {
            return null;
        }

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);

        var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            var error = gl.getProgramInfoLog(program);
            console.log('Failed to link program: ' + error);
            gl.deleteProgram(program);
            gl.deleteShader(fragmentShader);
            gl.deleteShader(vertexShader);
            return null;
        }
        return program;
    }
    

    function loadShader(gl, type, source) {

        var shader = gl.createShader(type);
        if (shader == null) {
            console.log('unable to create shader');
            return null;
        }

        gl.shaderSource(shader, source);

        gl.compileShader(shader);

        var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            var error = gl.getShaderInfoLog(shader);
            console.log('Failed to compile shader: ' + error);
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    function getWebGLContext (canvas, debug) {

        var gl =setupWebGL(canvas);
        if (!gl) return null;

        // if debug is explicitly false, create the context for debugging
        if (arguments.length < 2 || debug) {
            gl = WebGLDebugUtils.makeDebugContext(gl);
        }

        return gl;
    }

    function makeFailHTML(msg) {
        return '' +
            '<div style="margin: auto; width:500px;z-index:10000;margin-top:20em;text-align:center;">' + msg + '</div>';
        return '' +
            '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
            '<td align="center">' +
            '<div style="display: table-cell; vertical-align: middle;">' +
            '<div style="">' + msg + '</div>' +
            '</div>' +
            '</td></tr></table>';
    }

    function setupWebGL(canvas, opt_attribs, opt_onError) {
        function handleCreationError(msg) {
            var container = document.getElementsByTagName("body")[0];
            //var container = canvas.parentNode;
            if (container) {
                var str = window.WebGLRenderingContext ?
                    OTHER_PROBLEM :
                    GET_A_WEBGL_BROWSER;
                if (msg) {
                    str += "<br/><br/>Status: " + msg;
                }
                container.innerHTML = makeFailHTML(str);
            }
        }
        opt_onError = opt_onError || handleCreationError;

        if (canvas.addEventListener) {
            canvas.addEventListener("webglcontextcreationerror", function(event) {
                opt_onError(event.statusMessage);
            }, false);
        }
        var context = create3DContext(canvas, opt_attribs);
        if (!context) {
            if (!window.WebGLRenderingContext) {
                opt_onError("");
            } else {
                opt_onError("");
            }
        }

        return context;
    }

    function create3DContext(canvas, opt_attribs) {
        var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        var context = null;
        for (var ii = 0; ii < names.length; ++ii) {
            try {
                context = canvas.getContext(names[ii], opt_attribs);
            } catch(e) {}
            if (context) {
                break;
            }
        }
        return context;
    }
	
	
	function readShaderFile(gl, fileName, shader,varName) {
	  var request = new XMLHttpRequest();

	  request.onreadystatechange = function() {
		if (request.readyState === 4 && request.status !== 404) {
		onReadShader(gl, request.responseText, shader,varName);
		}
	  }
	  request.open('GET', fileName, true); 
	  request.send();                      
	}

	function onReadShader(gl, fileString, shader,varName) {
	  console.log('start load shader'+shader);
	  if (shader == 'v') {
          VShader[varName] = fileString;
	  } else 
	  if (shader == 'f') {
          FShader[varName] = fileString;
	  }

        for(var i=0;i<ShaderFileName.length;i++)
        {
            if (!VShader[ShaderFileName[i]] ||  !FShader[ShaderFileName[i]])
            {
                return;
            }

        }

		console.log('load shader'+shader);
        start();

	}

	function createFloatArrayBuffer(gl, elSize, array){
		var arrBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, arrBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
		return {id: arrBuffer, elSize: elSize};
	}

	function createIndexBuffer(gl, indices){
		var indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		return indexBuffer;
	}
	
	
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = (window.cancelRequestAnimationFrame ||
        window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
        window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame ||
        window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame ||
        window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame ||
        window.clearTimeout);
    };


    return {

        'initShaders': initShaders,
        
        'getWebGLContext': getWebGLContext,
		
		'readShaderFile': readShaderFile,
		
		'createFloatArrayBuffer':createFloatArrayBuffer,
		
		'createIndexBuffer':createIndexBuffer
    };

}();