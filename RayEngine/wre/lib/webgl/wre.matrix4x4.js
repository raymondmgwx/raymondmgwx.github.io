//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 5, 10, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->




var Matrix4x4 = function(opt_src){
  var s, d , e;
  if (opt_src && typeof opt_src === 'object' && opt_src.hasOwnProperty('elements')) {
    s = opt_src.elements;
    d = new Array(4);
    for (var i = 0; i < 4;i++) {
      d[i] = new Array(4);
	  for(var j=0;j<4;j++){
		  d[i][j]=s[i*4+j];
	  }
    }
    this.elements = d;
  } else {
		e = new Array(4);
		for (var i = 0; i < 4;i++) {
			e[i] = new Array(4);
		}	
		  e[0][0] = 0;   e[0][1] = 0;   e[0][2]  = 0;   e[0][3] = 0;
		  e[1][0] = 0;   e[1][1] = 0;   e[1][2]  = 0;   e[1][3] = 0;
		  e[2][0] = 0;   e[2][1] = 0;  　e[2][2]  = 0;   e[2][3] =　0;
		  e[3][0] = 0;   e[3][1] = 0;   e[3][2] 　= 0;   e[3][3] = 0;
		this.elements=e;
		//console.log(this.elements);
  }
};

Matrix4x4.prototype={
	
	clone:function(){
		return new Matrix4x4(this.elements);
	},
	
	set: function (elem) {   
        this.elements = elem;
		return this;
    },
	
	identity:function(){
		 var e = this.elements;
		  e[0][0] = 1;   e[0][1] = 0;   e[0][2]  = 0;   e[0][3] = 0;
		  e[1][0] = 0;   e[1][1] = 1;   e[1][2]  = 0;   e[1][3] = 0;
		  e[2][0] = 0;   e[2][1] = 0;  　e[2][2]  = 1;   e[2][3] =　0;
		  e[3][0] = 0;   e[3][1] = 0;   e[3][2] 　= 0;   e[3][3] = 1;
		  return this;
	},
	setTranslate : function(x, y, z) {
		  var e = this.elements;
		  e[0][0] = 1;  e[0][1] = 0;  e[0][2] = 0;  e[0][3] = x;
		  e[1][0] = 0;  e[1][1] = 1;  e[1][2] = 0;  e[1][3] = y;
		  e[2][0] = 0;  e[2][1] = 0;  e[2][2] = 1;  e[2][3] = z;
		  e[3][0] = 0;  e[3][1] = 0;  e[3][2] = 0;  e[3][3] = 1;
		  return this;
	},
    translate : function(x, y, z) {
		  var e = this.elements;
		  e[0][3] += e[0][0] * x + e[0][1] * y + e[0][2]  * z;
		  e[1][3] += e[1][0] * x + e[1][1] * y + e[1][2]  * z;
		  e[2][3] += e[2][0] * x + e[2][1] * y + e[2][2]  * z;
		  e[3][3] += e[3][0] * x + e[3][1] * y + e[3][2]  * z;
		  return this;
	},
	setRotate : function(angle, x, y, z) {
		  var e, s, c, len, rlen, nc, xy, yz, zx, xs, ys, zs;

		  angle = Math.PI * angle / 180;
		  e = this.elements;

		  s = Math.sin(angle);
		  c = Math.cos(angle);

		  if (0 !== x && 0 === y && 0 === z) {
			if (x < 0) {
			  s = -s;
			}
			e[0][0] = 1;  e[0][1] = 0;  e[0][2] = 0;  e[0][3] = 0;
			e[1][0] = 0;  e[1][1] = c;  e[1][2] =-s;  e[1][3] = 0;
			e[2][0] = 0;  e[2][1] = s;  e[2][2] = c;  e[2][3] = 0;
			e[3][0] = 0;  e[3][1] = 0;  e[3][2] = 0;  e[3][3] = 1;
		  } else if (0 === x && 0 !== y && 0 === z) {
			if (y < 0) {
			  s = -s;
			}
			e[0][0] = c;  e[0][1] = 0;  e[0][2] = s;  e[0][3] = 0;
			e[1][0] = 0;  e[1][1] = 1;  e[1][2] = 0;  e[1][3] = 0;
			e[2][0] =-s;  e[2][1] = 0;  e[2][2] = c;  e[2][3] = 0;
			e[3][0] = 0;  e[3][1] = 0;  e[3][2] = 0;  e[3][3] = 1;
		  } else if (0 === x && 0 === y && 0 !== z) {
			if (z < 0) {
			  s = -s;
			}
			e[0][0] = c;  e[0][1] =-s;  e[0][2] = 0;  e[0][3] = 0;
			e[1][0] = s;  e[1][1] = c;  e[1][2] = 0;  e[1][3] = 0;
			e[2][0] = 0;  e[2][1] = 0;  e[2][2] = 1;  e[2][3] = 0;
			e[3][0] = 0;  e[3][1] = 0;  e[3][2] = 0;  e[3][3] = 1;
		  } else {
			len = Math.sqrt(x*x + y*y + z*z);
			if (len !== 1) {
			  rlen = 1 / len;
			  x *= rlen;
			  y *= rlen;
			  z *= rlen;
			}
			nc = 1 - c;
			xy = x * y;
			yz = y * z;
			zx = z * x;
			xs = x * s;
			ys = y * s;
			zs = z * s;

			e[0][0] = x*x*nc +  c;
			e[1][0] = xy *nc + zs;
			e[2][0] = zx *nc - ys;
			e[3][0] = 0;

			e[0][1] = xy *nc - zs;
			e[1][1] = y*y*nc +  c;
			e[2][1] = yz *nc + xs;
			e[3][1] = 0;

			e[0][2] = zx *nc + ys;
			e[1][2] = yz *nc - xs;
			e[2][2] = z*z*nc +  c;
			e[3][2] = 0;

			e[0][3] = 0;
			e[1][3] = 0;
			e[2][3] = 0;
			e[3][3] = 1;
		  }

		  return this;
	},
	multiVector4:function(v4){
		var e = this.elements;
		var v = new Vector4();

		v.x = v4.x * e[0][0] + v4.y * e[0][1] + v4.z * e[0][2] + v4.w * e[0][3];
		v.y = v4.x * e[1][0] + v4.y * e[1][1] + v4.z * e[1][2] + v4.w * e[1][3];
		v.z = v4.x * e[2][0] + v4.y * e[2][1] + v4.z * e[2][2] + v4.w * e[2][3];
		v.w = v4.x * e[3][0] + v4.y * e[3][1] + v4.z * e[3][2] + v4.w * e[3][3];

		return v;
	},
	leftMultiply : function(mat) {
  
		// Calculate newMat =  oMat * curMat 
		var newMat = this.elements;
		var curMat = this.elements;
		var oMat   =  mat.elements;
  
		if (newMat === oMat) {
			oMat = new Array(4);
			for (var i = 0; i < 4;i++) {
				oMat[i] = new Array(4);
				for (var j = 0; j < 4;i++) {
					oMat[i][j] = newMat[i][j];
				}
			}
		}
		
		var curMatColVector0,curMatColVector1,curMatColVector2,curMatColVector3;
		for (i = 0; i < 4; i++) {
			curMatColVector0=curMat[i][0];  curMatColVector1=curMat[i][1];  curMatColVector2=curMat[i][2];  curMatColVector3=curMat[i][3];
			newMat[i][0]=oMat[0][0]*curMatColVector0+oMat[1][0]*curMatColVector1+oMat[2][0]*curMatColVector2+oMat[3][0]*curMatColVector3;
			newMat[i][1]=oMat[0][1]*curMatColVector0+oMat[1][1]*curMatColVector1+oMat[2][1]*curMatColVector2+oMat[3][1]*curMatColVector3;
			newMat[i][2]=oMat[0][2]*curMatColVector0+oMat[1][2]*curMatColVector1+oMat[2][2]*curMatColVector2+oMat[3][2]*curMatColVector3;
			newMat[i][3]=oMat[0][3]*curMatColVector0+oMat[1][3]*curMatColVector1+oMat[2][3]*curMatColVector2+oMat[3][3]*curMatColVector3;
		}
  
		return this;
	},
	setPerspective: function(fovy, aspect, near, far) {
		var e, rd, s, ct;

		  if (near === far || aspect === 0) {
			throw 'null frustum';
		  }
		  if (near <= 0) {
			throw 'near <= 0';
		  }
		  if (far <= 0) {
			throw 'far <= 0';
		  }

		  fovy = Math.PI * fovy / 180 / 2;
		  s = Math.sin(fovy);
		  if (s === 0) {
			throw 'null frustum';
		  }

		  rd = 1 / (far - near);
		  ct = Math.cos(fovy) / s;

		  e = this.elements;

		  e[0][0]  = ct / aspect;
		  e[1][0]  = 0;
		  e[2][0]  = 0;
		  e[3][0]  = 0;

		  e[0][1]  = 0;
		  e[1][1]  = ct;
		  e[2][1]  = 0;
		  e[3][1]  = 0;

		  e[0][2]  = 0;
		  e[1][2]  = 0;
		  e[2][2] = -(far + near) * rd;
		  e[3][2] = -1;

		  e[0][3] = 0;
		  e[1][3] = 0;
		  e[2][3] = -2 * near * far * rd;
		  e[3][3] = 0;

	  return this;
	},
	setLookAt : function(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
		  var e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;

		  fx = centerX - eyeX;
		  fy = centerY - eyeY;
		  fz = centerZ - eyeZ;

		  // Normalize f.
		  rlf = 1 / Math.sqrt(fx*fx + fy*fy + fz*fz);
		  fx *= rlf;
		  fy *= rlf;
		  fz *= rlf;

		  // Calculate cross product of f and up.
		  sx = fy * upZ - fz * upY;
		  sy = fz * upX - fx * upZ;
		  sz = fx * upY - fy * upX;

		  // Normalize s.
		  rls = 1 / Math.sqrt(sx*sx + sy*sy + sz*sz);
		  sx *= rls;
		  sy *= rls;
		  sz *= rls;

		  // Calculate cross product of s and f.
		  ux = sy * fz - sz * fy;
		  uy = sz * fx - sx * fz;
		  uz = sx * fy - sy * fx;

		  e = this.elements;
		  e[0][0] = sx;
		  e[1][0] = ux;
		  e[2][0] = -fx;
		  e[3][0] = 0;

		  e[0][1] = sy;
		  e[1][1]  = uy;
		  e[2][1]  = -fy;
		  e[3][1]  = 0;

		  e[0][2]  = sz;
		  e[1][2] = uz;
		  e[2][2] = -fz;
		  e[3][2] = 0;

		  e[0][3] = 0;
		  e[1][3]  = 0;
		  e[2][3]  = 0;
		  e[3][3]  = 1;

		  return this.translate(-eyeX, -eyeY, -eyeZ);
	},
	setInverseOf : function(other) {
		var i,j, s, d, inv, det;

		s = other.ConvertToFloat32Array();
		d = this.ConvertToFloat32Array();
		inv = new Float32Array(16);

		inv[0]  =   s[5]*s[10]*s[15] - s[5] *s[11]*s[14] - s[9] *s[6]*s[15]
			+ s[9]*s[7] *s[14] + s[13]*s[6] *s[11] - s[13]*s[7]*s[10];
		inv[4]  = - s[4]*s[10]*s[15] + s[4] *s[11]*s[14] + s[8] *s[6]*s[15]
			- s[8]*s[7] *s[14] - s[12]*s[6] *s[11] + s[12]*s[7]*s[10];
		inv[8]  =   s[4]*s[9] *s[15] - s[4] *s[11]*s[13] - s[8] *s[5]*s[15]
			+ s[8]*s[7] *s[13] + s[12]*s[5] *s[11] - s[12]*s[7]*s[9];
		inv[12] = - s[4]*s[9] *s[14] + s[4] *s[10]*s[13] + s[8] *s[5]*s[14]
			- s[8]*s[6] *s[13] - s[12]*s[5] *s[10] + s[12]*s[6]*s[9];

		inv[1]  = - s[1]*s[10]*s[15] + s[1] *s[11]*s[14] + s[9] *s[2]*s[15]
			- s[9]*s[3] *s[14] - s[13]*s[2] *s[11] + s[13]*s[3]*s[10];
		inv[5]  =   s[0]*s[10]*s[15] - s[0] *s[11]*s[14] - s[8] *s[2]*s[15]
			+ s[8]*s[3] *s[14] + s[12]*s[2] *s[11] - s[12]*s[3]*s[10];
		inv[9]  = - s[0]*s[9] *s[15] + s[0] *s[11]*s[13] + s[8] *s[1]*s[15]
			- s[8]*s[3] *s[13] - s[12]*s[1] *s[11] + s[12]*s[3]*s[9];
		inv[13] =   s[0]*s[9] *s[14] - s[0] *s[10]*s[13] - s[8] *s[1]*s[14]
			+ s[8]*s[2] *s[13] + s[12]*s[1] *s[10] - s[12]*s[2]*s[9];

		inv[2]  =   s[1]*s[6]*s[15] - s[1] *s[7]*s[14] - s[5] *s[2]*s[15]
			+ s[5]*s[3]*s[14] + s[13]*s[2]*s[7]  - s[13]*s[3]*s[6];
		inv[6]  = - s[0]*s[6]*s[15] + s[0] *s[7]*s[14] + s[4] *s[2]*s[15]
			- s[4]*s[3]*s[14] - s[12]*s[2]*s[7]  + s[12]*s[3]*s[6];
		inv[10] =   s[0]*s[5]*s[15] - s[0] *s[7]*s[13] - s[4] *s[1]*s[15]
			+ s[4]*s[3]*s[13] + s[12]*s[1]*s[7]  - s[12]*s[3]*s[5];
		inv[14] = - s[0]*s[5]*s[14] + s[0] *s[6]*s[13] + s[4] *s[1]*s[14]
			- s[4]*s[2]*s[13] - s[12]*s[1]*s[6]  + s[12]*s[2]*s[5];

		inv[3]  = - s[1]*s[6]*s[11] + s[1]*s[7]*s[10] + s[5]*s[2]*s[11]
			- s[5]*s[3]*s[10] - s[9]*s[2]*s[7]  + s[9]*s[3]*s[6];
		inv[7]  =   s[0]*s[6]*s[11] - s[0]*s[7]*s[10] - s[4]*s[2]*s[11]
			+ s[4]*s[3]*s[10] + s[8]*s[2]*s[7]  - s[8]*s[3]*s[6];
		inv[11] = - s[0]*s[5]*s[11] + s[0]*s[7]*s[9]  + s[4]*s[1]*s[11]
			- s[4]*s[3]*s[9]  - s[8]*s[1]*s[7]  + s[8]*s[3]*s[5];
		inv[15] =   s[0]*s[5]*s[10] - s[0]*s[6]*s[9]  - s[4]*s[1]*s[10]
			+ s[4]*s[2]*s[9]  + s[8]*s[1]*s[6]  - s[8]*s[2]*s[5];

		det = s[0]*inv[0] + s[1]*inv[4] + s[2]*inv[8] + s[3]*inv[12];
		if (det === 0) {
			return this;
		}

		det = 1 / det;

		var ele=this.elements;
		var index=0;
		for (i = 0; i < 4; i++) {
			for(j=0;j<4;j++){
				ele[j][i] = inv[index] * det;
				index++;
			}
		}

		return this;
	},
     invert :function() {
		return this.setInverseOf(this);
	 },
	 ConvertToFloat32Array:function(){
		  var s=new Float32Array(16);
		  var d=this.elements;
		  for (var i=0;i<4;i++) {
				for(var j=0;j<4;j++){
					s[i*4+j]=d[j][i];
				}
		  }
		  return s;
	}
}
