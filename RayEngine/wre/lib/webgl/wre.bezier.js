//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 5, 09, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->




var BezierCurve = function(p0,p1,p2,p3,optInterval){
	this.p0=p0||new Point(0,0);
	this.p1=p1||new Point(0,0);
	this.p2=p2||new Point(0,0);
	this.p3=p3||new Point(0,0);
	this.optInterval=optInterval||0.05;
};

BezierCurve.prototype={
	
	debugCalcu:function(){
		console.log('bezier  debug start')
		// console.log(this.resArrayX);
		// console.log(this.resArrayY);
		// console.log(this.length);
		// console.log(this.vertices);
		console.log('bezier  debug end')
		return 1;
	},
	
	CalcuBezierCurve:function(){
		this.resArrayX=new Array()
		this.resArrayY=new Array()
		var index=0;
		for (var t=0;t<=1;t+=this.optInterval)
		{
			if(t+this.optInterval>1){
				t=1;
			}
			
			this.resArrayX[index]=(1-t)*(1-t)*(1-t)*this.p0.x+3*t*(1-t)*(1-t)*this.p1.x+3*t*t*(1-t)*this.p2.x+t*t*t*this.p3.x;
			this.resArrayY[index]=(1-t)*(1-t)*(1-t)*this.p0.y+3*t*(1-t)*(1-t)*this.p1.y+3*t*t*(1-t)*this.p2.y+t*t*t*this.p3.y;
			index++;
		}
		this.length=index;
		return index;
	},

	//curve point & p0 p1 p2 p3 
	ConvertToVertices:function(){
		if(this.resArrayX && this.resArrayY && this.length){
			var result=new Float32Array(this.length*2+8);
			var index=0;
			for(var i=0;i<this.length;i++){
				result[index]=this.resArrayX[i];
				index++;
				result[index]=this.resArrayY[i];
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