'use strict';

const Vector2D = function (x,y) {
  this.x = x || 0;
  this.y = y || 0;
};

const Vector3D = function(x,y,z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
};

Vector3D.prototype.subtract = function (v2) {
  this.x = this.x - v2.x;
  this.y = this.y - v2.y;
  this.z = this.z - v2.z;
  return new Vector3D(this.x, this.y, this.z);
};

Vector3D.prototype.length = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

Vector3D.prototype.normalize = function() {
  let len = this.length();
  let ilen = 1/len;
  return new Vector3D(this.x*ilen, this.y*ilen, this.z*ilen);
};

Vector3D.Cross = function(v1, v2) {
  let x = v1.y * v2.z - v1.z * v2.y;
  let y = v1.z * v2.x - v1.x * v2.z;
  let z = v1.x * v2.y - v1.y * v2.x;
  return new Vector3D(x, y, z);
};

Vector3D.Dot = function(v1, v2) {
  return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z);
};

Vector3D.transformCoordinates = function(point, transform) {
  let x = point.x * transform.m[0] + point.y * transform.m[4] + point.z * transform.m[8] + transform.m[12];
  let y = point.x * transform.m[1] + point.y * transform.m[5] + point.z * transform.m[9] + transform.m[13];
  let z = point.x * transform.m[2] + point.y * transform.m[6] + point.z * transform.m[10] + transform.m[14];
  let w = point.x * transform.m[3] + point.y * transform.m[7] + point.z * transform.m[11] + transform.m[15];
  return new Vector3D(x/w, y/w, z/w);
};

//Matrix operations
const Matrix =function() {
  this.m = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
};

//THANK YOU BABYLON.js FOR THIS EQUATION THAT I DIDNT WANT TO TYPE MYSELF
Matrix.prototype.multiply = function (other) {
  var result = new Matrix();
  result.m[0] = this.m[0] * other.m[0] + this.m[1] * other.m[4] + this.m[2] * other.m[8] + this.m[3] * other.m[12];
  result.m[1] = this.m[0] * other.m[1] + this.m[1] * other.m[5] + this.m[2] * other.m[9] + this.m[3] * other.m[13];
  result.m[2] = this.m[0] * other.m[2] + this.m[1] * other.m[6] + this.m[2] * other.m[10] + this.m[3] * other.m[14];
  result.m[3] = this.m[0] * other.m[3] + this.m[1] * other.m[7] + this.m[2] * other.m[11] + this.m[3] * other.m[15];

  result.m[4] = this.m[4] * other.m[0] + this.m[5] * other.m[4] + this.m[6] * other.m[8] + this.m[7] * other.m[12];
  result.m[5] = this.m[4] * other.m[1] + this.m[5] * other.m[5] + this.m[6] * other.m[9] + this.m[7] * other.m[13];
  result.m[6] = this.m[4] * other.m[2] + this.m[5] * other.m[6] + this.m[6] * other.m[10] + this.m[7] * other.m[14];
  result.m[7] = this.m[4] * other.m[3] + this.m[5] * other.m[7] + this.m[6] * other.m[11] + this.m[7] * other.m[15];

  result.m[8] = this.m[8] * other.m[0] + this.m[9] * other.m[4] + this.m[10] * other.m[8] + this.m[11] * other.m[12];
  result.m[9] = this.m[8] * other.m[1] + this.m[9] * other.m[5] + this.m[10] * other.m[9] + this.m[11] * other.m[13];
  result.m[10] = this.m[8] * other.m[2] + this.m[9] * other.m[6] + this.m[10] * other.m[10] + this.m[11] * other.m[14];
  result.m[11] = this.m[8] * other.m[3] + this.m[9] * other.m[7] + this.m[10] * other.m[11] + this.m[11] * other.m[15];

  result.m[12] = this.m[12] * other.m[0] + this.m[13] * other.m[4] + this.m[14] * other.m[8] + this.m[15] * other.m[12];
  result.m[13] = this.m[12] * other.m[1] + this.m[13] * other.m[5] + this.m[14] * other.m[9] + this.m[15] * other.m[13];
  result.m[14] = this.m[12] * other.m[2] + this.m[13] * other.m[6] + this.m[14] * other.m[10] + this.m[15] * other.m[14];
  result.m[15] = this.m[12] * other.m[3] + this.m[13] * other.m[7] + this.m[14] * other.m[11] + this.m[15] * other.m[15];
  return result;
};

