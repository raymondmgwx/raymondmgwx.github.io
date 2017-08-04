//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 6, 17, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->




var NURBSCurve = function(degree, knots /* array of reals */, controlPoints /* array of Vector(2|3|4) */, startKnot /* index in knots */, endKnot /* index in knots */ ){

    this.utils=new NURBSUtils();
    this.degree = degree;
    this.knots = knots;
    this.controlPoints = [];
    // Used by periodic NURBS to remove hidden spans
    this.startKnot = startKnot || 0;
    this.endKnot = endKnot || ( this.knots.length - 1 );
    for ( var i = 0; i < controlPoints.length; ++ i ) {

        // ensure Vector4 for control points
        var point = controlPoints[ i ];
        this.controlPoints[ i ] = new Vector4( point.x, point.y, point.z, point.w );

    }

};


NURBSCurve.prototype= {
    getPoint : function ( t ) {

        var u = this.knots[ this.startKnot ] + t * ( this.knots[ this.endKnot ] - this.knots[ this.startKnot ] ); // linear mapping t->u

        // following results in (wx, wy, wz, w) homogeneous point
        var hpoint = this.utils.calcBSplinePoint( this.degree, this.knots, this.controlPoints, u );

        return hpoint.Dehomogenize();

    },

    getPoints: function ( divisions ) {

        if ( divisions === undefined ) divisions = 5;

        var points = [];

        var verticesInfo=[];

        for ( var d = 0; d <= divisions; d ++ ) {

            points.push( this.getPoint( d / divisions ) );
            verticesInfo.push( this.getPoint( d / divisions ).x );
            verticesInfo.push( this.getPoint( d / divisions ).y );
            verticesInfo.push( this.getPoint( d / divisions ).z );
        }

        this.verticesInfo=verticesInfo;
        return points;

    },

    getTangent : function ( t ) {

        var u = this.knots[ 0 ] + t * ( this.knots[ this.knots.length - 1 ] - this.knots[ 0 ] );
        var ders = this.utils.calcNURBSDerivatives( this.degree, this.knots, this.controlPoints, u, 1 );
        var tangent = ders[ 1 ].clone();
        tangent.normalize();
    
        return tangent;

    },
    ConvertToVertices:function(){
       return  this.verticesInfo;
    }


};

