//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 5, 11, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->




var BezierSurface = function(startPoint,xInterval,zInterval,optUInterval,optVInterval){
	this.MathFunc=new MathUtils();
	this.nNum=3;
	this.mNum=3;
	this.pointNum=(this.nNum+1)*(this.mNum+1);
	this.optUInterval=optUInterval||0.05;
	this.optVInterval=optVInterval||0.05;
	this.InitControlPoints(startPoint, xInterval, zInterval);

};



BezierSurface.prototype={
	DebugBezierSurface:function(){
		console.log(this.controlPoints);
		return 1;
	},
	GenerateParam_UV:function(uNum, vNum, callback){
		var uInterval = 1/(uNum-1);
		var vInterval = 1/(vNum-1);
		var i,j;
		for(i=0; i<uNum; i++){
			var u = i*uInterval;
			for(j=0; j<vNum; j++){
				var v = j*vInterval;
				//console.log(v);
				callback(u,v);
			}
		}
	},
	GetBezierSurfaceTexCoords:function(callback, uNum, vNum){
			var texCoords = [];
			this.GenerateParam_UV(uNum, vNum, function(u,v){
				texCoords.push(u,v);
			});

			return texCoords;
	},
	GetBezierSurfaceNormals:function(callback, uDeriv, vDeriv, uNum, vNum){
		var normals = [];
	
		return normals;
	},
	GetBezierSurfaceVertices:function(callback, uNum, vNum){
		var vertices = [];
		this.GenerateParam_UV(uNum, vNum, function(u,v){
			var p = callback(u,v);
			vertices.push(p.x, p.y, p.z);
		});
		return vertices;
	},
	InitControlPoints:function(startPos, xInterval, zInterval){
			var pointMatrix4x4=[];
			for(var i=0; i<=this.nNum; i++){
				var newArray=[];
				for(var j=0; j<=this.mNum; j++){
					var pos = new Vector3(xInterval*j, Math.random()*Math.pow(-1,Math.round( Math.random())), zInterval*i);
					var newV=new Vector3().addVector(pos,startPos);
					newArray.push(newV);
				}
				pointMatrix4x4.push(newArray);
			}
			this.controlPoints=pointMatrix4x4;		
			this.elements = this.CalcuBezierSurfaceParam(this.CalcuBezierSurface(this,this.controlPoints), this.optUInterval,this.optVInterval);
			//console.log(this.controlPoints);
			return pointMatrix4x4;
	},
	Binu:function(cur,i,n,u){
		return Math.pow(u,i)*Math.pow(1-u,n-i)*cur.MathFunc.Factorial(n)/(cur.MathFunc.Factorial(i) * cur.MathFunc.Factorial(n-i));
	},
	Bjmv:function(cur,j,m,v){
		return Math.pow(v,j)*Math.pow(1-v,m-j)*cur.MathFunc.Factorial(m)/(cur.MathFunc.Factorial(j) * cur.MathFunc.Factorial(m-j));
	},
    BezierCurveCalByU(cur,u,pointUArray){
			var Binu = cur.Binu;
			var n = cur.nNum;
			var p = new Vector3();
		    var temp=new Vector3();
			for(var i=0; i<=n; i++) {
				var mulV = new Vector3().multiplyScalar(pointUArray[i], Binu(cur, i, n, u));
				temp.addVector(p, mulV);
				p = temp;
			}

			return p;
	},
	CalcuBezierSurface:function(cur,controlPoints){
		return function(u,v){
			var Bjmv = cur.Bjmv;
			var BezierCurveCalByU=cur.BezierCurveCalByU;
			var m=cur.mNum;
			var p = new Vector3();
			var temp=new Vector3();
			for(var i=0; i<=m; i++){
				var mulV=new Vector3().multiplyScalar(BezierCurveCalByU(cur,u,controlPoints[i]),Bjmv(cur,i,m,v));
				temp.addVector(p,mulV);
				p=temp;
			}
			return p;
		}
	},
	CalcuBezierSurfaceParam:function (callback, uNum, vNum){
			var indices = this.MathFunc.GetIndicesForGridMeshTriangleStrip(uNum,vNum);
			var vertices = this.GetBezierSurfaceVertices(callback, uNum, vNum);
			return {dIndices:indices,dVertices:vertices,nIndices:indices.length};
	}
}