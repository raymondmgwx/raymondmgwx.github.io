//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 5, 29, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->




var BSplineCurve = function(p0,p1,p2,p3,optInterval){
    this.p0=p0||new Point(0,0);
    this.p1=p1||new Point(0,0);
    this.p2=p2||new Point(0,0);
    this.p3=p3||new Point(0,0);
    this.optInterval=optInterval||0.05;
};

BSplineCurve.prototype={

    debugCalcu:function(){
        console.log('bspline  debug start')
        // console.log(this.resArrayX);
        // console.log(this.resArrayY);
        // console.log(this.length);
        // console.log(this.vertices);
        console.log('bspline  debug end')
        return 1;
    },

    GetCubicBSplineParam:function(x0,x1,x2,x3,t)
    {
        x0=parseFloat(x0);
        x1=parseFloat(x1);
        x2=parseFloat(x2);
        x3=parseFloat(x3);
        var  A0 = (x0+(4*x1)+x2)/6;
        var  A1 = -(x0-x2)/2;
        var  A2 = (x0-(2*x1)+x2)/2;
        var  A3 = -(x0-(3*x1)+(3*x2)-x3)/6;
        //console.log(A0);
        return A0+A1*t+A2*t*t+A3*t*t*t;
    },

    CalcuBSplineCurve:function(){
        this.resArrayX=new Array()
        this.resArrayY=new Array()
        var index=0;
        for (var t=0;t<=1;t+=this.optInterval)
        {
            if(t+this.optInterval>1){
                t=1;
            }

            this.resArrayX[index]=this.GetCubicBSplineParam(this.p0.x,this.p1.x,this.p2.x,this.p3.x,t);
            this.resArrayY[index]=this.GetCubicBSplineParam(this.p0.y,this.p1.y,this.p2.y,this.p3.y,t);

            index++;
        }
        this.length=index;
        return index;
    },

    //curve point & p0 p1 p2 p3
    ConvertToVertices:function(){
        //console.log( this.resArrayX);

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