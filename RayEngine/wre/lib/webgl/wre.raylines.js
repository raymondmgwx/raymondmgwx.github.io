//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 5, 14, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->

var RayLines=function(startpoint,direction){
    this.startpoints  = startpoint;
    this.direction = direction;
}


RayLines.prototype={
    GetPosition:function(t){
        return new Vector3().addVector(this.startpoints,new Vector3().multiplyScalar(this.direction,t));
    },
    Get3DRaysIntersectionLeastSquares:function(ray1, ray2){
        var A = [ [ray1.direction.x,  - ray2.direction.x],
            [ray1.direction.y,  - ray2.direction.y],
            [ray1.direction.z,  - ray2.direction.z] ];

        var b = new Vector3().subVector(ray2.startpoints, ray1.startpoints);

        var AT = numeric.transpose(A);

        var ATAInv = numeric.inv(numeric.dot(AT,A));

        var ATAInvAT = numeric.dot(ATAInv,AT);

        var coeffs = numeric.dot(ATAInvAT, b);

        return ray1.GetPosition(coeffs[0]);
    },
    ProjectPointOnRay:function(vec, ray){
        var toV = new Vector3().subVector(vec,ray.startpoints);
        var projection = new Vector3().addVector(ray.startpoints,new Vector3().multiplyScalar(ray.direction,toV.dot(ray.direction)));
        return projection;
    },
    Vec3ToRayDistance:function(vec, ray){
        var projection = this.ProjectPointOnRay(vec, ray);
        var normalComponent =new Vector3().subVector(projection,vec);
        return normalComponent.vectorMag();
    }
}