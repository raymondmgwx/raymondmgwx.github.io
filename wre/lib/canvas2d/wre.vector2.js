//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 5, 23, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->




var Vector2 = function(x,y){

    if (x && typeof x === 'object' && x.hasOwnProperty('x')&& x.hasOwnProperty('y')) {
        this.x=x.x;
        this.y=x.y;
    }else
    {
        this.x=x||0;
        this.y=y||0;
    }
};

Vector2.prototype={

    clone:function(){
        return new Vector2(this.x,this.y);
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
    addVector2:function(a,b){
        this.x=a.x+b.x;
        this.y=a.y+b.y;
        return this;
    },
    subVector2:function(a,b){
        this.x=a.x-b.x;
        this.y=a.y-b.y;
        return this;
    },
    multiScalar:function(p,s){
        this.x=p.x*s;
        this.y=p.y*s;
        return this;
    },

    vector2Mag:function(){
        return Math.sqrt(this.x*this.x+this.y*this.y);
    },

    distance:function(vec2){
        if (!vec2) {
            return 0;
        }
        return Math.sqrt(
            (vec2.x - this.x) * (vec2.x - this.x) +
            (vec2.y - this.y) * (vec2.y - this.y)
        );
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
    }
};