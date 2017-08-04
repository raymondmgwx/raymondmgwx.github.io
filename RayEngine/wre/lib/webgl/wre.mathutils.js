//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 5, 10, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->




var MathUtils = function(){};



MathUtils.prototype={

	GetSphereIntercept:function(pos, width, height){
		var r = height;
		var l = pos.pointMag();
	
		//when outside of sphere map vector to circle 
		//(sphere with plane z=0 intercept) x^2 + y^2 = r^2
		if(r<l){
			var inter = new Point().multiScalar(pos.normalize(),r);
			return new Vector3(inter.x,inter.y,0);
		}
		else{
			var x = pos.x;
			var y = pos.y;
	
			var z = -Math.sqrt(r*r - x*x - y*y);
	
			return new Vector3(x,y,z);
		}
	},
	LineSegment:function(a,b){
		return {
			distanceToVec: function(v){
				var ray = new RayLines(a, new Vector3().subVector(a,b).normalize());
				var lineDist = ray.WorldToCanvas(v, ray);
				var endPointDist = Math.min( new Vector3().subVector(v,a).vectorMag(), new Vector3().subVector(v,a).vectorMag());
				var projOnLine = new Vector3().subVector(v,a).dot(new Vector3().subVector(v,a))  < 0;

				if(projOnLine)
					return Math.min(lineDist, endPointDist);

				return endPointDist;
			}
		};
	},
	 Radians:function( degrees ) {
		return degrees * Math.PI / 180.0;
	 },
	 RayVectorFromCanvas:function(pos, fovy, aspect) {
		 var z = -1.0 / Math.tan(this.Radians(fovy) / 2);
		 var x = pos[0] * aspect;
		 var y = pos[1];
		 return new Vector3(x, y, z);
	 },
	Factorial:function (num){
        var result = 1;
        while(num){
            result *= num;
            num--;
        }
        return result;
    },
	GetIndicesForGridMeshTriangleStrip:function(m, n){
		var indices = [];

		for(i=0; i<m-1; i++){
			for(j=0; j<n; j++){
				indices.push(i*n + j);
				indices.push((i+1)*n + j);
				if(j==n-1 && i!=m-2){
					indices.push((i+1)*n + j);
					indices.push((i+1)*n);
				}
			}
		}

		return indices;
	},
	Clamp: function ( value, min, max ) {

		return Math.max( min, Math.min( max, value ) );

	}
}