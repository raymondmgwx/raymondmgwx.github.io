//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 5, 09, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->




var Point = function(x,y){
	
	if (x && typeof x === 'object' && x.hasOwnProperty('x')&& x.hasOwnProperty('y')) {
		this.x=x.x;
		this.y=x.y;
		this.elements=new Float32Array([x.x,x.y]);
	}else
	{
			this.x=x||0;
			this.y=y||0;
			this.elements=new Float32Array([x,y]);
	}
};

Point.prototype={
	
	clone:function(){
		return new Point(this.x,this.y);
	},
	
	set: function ( x, y ) {  
  
        this.x = x;  
        this.y = y;  
  
        return this;   
  
    },  
  
    setX: function ( x ) {  
  
        this.x = x;  
  
        return this;   
  
    },  

    setY: function ( y ) {  
  
        this.y = y;  
  
        return this;    
  
    },  
    
	copy: function ( v ) {  
  
        this.x = v.x;  
        this.y = v.y;   
  
        return this;    
  
    },  
	
	zero:function(){
		
		this.x=0;
		this.y=0;
		this.z=0;
		
		return this;
	},
	addPoint:function(a,b){
		this.x=a.x+b.x;
		this.y=a.y+b.y;
		return this;
	},
	subPoint:function(a,b){
		this.x=a.x-b.x;
		this.y=a.y-b.y;
		return this;
	},

	pointMag:function(){
		return Math.sqrt(this.x*this.x+this.y*this.y);
	},

	normalize : function() {

		var g = Math.sqrt(this.x*this.x+this.y*this.y);
		if(g){
			if(g == 1)
				return this;
		} else {
			this.x=0;
			this.y=0;
			return this;
		}
		g = 1/g;
		this.x *= g;
		this.y *= g;

		return this;
	},

	multiScalar:function(p,s){
		this.x=p.x*s;
		this.y=p.y*s;
		return this
	}
};