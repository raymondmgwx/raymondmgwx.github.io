var expect = chai.expect;

describe('Bezier Surface Function Test', function() {
	
  it('Debug BezierSurface(nNum,mNum,pointArray,optInterval)', function() {

	  var bSurface=new BezierSurface(new Vector3(-1,0,-1), 0.5, 0.5, 20, 20);
	  expect(bSurface.DebugBezierSurface()).to.be.equal(1);
  });
 
});

describe('Bezier Function Test', function() {
	
  it('Debug BezierCurve(p0,p1,p2,p3,optInterval)', function() {
	var p0=new Point(15,20);
	var p1=new Point(35,20);
	var p2=new Point(75,30);
	var p3=new Point(85,70);
	var bCurve=new BezierCurve(p0,p1,p2,p3);
	bCurve.CalcuBezierCurve();
	bCurve.ConvertToVertices();
    expect(bCurve.debugCalcu()).to.be.equal(1);
  });
 
});


describe('Matrix4x4 Function Test', function() {

	it('Matrix4x4()==Matrix4x4().zero()', function() {
		var newMatrix4x4=new Matrix4x4();
		expect(newMatrix4x4.elements[0][0]).to.be.equal(0);
		expect(newMatrix4x4.elements[1][0]).to.be.equal(0);
		expect(newMatrix4x4.elements[2][0]).to.be.equal(0);
		expect(newMatrix4x4.elements[3][0]).to.be.equal(0);
		expect(newMatrix4x4.elements[0][1]).to.be.equal(0);
		expect(newMatrix4x4.elements[1][1]).to.be.equal(0);
		expect(newMatrix4x4.elements[2][1]).to.be.equal(0);
		expect(newMatrix4x4.elements[3][1]).to.be.equal(0);
		expect(newMatrix4x4.elements[0][2]).to.be.equal(0);
		expect(newMatrix4x4.elements[1][2]).to.be.equal(0);
		expect(newMatrix4x4.elements[2][2]).to.be.equal(0);
		expect(newMatrix4x4.elements[3][2]).to.be.equal(0);
		expect(newMatrix4x4.elements[0][3]).to.be.equal(0);
		expect(newMatrix4x4.elements[1][3]).to.be.equal(0);
		expect(newMatrix4x4.elements[2][3]).to.be.equal(0);
		expect(newMatrix4x4.elements[3][3]).to.be.equal(0);
	});

	it('Matrix4x4().clone()==Matrix4x4().zero()', function() {
		var newMatrix4x4=new Matrix4x4();
		expect(newMatrix4x4.clone().elements[0][0]).to.be.equal(0);
		expect(newMatrix4x4.clone().elements[0][1]).to.be.equal(0);
		expect(newMatrix4x4.clone().elements[0][2]).to.be.equal(0);
		expect(newMatrix4x4.clone().elements[0][3]).to.be.equal(0);
		expect(newMatrix4x4.clone().elements[1][0]).to.be.equal(0);
		expect(newMatrix4x4.clone().elements[1][1]).to.be.equal(0);
		expect(newMatrix4x4.clone().elements[1][2]).to.be.equal(0);
		expect(newMatrix4x4.clone().elements[1][3]).to.be.equal(0);
		expect(newMatrix4x4.clone().elements[2][0]).to.be.equal(0);
		expect(newMatrix4x4.clone().elements[2][1]).to.be.equal(0);
		expect(newMatrix4x4.clone().elements[2][2]).to.be.equal(0);
		expect(newMatrix4x4.clone().elements[2][3]).to.be.equal(0);
		expect(newMatrix4x4.clone().elements[3][0]).to.be.equal(0);
		expect(newMatrix4x4.clone().elements[3][1]).to.be.equal(0);
		expect(newMatrix4x4.clone().elements[3][2]).to.be.equal(0);
		expect(newMatrix4x4.clone().elements[3][3]).to.be.equal(0);
	});

	it('Matrix4x4().identity()', function() {
		var newMatrix4x4=new Matrix4x4().identity();
		expect(newMatrix4x4.elements[0][0]).to.be.equal(1);
		expect(newMatrix4x4.elements[1][0]).to.be.equal(0);
		expect(newMatrix4x4.elements[2][0]).to.be.equal(0);
		expect(newMatrix4x4.elements[3][0]).to.be.equal(0);
		expect(newMatrix4x4.elements[0][1]).to.be.equal(0);
		expect(newMatrix4x4.elements[1][1]).to.be.equal(1);
		expect(newMatrix4x4.elements[2][1]).to.be.equal(0);
		expect(newMatrix4x4.elements[3][1]).to.be.equal(0);
		expect(newMatrix4x4.elements[0][2]).to.be.equal(0);
		expect(newMatrix4x4.elements[1][2]).to.be.equal(0);
		expect(newMatrix4x4.elements[2][2]).to.be.equal(1);
		expect(newMatrix4x4.elements[3][2]).to.be.equal(0);
		expect(newMatrix4x4.elements[0][3]).to.be.equal(0);
		expect(newMatrix4x4.elements[1][3]).to.be.equal(0);
		expect(newMatrix4x4.elements[2][3]).to.be.equal(0);
		expect(newMatrix4x4.elements[3][3]).to.be.equal(1);
	});

	it('Matrix4x4().setTranslate(x,y,z)', function() {
		var newMatrix4x4=new Matrix4x4().setTranslate(3,5,7);
		expect(newMatrix4x4.elements[0][0]).to.be.equal(1);
		expect(newMatrix4x4.elements[1][0]).to.be.equal(0);
		expect(newMatrix4x4.elements[2][0]).to.be.equal(0);
		expect(newMatrix4x4.elements[3][0]).to.be.equal(0);
		expect(newMatrix4x4.elements[0][1]).to.be.equal(0);
		expect(newMatrix4x4.elements[1][1]).to.be.equal(1);
		expect(newMatrix4x4.elements[2][1]).to.be.equal(0);
		expect(newMatrix4x4.elements[3][1]).to.be.equal(0);
		expect(newMatrix4x4.elements[0][2]).to.be.equal(0);
		expect(newMatrix4x4.elements[1][2]).to.be.equal(0);
		expect(newMatrix4x4.elements[2][2]).to.be.equal(1);
		expect(newMatrix4x4.elements[3][2]).to.be.equal(0);
		expect(newMatrix4x4.elements[0][3]).to.be.equal(3);
		expect(newMatrix4x4.elements[1][3]).to.be.equal(5);
		expect(newMatrix4x4.elements[2][3]).to.be.equal(7);
		expect(newMatrix4x4.elements[3][3]).to.be.equal(1);
	});


	it('Matrix4x4().setRotate(angle,x,y,z)', function() {
		var angle=30;
		var x=6;
		var y=7;
		var z=4;
		var newMatrix4x4=new Matrix4x4().setRotate(angle,x,y,z);
		angle = Math.PI * angle / 180;
		var s = Math.sin(angle);
		var c = Math.cos(angle);
		var len = Math.sqrt(x*x + y*y + z*z);
		if (len !== 1) {
			var rlen = 1 / len;
			x *= rlen;
			y *= rlen;
			z *= rlen;
		}
		var nc = 1 - c;
		var xy = x * y;
		var yz = y * z;
		var zx = z * x;
		var xs = x * s;
		var ys = y * s;
		var zs = z * s;
		expect(newMatrix4x4.elements[0][0]).to.be.equal(x*x*nc +  c);
		expect(newMatrix4x4.elements[1][0]).to.be.equal(xy *nc + zs);
		expect(newMatrix4x4.elements[2][0]).to.be.equal(zx *nc - ys);
		expect(newMatrix4x4.elements[3][0]).to.be.equal(0);
		expect(newMatrix4x4.elements[0][1]).to.be.equal(xy *nc - zs);
		expect(newMatrix4x4.elements[1][1]).to.be.equal(y*y*nc +  c);
		expect(newMatrix4x4.elements[2][1]).to.be.equal(yz *nc + xs);
		expect(newMatrix4x4.elements[3][1]).to.be.equal(0);
		expect(newMatrix4x4.elements[0][2]).to.be.equal(zx *nc + ys);
		expect(newMatrix4x4.elements[1][2]).to.be.equal(yz *nc - xs);
		expect(newMatrix4x4.elements[2][2]).to.be.equal(z*z*nc +  c);
		expect(newMatrix4x4.elements[3][2]).to.be.equal(0);
		expect(newMatrix4x4.elements[0][3]).to.be.equal(0);
		expect(newMatrix4x4.elements[1][3]).to.be.equal(0);
		expect(newMatrix4x4.elements[2][3]).to.be.equal(0);
		expect(newMatrix4x4.elements[3][3]).to.be.equal(1);
	});
});