Matrix.LookAtLH = function(camPosition, camTarget, upVector) {
  let result = new Matrix();
  let zAxis = (camTarget.subtract(camPosition)).normalize();
  let xAxis = (Vector3D.Cross(upVector, zAxis)).normalize();
  let yAxis = (Vector3D.Cross(zAxis, xAxis)).normalize();
  let px = -Vector3D.Dot(xAxis, camPosition);
  let py = -Vector3D.Dot(yAxis, camPosition);
  let pz = -Vector3D.Dot(zAxis, camPosition);
  result.m[0] = xAxis.x, result.m[1] = yAxis.x, result.m[2] = zAxis.x, result.m[3] = 0;
  result.m[4] = xAxis.y, result.m[5] = yAxis.y, result.m[6] = zAxis.y, result.m[7] = 0;
  result.m[8] = xAxis.z, result.m[9] = yAxis.z, result.m[10] = zAxis.z, result.m[11] = 0;
  result.m[12] = px; result.m[13] = py; result.m[14] = pz; result.m[15] = 1;
  return result;
};

//left handed perspective matrix
Matrix.PerspectiveFovLH = function (fov, aspect, znear, zfar) {
  let result = new Matrix();
  let tan = 1 / (Math.tan(fov * 0.5));
  result.m[0] = tan/aspect;
  result.m[5] = tan;
  result.m[10] = -zfar / (znear - zfar);
  result.m[11] = 1;
  result.m[14] = (znear * zfar) / (znear - zfar);
  result.m[1] = result.m[2] = result.m[3] = result.m[4] = result.m[6] = result.m[7] = result.m[8] = result.m[9] = result.m[12] = result.m[13] = result.m[15] = 0;
  return result;
};

Matrix.Translation = function (x,y,z){
  let result = new Matrix();
  result.m[0] = result.m[5] = result.m[10] = result.m[15] = 1;
  result.m[1] = result.m[2] = result.m[3] = result.m[4] = result.m[6] = result.m[7] = result.m[8] = result.m[9] = result.m[11] = 0;
  result.m[12] = x; result.m[13] = y; result.m[14] = z;
  return result;
};

Matrix.rotationYPR = function(yaw, pitch, roll) {
  return Matrix.rotateZ(roll).multiply(Matrix.rotateX(pitch)).multiply(Matrix.rotateY(yaw));
};

Matrix.rotateX = function(theta) {
  let result = new Matrix();
  let cos = Math.cos(theta);
  let sin = Math.sin(theta);
  result.m[5] = result.m[10] = cos;
  result.m[9] = -sin;
  result.m[0] = result.m[15] = 1;
  result.m[6] = sin;
  result.m[1] = result.m[2] = result.m[3] = result.m[4] = result.m[7] = result.m[8] = result.m[11] = result.m[12] = result.m[13] = result.m[14] = 0;
  return result;
};

Matrix.rotateY = function(theta) {
  let result = new Matrix();
  let cos = Math.cos(theta);
  let sin = Math.sin(theta);
  result.m[0] = result.m[10] = cos;
  result.m[2] = -sin;
  result.m[8] = sin;
  result.m[1] = result.m[3] = result.m[4] = result.m[6] = result.m[7] = result.m[9] = result.m[11] = result.m[12] = result.m[13] = result.m[14] = 0;
  result.m[5] = result.m[15] = 1;
  return result;
};

Matrix.rotateZ = function(theta) {
  let result = new Matrix();
  let cos = Math.cos(theta);
  let sin = Math.sin(theta);
  result.m[0] = result.m[5] = cos;
  result.m[4] = -sin;
  result.m[1] = sin;
  result.m[2] = result.m[3] = result.m[6] = result.m[7] = result.m[8] = result.m[9] = result.m[11] = result.m[12] = result.m[13] = result.m[14] = 0;
  result.m[10] = result.m[15] = 1;
  return result;
};

