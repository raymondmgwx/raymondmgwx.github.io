//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 4, 27, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->




var Vector3 = function(x,y,z){
	this.x=x||0;
	this.y=y||0;
	this.z=z||0;
};

Vector3.prototype={
	
	clone:function(){
		return new Vector3(this.x,this.y,this.z);
	},
	
	set: function ( x, y, z ) {  
  
        this.x = x;  
        this.y = y;  
        this.z = z;  
  
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

    setZ: function ( z ) {  
  
        this.z = z;  
  
        return this;    
  
    },  
    
	copy: function ( v ) {  
  
        this.x = v.x;  
        this.y = v.y;  
        this.z = v.z;  
  
        return this;    
  
    },  
	
	zero:function(){
		
		this.x=0;
		this.y=0;
		this.z=0;
		
		return this;
	},
	
	normalize : function() {
		
		var g = Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
		if(g){
		if(g == 1)
			return this;
		} else {
			this.x=0;
			this.y=0;
			this.z=0;
			return this;
		}
		g = 1/g;
		this.x *= g;
		this.y *= g;
		this.z *= g;
		
		return this;
	},
	
	addScalar:function(v,s){
		
		this.x = v.x + s;
		this.y = v.y + s;
		this.z = v.z + s;
		
		return this;
	},
	
	addVector:function(a,b){
		this.x = a.x + b.x;  
        this.y = a.y + b.y;  
        this.z = a.z + b.z;  
		
		return this;
	},
	
	subScalar:function(v,s){
		
		this.x =v.x-s;
		this.y =v.y-s;
		this.z =v.z-s;
		
		return this;
	},
	
	subVector:function(a,b){

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;

		return this;
	},
	
	multiplyScalar:function(v,s){
		
		this.x =v.x*s;
		this.y =v.y*s;
		this.z =v.z*s;
		
		return this;
	},
	
	multiplyVector:function(a,b){

		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;

		return this;
	},
	
	//??
	divideScalar:function(v,s){
		
		if(s!=0){
			
			this.x = v.x/s;
			this.y = v.y/s;
			this.z = v.z/s;
		}
		else{
			this.x=0;
			this.y=0;
			this.z=0;
		}
		
		return this;
	},
	
	dot:function(v){
		return this.x * v.x + this.y * v.y + this.z * v.z;
	},
	
	cross:function(a,b){
		
		var ax = a.x, ay = a.y, az = a.z;
        var bx = b.x, by = b.y, bz = b.z;
  
        this.x = ay * bz - az * by;  
        this.y = az * bx - ax * bz;  
        this.z = ax * by - ay * bx;  
  
        return this;
	},
	
	vectorMag:function(){
		return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
	},
	
	distance:function(v){
		var dx=this.x-v.x;
		var dy=this.y-v.y;
		var dz=this.z-v.z;
		return Math.sqrt(dx*dx+dy*dy+dz*dz);
	}

};
