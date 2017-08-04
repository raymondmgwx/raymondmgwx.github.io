//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 5, 18, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->




var CubicHermiteCurve = function(p0,p1,p2,p3,optInterval){
	this.p0=p0||new Point(0,0);
	this.p1=p1||new Point(0,0);
	this.p2=p2||new Point(0,0);
	this.p3=p3||new Point(0,0);
	this.optInterval=optInterval||0.05;
};

CubicHermiteCurve.prototype={
	
	debugCalcu:function(){
		console.log('hermite  debug start')
		console.log(this.resArray);
		// console.log(this.resArrayY);
		// console.log(this.length);
		// console.log(this.vertices);
		console.log('hermite  debug end')
		return 1;
	},
	
	//p0,p3 regard as control point
	CalcuHermiteCurve:function(){
		this.resArray=new Array()
		var index=0;
		for (var t=0;t<=1;t+=this.optInterval)
		{
			if(t+this.optInterval>1){
				t=1;
			}
			
			var v0=new Point().subPoint(this.p2,this.p0);
			var v1=new Point().subPoint(this.p3,this.p1);
			
			var h0_3=(2*t+1)*(1-t)*(1-t);
			var h1_3=t*(1-t)*(1-t);
			var h2_3=-(t*t)*(1-t);
			var h3_3=(3-2*t)*(t*t);
			
			var p0h0_3=new Point().multiScalar(this.p1,h0_3);
			var v0h1_3=new Point().multiScalar(v0,h1_3);
			var v1h2_3=new Point().multiScalar(v1,h2_3);
			var p1h3_3=new Point().multiScalar(this.p2,h3_3);
					
			this.resArray[index]=new Point().addPoint(new Point().addPoint(p0h0_3,v0h1_3),new Point().addPoint(v1h2_3,p1h3_3));
			//console.log(this.resArray[index]);
			index++;
		}
		this.length=index;
		return index;
	},

	//curve point & p0 p1 p2 p3 
	ConvertToVertices:function(){
		if(this.resArray && this.length){
			var result=new Float32Array(this.length*2+8);
			var index=0;
			for(var i=0;i<this.length;i++){
				result[index]=this.resArray[i].x;
				index++;
				result[index]=this.resArray[i].y;
				index++
			}
			result[this.length*2]=this.p0.x;
			result[this.length*2+1]=this.p0.y;
			result[this.length*2+2]=this.p1.x;
			result[this.length*2+3]=this.p1.y;
			result[this.length*2+4]=this.p2.x;
			result[this.length*2+5]=this.p2.y;
			result[this.length*2+6]=this.p3.x;
			result[this.length*2+7]=this.p3.y;


			this.vertices=result;
			return result;
		}else{
			console.log('please calculate first');
			return 0;
		}
	}
};