//isosahedron
const Isosahedron = function() {
  let r = 1; // Radius
  let f = (1 + Math.sqrt(5))/2; // Golden Ratio
  
  this.vertices = [
    new Vector3D(r,0,f*r),
    new Vector3D(f*r,r,0),
    new Vector3D(0,f*r,r),
    new Vector3D(-r,0,f*r),
    new Vector3D(0,-f*r,r),
    new Vector3D(f*r,-r,0),
    new Vector3D(r,0,-f*r),
    new Vector3D(0,f*r,-r),
    new Vector3D(-f*r,r,0),
    new Vector3D(-f*r,-r,0),
    new Vector3D(0,-f*r,-r),
    new Vector3D(-r,0,-f*r),
  ];
  
  this.faces = [
    { A:0, B:1, C:2 },
    { A:0, B:2, C:3 },
    { A:0, B:3, C:4 },
    { A:0, B:4, C:5 },
    { A:0, B:5, C:1 },
      
    { A:11, B:10, C:6 },
    { A:11, B:6, C:7 },
    { A:11, B:7, C:8 },
    { A:11, B:8, C:9 },
    { A:11, B:9, C:10 },
      
    { A:6, B:5, C:1 },
    { A:7, B:1, C:2 },
    { A:8, B:2, C:3 },
    { A:9, B:3, C:4 },
    { A:10, B:4, C:5 },
      
    { A:5, B:6, C:10 },
    { A:1, B:6, C:7 },
    { A:2, B:7, C:8 },
    { A:3, B:8, C:9 },
    { A:4, B:9, C:10 },   
   ];
};

const stellation2 = function() {
  let C0 = (3 - Math.sqrt(5)) / 4;
	let C1 = (Math.sqrt(5) - 1) / 4;
  this.vertices = [
    new Vector3D(0.5, 0.0, C0),
    new Vector3D(0.5, 0.0, -C0),
    new Vector3D(-0.5, 0.0, C0),
    new Vector3D(-0.5, 0.0, -C0),

    new Vector3D(0.0, C0, 0.5),
    new Vector3D(0.0, C0, -0.5),
    new Vector3D(0.0, -C0, 0.5),
    new Vector3D(0.0, -C0, -0.5),

    new Vector3D(C0, 0.5, 0.0),
    new Vector3D(-C0, 0.5, 0.0),
    new Vector3D(C0, -0.5, 0.0),
    new Vector3D(-C0, -0.5, 0.0),

    new Vector3D(-C1, -C1, -C1),
    new Vector3D(-C1, -C1, C1),
    new Vector3D(C1, -C1, -C1),
    new Vector3D(C1, -C1, C1),

    new Vector3D(-C1, C1, -C1),
    new Vector3D(-C1, C1, C1),
    new Vector3D(C1, C1, -C1),
    new Vector3D(C1, C1, C1),
  ];
  
    this.faces = [
      { A:0, B:2, C:14, D:4, E:12 },
      { A:0, B:12, C:8, D:10, E:16 },
      { A:0, B:16, C:6, D:18, E:2 },
      { A:7, B:6, C:16, D:10, E:17 },
      { A:7, B:17, C:1, D:3, E:19 },
      { A:7, B:19, C:11, D:18, E:6 },
      { A:9, B:11, C:19, D:3, E:15 },
      { A:9, B:15, C:5, D:4, E:14 },
      { A:9, B:14, C:2, D:18, E:11 },
      { A:13, B:1, C:17, D:10, E:8 },
      { A:13, B:8, C:12, D:4, E:5 },
      { A:13, B:5, C:15, D:3, E:1 },
  ]; 
};

//Device!
let meshes = [], camera, device, mesh;

const Mesh = function(shape) {
  this.vertices = shape.vertices;
  this.faces = shape.faces;
  this.rotation = new Vector3D(45,45,45);
  this.position = new Vector3D(0,0,0);
};

Mesh.prototype.sortByZIndex = function(a, b){
  return a.z - b.z;
};

const Camera = function() {
  // Set up initial positions of the camera, the target that the camera looks at, and up direction of the camera
  this.position = new Vector3D(0, 0, 4);
  this.target = new Vector3D(0, 0, 0);
  this.up = new Vector3D(0, 1, 0);
};

// 3D core - Takes 3D mesh coordinates and projects into 2D world
const Device = function() {
  this.canvas = document.querySelector('canvas');
  this.ctx = this.canvas.getContext('2d');
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;
};