describe('Vector4 Function Test', function() {
	it('Vector4(x,y,z,w).Dehomogenize()==new Vector3(this.x/w,this.y/w, this.z/w)', function() {
		expect(new Vector4(1,2,3,4).Dehomogenize().x).to.be.equal(new Vector3(1/4,2/4,3/4).x);
		expect(new Vector4(1,2,3,4).Dehomogenize().y).to.be.equal(new Vector3(1/4,2/4,3/4).y);
		expect(new Vector4(1,2,3,4).Dehomogenize().z).to.be.equal(new Vector3(1/4,2/4,3/4).z);
	});


});

describe('Vector3 Function Test', function() {
  it('Vector3(x,y,z).clone()==Vector3(x,y,z)', function() {
    expect(new Vector3(1,2,3).clone().x).to.be.equal(new Vector3(1,2,3).x);
	 expect(new Vector3(1,2,3).clone().y).to.be.equal(new Vector3(1,2,3).y);
	  expect(new Vector3(1,2,3).clone().z).to.be.equal(new Vector3(1,2,3).z);
  });
  
  it('Vector3(x,y,z).copy(Vector3(x1,y1,z1))==Vector3(x1,y1,z1)', function() {
    expect(new Vector3(1,2,3).copy(new Vector3(12,23,34)).x).to.be.equal(12);
	 expect(new Vector3(1,2,3).copy(new Vector3(12,23,34)).y).to.be.equal(23);
	  expect(new Vector3(1,2,3).copy(new Vector3(12,23,34)).z).to.be.equal(34);
  });
  
  it('Vector3(x,y,z).zero()==Vector3(0,0,0)', function() {
    expect(new Vector3(1,2,3).zero().x).to.be.equal(0);
	 expect(new Vector3(1,2,3).zero().y).to.be.equal(0);
	  expect(new Vector3(1,2,3).zero().z).to.be.equal(0);
  });
  
   it('Vector3(x,y,z).normalize()==Vector3(x/g,y/g,z/g)', function() {
	   	var v = new Vector3(1,2,3);
		var g = Math.sqrt(v.x*v.x+v.y*v.y+v.z*v.z);
		g=1/g;
		expect(v.clone().normalize().x).to.be.equal(v.x*g);
		expect(v.clone().normalize().y).to.be.equal(v.y*g);
		expect(v.clone().normalize().z).to.be.equal(v.z*g);
  });
   
   it('Vector3().addScalar(v,s)==Vector3(x+s,y+s,z+s)', function() {
		var v = new Vector3();
	    var k=new Vector3(1,3,45);
		var s=44;
		expect(v.addScalar(k,s).x).to.be.equal(k.x+s);
		expect(v.addScalar(k,s).y).to.be.equal(k.y+s);
		expect(v.addScalar(k,s).z).to.be.equal(k.z+s);
  });
  
   it('Vector3().addVector(v,vn)==Vector3(x+vx,y+vy,z+vz)', function() {
		var v = new Vector3(1,2,3);
		var vn= new Vector3(13,21,35);
		expect(new Vector3().addVector(vn,v).x).to.be.equal(v.x+vn.x);
		expect(new Vector3().addVector(vn,v).y).to.be.equal(v.y+vn.y);
		expect(new Vector3().addVector(vn,v).z).to.be.equal(v.z+vn.z);
  });
  
    it('Vector3().subScalar(v,s)==Vector3(x-s,y-s,z-s)', function() {
		var v = new Vector3();
		var k=new Vector3(1,3,45);
		var s=44;
		expect(v.subScalar(k,s).x).to.be.equal(k.x-s);
		expect(v.subScalar(k,s).y).to.be.equal(k.y-s);
		expect(v.subScalar(k,s).z).to.be.equal(k.z-s);
  });
  
   it('Vector3().subVector(v,vn)==Vector3(x-vx,y-vy,z-vz)', function() {
		var v = new Vector3(1,2,3);
		var vn= new Vector3(13,21,35);
		expect(v.clone().subVector(v,vn).x).to.be.equal(v.x-vn.x);
		expect(v.clone().subVector(v,vn).y).to.be.equal(v.y-vn.y);
		expect(v.clone().subVector(v,vn).z).to.be.equal(v.z-vn.z);
  });
  
    it('Vector3().multiplyScalar(v,s)==Vector3(x*s,y*s,z*s)', function() {
		var v = new Vector3();
		var vn= new Vector3(13,21,35);
		var s=44;
		expect(v.multiplyScalar(vn,s).x).to.be.equal(vn.x*s);
		expect(v.multiplyScalar(vn,s).y).to.be.equal(vn.y*s);
		expect(v.multiplyScalar(vn,s).z).to.be.equal(vn.z*s);
  });
  
   it('Vector3().multiplyVector(v,vn)==Vector3(x*vx,y*vy,z*vz)', function() {
		var v = new Vector3(1,2,3);
		var vn= new Vector3(13,21,35);
		expect(new Vector3().multiplyVector(v,vn).x).to.be.equal(v.x*vn.x);
		expect(new Vector3().multiplyVector(v,vn).y).to.be.equal(v.y*vn.y);
		expect(new Vector3().multiplyVector(v,vn).z).to.be.equal(v.z*vn.z);
  });
  
  it('Vector3().divideScalar(v,s)==Vector3(x/s,y/s,z/s)', function() {
		var v = new Vector3(1,2,3);
		var s=44;
		expect(new Vector3().divideScalar(v,s).x).to.be.equal(v.x/s);
		expect(new Vector3().divideScalar(v,s).y).to.be.equal(v.y/s);
		expect(new Vector3().divideScalar(v,s).z).to.be.equal(v.z/s);
  });
  
  it('Vector3(x,y,z).dot(vn)==x*vx+y*vy+z*vz', function() {
		var v = new Vector3(1,2,3);
        var vn = new Vector3(31,42,13);
		expect(v.clone().dot(vn)).to.be.equal(v.x*vn.x+v.y*vn.y+v.z*vn.z);
  });
  
  it('Vector3().cross(a,b)==Vector3(ay*bz-az*by,az*bx-ax*bz,ax*by-ay*bx)', function() {
		var a = new Vector3(1,2,3);
        var b = new Vector3(31,42,13);
		expect(new Vector3().cross(a,b).x).to.be.equal(new Vector3(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x).x);
		expect(new Vector3().cross(a,b).y).to.be.equal(new Vector3(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x).y);
		expect(new Vector3().cross(a,b).z).to.be.equal(new Vector3(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x).z);
  });
  
   it('Vector3(x,y,z).vectorMag()==g', function() {
	   	var v = new Vector3(1,2,3);
		var g = Math.sqrt(v.x*v.x+v.y*v.y+v.z*v.z);
	
		expect(v.clone().vectorMag()).to.be.equal(g);
		
  });
  
  it('Vector3(x,y,z).distance(vn)==g', function() {
	   	var v = new Vector3(1,2,3);
		var vn = new Vector3(13,21,-3);
		
		var g = Math.sqrt((v.x-vn.x)*(v.x-vn.x)+(v.y-vn.y)*(v.y-vn.y)+(v.z-vn.z)*(v.z-vn.z));
	
		expect(v.clone().distance(vn)).to.be.equal(g);
		
  });
  
});


