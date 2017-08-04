//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 5, 23, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->




var Line = function(startPoint,endPoint){
    this.startPoint=new Vector2(startPoint);
    this.endPoint=new Vector2(endPoint);

};

Line.prototype={

    /**
     * http://wiki.processing.org/w/Line-Line_intersection
     */
    intersectionPoint: function (l) {
        var sx = this.endPoint.x -  this.startPoint.x;
        var sy = this.endPoint.y -  this.startPoint.y;
        var dx = l.endPoint.x - l.startPoint.x;
        var dy = l.endPoint.y - l.startPoint.y;
        var cross = sx * dy - sy * dx;
        if (cross === 0) {
            return null;
        } else {
            var cx = l.startPoint.x - this.startPoint.x;
            var cy = l.startPoint.y - this.startPoint.y;
            var t = (cx * dy - cy * dx) / cross;
            if (t < 0 || t > 1) {
                return null;
            }
            var u = (cx * sy - cy * sx) / cross;
            if (u < 0 || u > 1) {
                return null;
            }
            return new Vector2(this.startPoint.x + t * sx, this.startPoint.y + t * sy);
        }
    },
    length: function () {
        return this.startPoint.distance(this.endPoint);
    }

};