//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 5, 14, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->




var Vector4 = function(x,y,z,w){
    this.x=x||0;
    this.y=y||0;
    this.z=z||0;
    this.w=w||0;
};


Vector4.prototype={
    clone:function(){
        return new Vector4(this.x,this.y,this.z,this.w);
    },

    set: function ( x, y, z, w ) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
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

    setW: function ( w ) {

        this.w = w;

        return this;

    },

    copy: function ( v ) {

        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
        return this;

    },

    zero:function(){

        this.x=0;
        this.y=0;
        this.z=0;
        this.w=0;
        return this;
    },


    addScalar:function(v,s){

        this.x = v.x + s;
        this.y = v.y + s;
        this.z = v.z + s;
        this.w = v.w + s;
        return this;
    },

    addVector:function(a,b){
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        this.w = a.w + b.w;
        return this;
    },

    subScalar:function(v,s){

        this.x =v.x-s;
        this.y =v.y-s;
        this.z =v.z-s;
        this.w =v.w-s;
        return this;
    },

    subVector:function(a,b){

        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        this.w = a.w - b.w;
        return this;
    },

    multiplyScalar:function(v,s){

        this.x =v.x*s;
        this.y =v.y*s;
        this.z =v.z*s;
        this.w =v.w*s;
        return this;
    },

    multiplyVector:function(a,b){

        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        this.w = a.w * b.w;
        return this;
    },

    divideScalar:function(v,s){

        if(s!=0){

            this.x = v.x/s;
            this.y = v.y/s;
            this.z = v.z/s;
            this.w = v.w/s;
        }
        else{
            this.x=0;
            this.y=0;
            this.z=0;
            this.w=0;
        }

        return this;
    },
    Dehomogenize:function(){
         var w = this.w;
          return new Vector3(this.x/w,this.y/w, this.z/w);
    }
}