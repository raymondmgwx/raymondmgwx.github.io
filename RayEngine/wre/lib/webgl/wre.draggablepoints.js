//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 5, 14, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->

var DraggablePoints=function(points){
    this.MathUtils=new MathUtils();
    this.points=points;
    this.selectedpoint = undefined;
    this.dragAxes = [new Vector3(1,0,0), new Vector3(0,1,0), new Vector3(0,0,1)];
}

var ObservablePoint=function(pos,callback){
    this.callback = callback ||  function(){};
    this.position=pos;
}

ObservablePoint.prototype= {

    GetPosition:function(){
        return new Vector3(this.position.x,this.position.y,this.position.z);
    },
    SetPosition:function(newpos){
        this.position=newpos;
        this.callback();
    }
}


DraggablePoints.prototype={
     Deactivate : function(){
        this.selectedpoint = undefined;
     },
     GetDragAxisWorldRay:function(){
        return RayLines(this.selectedpoint.position, this.dragAxes[this.selectedpoint.state-1]);
     },
     GetDragAxisScreenRay:function(camera){
        var origin = new Vector3(camera.WorldToCanvas(this.selectedpoint.position));
        var dAxis = this.dragAxes[this.selectedpoint.state-1];
        var secondPointOnScreenAxis = new Vector3(camera.WorldToCanvas(new Vector3().addVector(this.selectedpoint.position,new Vector3().multiplyScalar(dAxis,10))));
    
        return RayLines(origin, new Vector3().subVector(secondPointOnScreenAxis, origin).normalize());
    },
    Drag : function(camera,start_canvas, end_canvas){
        var screenRay = this.GetDragAxisScreenRay(camera);
    
        var projS = screenRay.ProjectPointOnRay(start_canvas, screenRay);
        var projE = screenRay.ProjectPointOnRay(end_canvas, screenRay);
    
        var eR = camera.GetRayFromCanvasPos(projE);
        var sR = camera.GetRayFromCanvasPos(projS);
    
    
        var worldRay = this.GetDragAxisWorldRay();
    
        var wE = screenRay.Get3DRaysIntersectionLeastSquares(worldRay, eR);
        var wS = screenRay.Get3DRaysIntersectionLeastSquares(worldRay, sR);
    
    
        var delta = new Vector3().subVector(wE,wS);

        this.selectedpoint.position = new　Vector3().addVector(this.selectedpoint.position, delta);
    },
    IsDragAxisSelected : function(){
        if(! this.selectedpoint ) return false;
        return  this.selectedpoint .state !== 0;
    },
    AddObservablePoint:function(newpoint){
            this.points = this.points.concat(newpoint);
    },
    GetNormalizedCPLocation : function(camera){
        var toCP = new Vector3().subVector(this.selectedpoint.position,camera.eye).normalize();
        var result=new Vector3().addVector(new Vector3().multiplyScalar(toCP,60),camera.eye) ;
        return result;
    },
    GetDraggablePointState:function(mousePos_canvas){
        var dList = [this.redLS.distanceToVec(mousePos_canvas), this.greenLS.distanceToVec(mousePos_canvas),this.blueLS.distanceToVec(mousePos_canvas)];

        var maxDist = 0.05;

        this.closest = _.reduce(dList, function(memo, d, i){
            if(d < memo.dist)
                return {dist:d, i: i+1};
            return memo;
        }, {i: 0, dist: maxDist});

        return this.closest.i;
    },
    UpdateSelectedPointGimbal:function(mousePos_canvas,camera){
        var gimbalSize = 5;
        var fixCP = this.GetNormalizedCPLocation(camera);

        var redV=camera.WorldToCanvas(new Vector3().addVector(fixCP, new Vector3(gimbalSize, 0,0)));
        var red = new Vector3(redV.x,redV.y,redV.z);
        var greenV=camera.WorldToCanvas(new Vector3().addVector(fixCP, new Vector3(0,gimbalSize,0)));
        var green = new Vector3(greenV.x,greenV.y,greenV.z);
        var blueV=camera.WorldToCanvas(new Vector3().addVector(fixCP, new Vector3(0,0,gimbalSize)));
        var blue = new Vector3(blueV.x,blueV.y,blueV.z);

        var origin = new Vector3(camera.WorldToCanvas(fixCP).x,camera.WorldToCanvas(fixCP).y,camera.WorldToCanvas(fixCP).z);

        this.redLS = this.MathUtils.LineSegment(red, origin);
        this.greenLS = this.MathUtils.LineSegment(green, origin);
        this.blueLS = this.MathUtils.LineSegment(blue, origin);

        this.selectedpoint.state = this.GetDraggablePointState(mousePos_canvas);
    },
    UpdateSelectedPointToRay : function(camera,ray, mousePos_canvas){
        var selectP = undefined;
        var maxDist = 10;
        var minDist = Infinity;

        this.points.forEach(function(op){
							
           
            var dist = ray.Vec3ToRayDistance(op.position, ray);
			console.log(ray);
            if(dist < minDist && dist < maxDist && camera.IsVisible(op.position)){
				
                minDist = dist;
                selectP = op;
            }
        });

        this.selectedpoint = selectP;
    
        if(selectP)
            this.UpdateSelectedPointGimbal(mousePos_canvas);

    }
}