//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 5, 10, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->

var Camera = function(mat){
	this.CameraMatrix4x4=mat||new Matrix4x4().identity();
	this.MathUtils=new MathUtils();
	//console.log(this.CameraMatrix4x4);
}

Camera.prototype={
	
    Perspective: function(fovy, aspect, near, far){
		this.fovy=fovy;
		this.aspect=aspect;
		this.near=near;
		this.far=far;
		this.PMatrix=new Matrix4x4().setPerspective(fovy, aspect, near, far);
		return this.CameraMatrix4x4.leftMultiply(this.PMatrix);
	},
	LookAt : function(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
		    this.eye=new Vector3(eyeX, eyeY, eyeZ);
			this.center=new Vector3(centerX, centerY, centerZ);
			this.up=new Vector3(upX, upY, upZ);
		    this.VMatrix=new Matrix4x4().setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
		    this.VInvMatrix = this.VMatrix.clone().invert();
		    //console.log(this.VMatrix);
			return this.CameraMatrix4x4.leftMultiply(this.VMatrix);
	},
	ChangeView:function (newEye, newCen, newUp){
		this.eye = newEye || this.eye;
		this.center = newCen || this.center;
		this.up = newUp || this.up;
		var addEAC= new Vector3().addVector(this.eye,this.center);
		this.LookAt(this.eye.x,this.eye.y,this.eye.z,addEAC.x,addEAC.y,addEAC.z, this.up.x,this.up.y,this.up.z);
	},
	Zoom : function(f){
		var addEAC= new Vector3().addVector(this.eye,new Vector3().multiplyScalar(this.center,f));
		this.ChangeView(addEAC.x,addEAC.y,addEAC.z, this.center.x,this.center.y,this.center.z,  this.up.x,this.up.y,this.up.z);
	},
	GetRayFromCanvasPos : function(pos){
		var rdir_cs = this.MathUtils.RayVectorFromCanvas(pos, this.fovy, this.aspect);

		var m4x4MPv4=this.VInvMatrix.multiVector4(new Vector4(rdir_cs.x,rdir_cs.y,rdir_cs.z,0));
		var rdir_ws = new Vector3(m4x4MPv4.x,m4x4MPv4.y,m4x4MPv4.z);
	
		return new RayLines(this.eye, rdir_ws.normalize());
	},
	IsVisible : function(v_ws){
		//console.log(v_ws);
		var v_cs = new Matrix4x4(this.VMatrix).multiVector4( new Vector4(v_ws.x,v_ws.y,v_ws.z,1));
		var v = new Matrix4x4(this.PMatrix).multiVector4(v_cs);
		var w = v.w;
		var visible = true;
		for(var i=0; i<3; i++){
			visible = visible && (-w < v[i]  && v[i] < w);
		}
		return visible;
	},
	WorldToCanvas : function(pos_ws){
		var WtoCanvas = new Matrix4x4(this.VMatrix).leftMultiply(this.PMatrix);
		var pos_clip =WtoCanvas.multiVector4(new Vector4(pos_ws.x,pos_ws.y,pos_ws.z,1));
		return pos_clip.Dehomogenize();
	},
	RotateAroundWSOrigin : function(angle, axis_cs){
		var axis_ws = this.VInvMatrix.multiVector4(new Vector4(axis_cs.x,axis_cs.y,axis_cs.z,0));

		var R = new Matrix4x4().setRotate(angle,axis_ws.x,axis_ws.y,axis_ws.z);
		var eyeV4=R.multiVector4(new Vector4(this.eye.x,this.eye.y,this.eye.z, 1))
		var newEye = new Vector3(eyeV4.x,eyeV4.y,eyeV4.z);

		var cenV4=R.multiVector4(new Vector4(this.center.x,this.center.y,this.center.z, 0))
		var newCen = new Vector3(cenV4.x,cenV4.y,cenV4.z);

		var upV4=R.multiVector4(new Vector4(this.up.x,this.up.y,this.up.z, 0))
		var newUp =new Vector3(upV4.x,upV4.y,upV4.z);
	
		this.ChangeView(newEye.x,newEye.y,newEye.z, newCen.x, newCen.y,newCen.z,newUp.x,newUp.y,newUp.z);
	}

}
