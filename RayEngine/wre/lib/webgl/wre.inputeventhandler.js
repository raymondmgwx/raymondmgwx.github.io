//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 5, 14, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->

var mouseEventHandler;
var InputEventHandler=function(canvas,draggablepoints,camera) {

    mouseEventHandler = new MouseEventHandler(canvas.width, canvas.height,draggablepoints,camera);
    this.canvas=canvas;
    this.draggablepoints=draggablepoints;
    this.Init(this);
}

InputEventHandler.prototype={

    Init:function(cur){
        this.canvas.onmouseup = function (event) {
            mouseEventHandler.mouseup();
        }

        this.canvas.onmousedown = function (event) {
            var pos = cur.GetCentralizedMousePos(event);
            mouseEventHandler.mousedown(pos);
        }

        this.canvas.onmousemove = function (event) {
            var pos = cur.GetCentralizedMousePos(event);
            mouseEventHandler.mousemove(pos);
        }

        this.canvas.onmousewheel = function (event) {
            var direction = (event.detail < 0 || event.wheelDelta > 0) ? 1 : -1;
            mouseEventHandler.mousewheel(direction);
            return false;
        }

        document.onkeydown = this.CheckKey;
    },
    GetMousePos:function(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return new Point(event.clientX - rect.left, event.clientY - rect.top);
    },
     GetCentralizedPos:function(mousepos, width, height){
         return new Point(mousepos.x - width/2, -(mousepos.y - height/2));
    },
     GetCentralizedMousePos:function(event){
        return this.GetCentralizedPos(this.GetMousePos(this.canvas, event), this.canvas.width, this.canvas.height);
     },
     CheckKey:function(e) {
        e = e || window.event;

        switch (e.keyCode) {
            case 83: //s
                this.mouseEventHandler.mousewheel(-1);
                break;
            case 87: //w
                this.mouseEventHandler.mousewheel(1);
                break;
        }
    }
}

var currentState;
var MouseEventHandler=function(width,height,draggablepoints,camera){
    this.width = width;
    this.height = height;
    this.mousePos = undefined;
    this.prevMousePos = undefined;
    currentState = this.BaseMouseState(this);
    this.MathUtils=new MathUtils();
    this.draggablepoints=draggablepoints;
    this.camera=camera;
	
	this.funcBaseMouseState=this.BaseMouseState;
	this.funcPointDragMS=this.PointDragMS;
	this.funcPinchRotateMS=this.PinchRotateMS;
}


MouseEventHandler.prototype={
    GetMouseDelta : function(){
        return new Point().subPoint(this.mousePos, this.prevMousePos);
    },
    ViewPortToCanvas:function(pos, width, height){
        var x = pos[0]/(width/2);
        var y = pos[1]/(height/2);
        return new Point(x,y);
    },
    GetRayFromMousePos : function(){
         return this.camera.GetRayFromCanvasPos(this.ViewPortToCanvas(this.mousePos, this.width, this.height));
    },

    GetCanvasFromViewPortPos : function(vpPos){
         return this.ViewPortToCanvas(vpPos, this.width, this.height);
    },

    GetCanvasMousePos : function(){
         return this.ViewPortToCanvas(this.mousePos, this.width, this.height);
    },

    UpdateClosestDraggablePointToMouseRay : function(){
        this.draggablepoints.UpdateSelectedPointToRay(this.camera,this.GetRayFromMousePos(), this.GetCanvasMousePos());
    },

    mousemove : function(pos){
        this.mousePos = pos;
        currentState.mousemove();
        this.prevMousePos = pos;
    },

    mousedown : function(pos){
		console.log("down");
        this.mousePos = this.prevMousePos = pos;
        //currentState.mousedown();
    },

    mouseup: function(){
		console.log("up");
        //currentState.mouseup();
    },

    mousewheel : function(delta){
        //currentState.mousewheel(delta);
    },
    PinchRotateMS:function(cur){
        var res = cur.BaseMouseState(cur);
        cur.draggablepoints.Deactivate();

        cur.mousemove = function(){
            var deltaDrag = cur.GetMouseDelta();
    
            if(deltaDrag.pointMag()>0.1){
                var start = cur.MathUtils.GetSphereIntercept(cur.prevMousePos, cur.width, cur.height);
                var end = cur.MathUtils.GetSphereIntercept(cur.mousePos, cur.width, cur.height);
                var angle = Math.acos(start.normalize().dot(end.normalize()));
                var axis = new Vector3().cross(start, end);

                cur.camera.RotateAroundWSOrigin(angle, axis);
            }
        }
    
        return cur;
    },
    PointDragMS:function(cur){
        var res = this.BaseMouseState(cur);

        res.mousemove = function(){
            var e = cur.GetCanvasFromViewPortPos(cur.mousePos);
            var s = cur.GetCanvasFromViewPortPos(cur.prevMousePos);

            this.draggablepoints.Drag(cur.camera,s,e);
        }

        res.mousewheel = function(){};

        return res;
    },

    BaseMouseState:function(cur){
        return {
            mousemove: function(){
                cur.UpdateClosestDraggablePointToMouseRay();
            },
            mouseup: function(){
				if(currentState!=cur.funcBaseMouseState(cur)){
					//console.log(1);
						currentState =cur.funcBaseMouseState(cur);
				}
            },
            mousedown: function(){
                if(cur.draggablepoints.IsDragAxisSelected())
                    currentState = cur.funcPointDragMS(cur);
                else
                    currentState = cur.funcPinchRotateMS(cur);
            },
            mousewheel: function(delta){

            }
    }
}
}