Device.prototype.Clear = function(){
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Device.prototype.Project = function(point, transformMatrix){
  // Apply transformation matrix to each coordinate in the vertices array
  let projected = Vector3D.transformCoordinates(point, transformMatrix);
  // Scale the points by canvas size to position in the center
  let x = projected.x * this.canvas.width + this.canvas.width/2;
  let y = -projected.y * this.canvas.height + this.canvas.height/2;
  return new Vector2D(x, y);
};

Device.prototype.drawPoint = function(vertex) {
  this.ctx.fillStyle = 'rgba(255,255,255,.7)';
  // Draw point by creating tiny rectangle at vertex position with size 2px
  this.ctx.fillRect(vertex.x, vertex.y, 2, 2);
};

Device.prototype.drawTriangle = function(vertex1, vertex2, vertex3) {
  // Draw triangle outlines
  this.ctx.beginPath();
  this.ctx.strokeStyle = '#096';
  this.ctx.moveTo(vertex1.x, vertex1.y); // pick up "pen," reposition 
  this.ctx.lineTo(vertex2.x, vertex2.y); // draw line from vertex1 to vertex2
  this.ctx.lineTo(vertex3.x, vertex3.y); // draw line from vertex2 to vertex3
  this.ctx.closePath(); // connect end to start
  this.ctx.stroke(); // outline the triangle
  // Fill Triangles
  // this.ctx.fillStyle = 'rgba(129, 212, 250, .3)';
  // this.ctx.fill();
}

Device.prototype.drawPentagram = function(vertex1, vertex2, vertex3, vertex4, vertex5) {
  this.ctx.beginPath();
  this.ctx.strokeStyle = '#fff';
  this.ctx.moveTo(vertex1.x, vertex1.y); // pick up "pen," reposition 
  this.ctx.lineTo(vertex2.x, vertex2.y); // draw line from vertex1 to vertex2
  this.ctx.lineTo(vertex3.x, vertex3.y); // draw line from vertex2 to vertex3
  this.ctx.lineTo(vertex4.x, vertex4.y); // draw line from vertex3 to vertex4
  this.ctx.lineTo(vertex5.x, vertex5.y); // draw line from vertex4 to vertex5
  this.ctx.closePath(); // connect end to start
  this.ctx.stroke(); // outline
  this.ctx.fillStyle = 'rgba(100, 100, 100, .10)';
  this.ctx.fill();
}
  
     
Device.prototype.Render = function(camera, meshes) {
  let viewMatrix = Matrix.LookAtLH(camera.position, camera.target, camera.up);
  let projectionMatrix = Matrix.PerspectiveFovLH(0.78, this.canvas.width/this.canvas.height, .01, 1.0);
  // Loop through meshes
  for (let i = 0; i < meshes.length; i++) {
    let currentMesh = meshes[i];
    let worldMatrix = Matrix.rotationYPR(currentMesh.rotation.y, currentMesh.rotation.x, currentMesh.rotation.z).multiply(Matrix.Translation(currentMesh.position.y, currentMesh.position.x, currentMesh.position.z));
    // Final matrix to be applied to each vertex
    let transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix); 
    // Loop through faces in each mesh
    for(let i = 0; i < currentMesh.faces.length; i++) {
      let face = currentMesh.faces[i];
      // Create each triangular face using indexes from faces array
      let vertexA = currentMesh.vertices[face.A];
      let vertexB = currentMesh.vertices[face.B];
      let vertexC = currentMesh.vertices[face.C];
      let vertexD = currentMesh.vertices[face.D];
      let vertexE = currentMesh.vertices[face.E];
      // Project each vertex in the face by applying transformation matrix to all points
      let projectedVertexA = this.Project(vertexA, transformMatrix);
      let projectedVertexB = this.Project(vertexB, transformMatrix);
      let projectedVertexC = this.Project(vertexC, transformMatrix);
      let projectedVertexD = this.Project(vertexD, transformMatrix);
      let projectedVertexE = this.Project(vertexE, transformMatrix);
      // Draw Projected Vertices
      //this.drawPoint(projectedVertexA); 
      
      // Draw Triangles
      //this.drawTriangles(projectedVertexA, projectedVertexB, projectedVertexC);
      
      // Draw Pentagrams
      this.drawPentagram(projectedVertexA, projectedVertexB, projectedVertexC, projectedVertexD, projectedVertexE);
    }
  }
};

// Initialize Program
function init() {
  camera = new Camera();
  device = new Device();
  let testShape = new stellation2();
  mesh = new Mesh(testShape);
  meshes.push(mesh);
  requestAnimationFrame(drawingLoop);
}
init();

// Rendering loop handler
function drawingLoop() {
  device.Clear();
  // Change rotation angle each frame to create rotation
  mesh.rotation.x += 0.001;
  mesh.rotation.y += 0.001;
  device.Render(camera, meshes);
  requestAnimationFrame(drawingLoop);
}