//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 5, 22, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->\

var canvas = document.getElementById('canvas2d');
var ctx2d = canvas.getContext("2d");

//param
var lights=[];
var toRad = Math.PI / 180;
var radius = 1000;
var Mouse =new Vector2(canvas.width/2 * canvas.width/canvas.clientWidth,canvas.height/2 * canvas.height/canvas.clientHeight);
var foreground = new Image();

/*canvas.onmousemove = function(event){
    var location = getLocation(event.clientX, event.clientY);
    Mouse.x = location.x;
    Mouse.y = location.y;
    updateCanvas = true;
};*/

var segments = [

    // Border
    {a:{x:0,y:0}, b:{x:640,y:0}},
    {a:{x:640,y:0}, b:{x:640,y:360}},
    {a:{x:640,y:360}, b:{x:0,y:360}},
    {a:{x:0,y:360}, b:{x:0,y:0}},

    // Polygon #1
    {a:{x:100,y:150}, b:{x:120,y:50}},
    {a:{x:120,y:50}, b:{x:200,y:80}},
    {a:{x:200,y:80}, b:{x:140,y:210}},
    {a:{x:140,y:210}, b:{x:100,y:150}},

    // Polygon #2
    {a:{x:100,y:200}, b:{x:120,y:250}},
    {a:{x:120,y:250}, b:{x:60,y:300}},
    {a:{x:60,y:300}, b:{x:100,y:200}},

    // Polygon #3
    {a:{x:200,y:260}, b:{x:220,y:150}},
    {a:{x:220,y:150}, b:{x:300,y:200}},
    {a:{x:300,y:200}, b:{x:350,y:320}},
    {a:{x:350,y:320}, b:{x:200,y:260}},

    // Polygon #4
    {a:{x:340,y:60}, b:{x:360,y:40}},
    {a:{x:360,y:40}, b:{x:370,y:70}},
    {a:{x:370,y:70}, b:{x:340,y:60}},

    // Polygon #5
    {a:{x:450,y:190}, b:{x:560,y:170}},
    {a:{x:560,y:170}, b:{x:540,y:270}},
    {a:{x:540,y:270}, b:{x:430,y:290}},
    {a:{x:430,y:290}, b:{x:450,y:190}},

    // Polygon #6
    {a:{x:400,y:95}, b:{x:580,y:50}},
    {a:{x:580,y:50}, b:{x:480,y:150}},
    {a:{x:480,y:150}, b:{x:400,y:95}}

];

function getSightPolygon(sightX,sightY){

    var points = (function(segments){
        var a = [];
        segments.forEach(function(seg){
            a.push(seg.a,seg.b);
        });
        return a;
    })(segments);

    var uniquePoints = (function(points){
        var set = {};
        return points.filter(function(p){
            var key = p.x+","+p.y;
            if(key in set){
                return false;
            }else{
                set[key]=true;
                return true;
            }
        });
    })(points);

    var uniqueAngles = [];
    for(var j=0;j<uniquePoints.length;j++){
        var uniquePoint = uniquePoints[j];
        var angle = Math.atan2(uniquePoint.y-sightY,uniquePoint.x-sightX);
        uniquePoint.angle = angle;
        uniqueAngles.push(angle-0.00001,angle,angle+0.00001);
    }

    var intersects = [];
    for(var j=0;j<uniqueAngles.length;j++){
        var angle = uniqueAngles[j];

        var dx = Math.cos(angle);
        var dy = Math.sin(angle);

        var ray = {
            a:{x:sightX,y:sightY},
            b:{x:sightX+dx,y:sightY+dy}
        };

        var closestIntersect = null;
        for(var i=0;i<segments.length;i++){
            var intersect = getIntersection(ray,segments[i]);
            if(!intersect) continue;
            if(!closestIntersect || intersect.param<closestIntersect.param){
                closestIntersect=intersect;
            }
        }

        if(!closestIntersect) continue;
        closestIntersect.angle = angle;
        intersects.push(closestIntersect);

    }

    intersects = intersects.sort(function(a,b){
        return a.angle-b.angle;
    });

    return intersects;

}

function getLocation(x, y) {
    var bClientRect = canvas.getBoundingClientRect();
    return {
        x: (x - bClientRect.left) * (canvas.width / bClientRect.width),
        y: (y - bClientRect.top) * (canvas.height / bClientRect.height)
    };
}

function drawPolygon(polygon,ctx2d,fillStyle){
    ctx2d.fillStyle = fillStyle;
    ctx2d.beginPath();
    ctx2d.moveTo(polygon[0].x,polygon[0].y);
    for(var i=1;i<polygon.length;i++){
        var intersect = polygon[i];
        ctx2d.lineTo(intersect.x,intersect.y);
    }
    ctx2d.fill();
}