describe('Point Function Test', function() {
	
  it('Point(x,y).clone()==Point(x,y)', function() {
    expect(new Point(1,2).clone().x).to.be.equal(new Point(1,2,3).x);
	 expect(new Point(1,2).clone().y).to.be.equal(new Point(1,2,3).y);
  });
  
  it('Point(x,y).copy(Point(x1,y1))==Point(x1,y1)', function() {
    expect(new Point(1,2).copy(new Point(12,23)).x).to.be.equal(12);
	 expect(new Point(1,2).copy(new Point(12,23)).y).to.be.equal(23);
  });
  
  it('Point(x,y).zero()==Point(0,0)', function() {
    expect(new Point(1,2).zero().x).to.be.equal(0);
	 expect(new Point(1,2).zero().y).to.be.equal(0);
  });

	it('Point(x,y).subPoint(a,b)==Point(a.x-b.x,a.y-b.y)', function() {
		expect(new Point().subPoint(new Point(1,4),new Point(6,4)).x).to.be.equal(-5);
		expect(new Point().subPoint(new Point(1,4),new Point(6,4)).y).to.be.equal(0);
	});
	it('Point(x,y).pointMag()==Math.sqrt(x*x+y*y)', function() {
		expect(new Point(3,4).pointMag()).to.be.equal(5);
	});
	it('Point(x,y).normalize()==Point(x/Math.sqrt(x*x+this.y*this.y),y/Math.sqrt(x*x+this.y*this.y))', function() {
		var p=new Point(5,2);
		var g=Math.sqrt(p.x*p.x+p.y*p.y);
		g = 1/g;
		expect(p.clone().normalize().x).to.be.equal(p.x*g);
		expect(p.clone().normalize().y).to.be.equal(p.y*g);
	});
	it('Point(x,y).multiScalar(p,s)==Point(0,0)', function() {
		expect(new Point().multiScalar(new Point(3,6),3).x).to.be.equal(9);
		expect(new Point().multiScalar(new Point(3,6),3).y).to.be.equal(18);
	});

});