function getIntersection(ray,segment){

    var r_px = ray.a.x;
    var r_py = ray.a.y;
    var r_dx = ray.b.x-ray.a.x;
    var r_dy = ray.b.y-ray.a.y;

    var s_px = segment.a.x;
    var s_py = segment.a.y;
    var s_dx = segment.b.x-segment.a.x;
    var s_dy = segment.b.y-segment.a.y;

    var r_mag = Math.sqrt(r_dx*r_dx+r_dy*r_dy);
    var s_mag = Math.sqrt(s_dx*s_dx+s_dy*s_dy);

    //parallel
    if(r_dx/r_mag==s_dx/s_mag && r_dy/r_mag==s_dy/s_mag){
        return null;
    }

    var T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);
    var T1 = (s_px+s_dx*T2-r_px)/r_dx;

    if(T1<0) return null;
    if(T2<0 || T2>1) return null;

    return {
        x: r_px+r_dx*T1,
        y: r_py+r_dy*T1,
        param: T1
    };

}



function setupLight () {
    for (var i = 0; i < 360; ++i) {
        var line = new Line(new Vector2(10,10),new Vector2(10 + Math.cos(i * toRad) * radius,10 + Math.sin(i * toRad) * radius ));
        lights.push(line);
    }
}


function handleMouseMove(event) {
    var location = getLocation(event.clientX, event.clientY);
    Mouse.x = location.x;
    Mouse.y = location.y;
    updateCanvas = true;
}

function setupEvents (){

        canvas.addEventListener('mousemove', handleMouseMove);

}

function moveLight(vec) {
    var i,
        len = lights.length,
        line;

    for (i = 0; i < len; ++i) {
        line = lights[i];
        line.startPoint.copy(vec);
        line.endPoint.set(
            vec.x + Math.cos(i * toRad) * radius*0.0001,
            vec.y + Math.sin(i * toRad) * radius*0.0001
        );
    }
}


function drawDimLight() {
    var gradient = ctx2d.createRadialGradient(
        Mouse.x,
        Mouse.y,
        0,
        Mouse.x,
        Mouse.y,
        canvas.width/5
    );
    gradient.addColorStop(0, '#FF0000');
    //gradient.addColorStop(.5, 'transparent');
    gradient.addColorStop(1, 'transparent');
    ctx2d.fillStyle = gradient;
    ctx2d.fillRect(0, 0, canvas.width, canvas.height);

}

function drawPolygon (verts) {
    var i,
        len = verts.length;

    if (len >= 3) {
        ctx2d.beginPath();
        ctx2d.moveTo(verts[0].x, verts[0].y);
        for (i = 1; i < len; ++i) {
            ctx2d.lineTo(verts[i].x, verts[i].y);
        }
        ctx2d.fill();
        ctx2d.closePath();
    }
}

function drawLight () {
    var i,
        len = lights.length,
        verts = [],
        line,
        a;

    drawDimLight();
    var gradient = ctx2d.createRadialGradient(
        Mouse.x,
        Mouse.y,
        5,
        Mouse.x,
        Mouse.y,
        radius / 2
    );
    gradient.addColorStop(1, '#fff');
    gradient.addColorStop(.5, 'transparent');
    gradient.addColorStop(1, 'transparent');

    ctx2d.globalCompositeOperation = "source-in";
    ctx2d.drawImage(foreground,0,0,canvas.width, canvas.height);
    ctx2d.globalCompositeOperation = "source-over";

    ctx2d.fillStyle = gradient;
    for (i = 0; i < len; ++i) {
        line = lights[i];
        verts.push(line.endPoint);
        if (line.length() < radius) {
            ctx2d.fillRect(line.endPoint.x - 1, line.endPoint.y - 1, 1, 1);
        }
    }
    //drawPolygon(verts);
    verts = null;
}

function draw(){

    ctx2d.clearRect(0,0,canvas.width,canvas.height);



    moveLight(Mouse);

    drawLight();



    /*var fuzzyRadius = 10;
    var polygons = [getSightPolygon(Mouse.x,Mouse.y)];
    for(var angle=0;angle<Math.PI*2;angle+=(Math.PI*2)/10){
        var dx = Math.cos(angle)*fuzzyRadius;
        var dy = Math.sin(angle)*fuzzyRadius;
        polygons.push(getSightPolygon(Mouse.x+dx,Mouse.y+dy));
    };

    for(var i=1;i<polygons.length;i++){
        drawPolygon(polygons[i],ctx2d,"rgba(255,255,255,0.2)");
    }
    drawPolygon(polygons[0],ctx2d,"#fff");

    ctx2d.fillStyle = "#dd3838";
    ctx2d.beginPath();
    ctx2d.arc(Mouse.x, Mouse.y, 2, 0, 2*Math.PI, false);
    ctx2d.fill();
    for(var angle=0;angle<Math.PI*2;angle+=(Math.PI*2)/10){
        var dx = Math.cos(angle)*fuzzyRadius;
        var dy = Math.sin(angle)*fuzzyRadius;
        ctx2d.beginPath();
        ctx2d.arc(Mouse.x+dx, Mouse.y+dy, 2, 0, 2*Math.PI, false);
        ctx2d.fill();
    }*/


}


window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
var updateCanvas = true;
function main(){

    requestAnimationFrame(main);
    if(updateCanvas){
        draw();
        updateCanvas = false;
    }
}
window.onload = function(){

    setupLight();
    setupEvents();

    foreground.onload = function(){
        main();
    };
    foreground.src = "../RayEngine/project/2DLightingDemo/City.jpg";
};

