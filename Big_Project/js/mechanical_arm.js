// MultiJointModel.js (c) 2012 matsuda and itami
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Normal;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'varying vec4 v_Normal;\n' +
  'varying vec2 v_TexCoord;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'void main() {\n' +
  '  v_Normal = a_Normal;\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  // Shading calculation to make the arm look three-dimensional
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec2 v_TexCoord;\n' +
  'varying vec4 v_Normal;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform sampler2D u_Sampler;\n' +
  'void main() {\n' +
  '  vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7));\n' + // Light direction
  '  vec3 normal = normalize((u_NormalMatrix * v_Normal).xyz);\n' +
  '  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
  '  vec4 color = texture2D(u_Sampler,v_TexCoord);\n' +
  '  gl_FragColor = vec4(color.rgb * nDotL + vec3(0.2), color.a);\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');
  var hud = document.getElementById('hud');
  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  // Get the rendering context for 2DCG
  var ctx = hud.getContext('2d');
  if (!gl || !ctx) {
    console.log('Failed to get rendering context');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set the vertex information
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(141 / 255, 123 / 255, 95 / 255, 1.0);
  // gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_MvpMatrix || !u_NormalMatrix) {
    console.log('Failed to get the storage location');
    return;
  }
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_MvpMatrix || !u_NormalMatrix) {
    console.log('Failed to get the storage location');
    return;
  }

  // Calculate the view projection matrix
  var viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0);
  viewProjMatrix.lookAt(20.0, 10.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

  // Register the event handler
  initEventHandlers(hud);

  // Register the event handler to be called on key press
  document.onkeydown = function (ev) { keydown(ev); };

  //配置纹理
  if (!initTextures(gl, n, ctx, viewProjMatrix, u_MvpMatrix, u_NormalMatrix)) {
    console.log("纹理配置失败！");
  }

}

var currentAngle = [180.0, 90.0]; // Current rotation angle ([x-axis, y-axis] degrees)
var ANGLE_STEP = 3.0;     // The increments of rotation angle (degrees)
var g_arm1Angle = 0.0;   // The rotation angle of arm1 (degrees)
var g_joint1Angle = 0.0; // The rotation angle of joint1 (degrees)
var g_joint2Angle = 0.0;  // The rotation angle of joint2 (degrees)
var g_joint3Angle = 0.0;  // The rotation angle of joint3 (degrees)

function keydown(ev) {
  switch (ev.keyCode) {
    case 40: // Up arrow key -> the positive rotation of joint1 around the z-axis
      if (g_joint1Angle < 135.0) g_joint1Angle += ANGLE_STEP;
      break;
    case 38: // Down arrow key -> the negative rotation of joint1 around the z-axis
      if (g_joint1Angle > -135.0) g_joint1Angle -= ANGLE_STEP;
      break;
    case 39: // Right arrow key -> the positive rotation of arm1 around the y-axis
      g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
      break;
    case 37: // Left arrow key -> the negative rotation of arm1 around the y-axis
      g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
      break;
    case 90: // 'ｚ'key -> the positive rotation of joint2
      g_joint2Angle = (g_joint2Angle + ANGLE_STEP) % 360;
      break;
    case 88: // 'x'key -> the negative rotation of joint2
      g_joint2Angle = (g_joint2Angle - ANGLE_STEP) % 360;
      break;
    case 86: // 'v'key -> the positive rotation of joint3
      if (g_joint3Angle < 60.0) g_joint3Angle = (g_joint3Angle + ANGLE_STEP) % 360;
      break;
    case 67: // 'c'key -> the nagative rotation of joint3
      if (g_joint3Angle > -60.0) g_joint3Angle = (g_joint3Angle - ANGLE_STEP) % 360;
      break;
    default: return; // Skip drawing at no effective action
  }
  // Draw the robot arm
  // draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
}

function initVertexBuffers(gl) {
  // Coordinates（Cube which length of one side is 1 with the origin on the center of the bottom)
  var vertices = new Float32Array([
    0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, 0.5, // v0-v1-v2-v3 front
    0.5, 1.0, 0.5, 0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 1.0, -0.5, // v0-v3-v4-v5 right
    0.5, 1.0, 0.5, 0.5, 1.0, -0.5, -0.5, 1.0, -0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
    -0.5, 1.0, 0.5, -0.5, 1.0, -0.5, -0.5, 0.0, -0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
    -0.5, 0.0, -0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
    0.5, 0.0, -0.5, -0.5, 0.0, -0.5, -0.5, 1.0, -0.5, 0.5, 1.0, -0.5  // v4-v7-v6-v5 back
  ]);

  // Normal
  var normals = new Float32Array([
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // v0-v1-v2-v3 front
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // v0-v3-v4-v5 right
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // v0-v5-v6-v1 up
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, // v7-v4-v3-v2 down
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0  // v4-v7-v6-v5 back
  ]);

  // Indices of the vertices
  var indices = new Uint8Array([
    0, 1, 2, 0, 2, 3,    // front
    4, 5, 6, 4, 6, 7,    // right
    8, 9, 10, 8, 10, 11,    // up
    12, 13, 14, 12, 14, 15,    // left
    16, 17, 18, 16, 18, 19,    // down
    20, 21, 22, 20, 22, 23     // back
  ]);
  // 纹理坐标
  var texture = new Float32Array([
    1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
  ]);

  // Write the vertex property to buffers (coordinates and normals)
  if (!initArrayBuffer(gl, 'a_Position', vertices, gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', normals, gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_TexCoord', texture, gl.FLOAT, 2)) return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer(gl, attribute, data, type, num) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

// Coordinate transformation matrix
var g_modelMatrix = new Matrix4(), g_mvpMatrix = new Matrix4();

function draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw a base
  var baseHeight = 2.0;

  g_modelMatrix.setRotate(currentAngle[0], 1.0, 0.0, 0.0);
  g_modelMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0);
  g_modelMatrix.translate(0.0, -12.0, 0.0);
  drawBox(gl, n, 10.0, baseHeight, 10.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);

  // Arm1
  var arm1Length = 10.0;
  g_modelMatrix.translate(0.0, baseHeight, 0.0);     // Move onto the base
  g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
  drawBox(gl, n, 3.0, arm1Length, 3.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  // Arm2
  var arm2Length = 10.0;
  g_modelMatrix.translate(0.0, arm1Length, 0.0);       // Move to joint1
  g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);  // Rotate around the z-axis
  drawBox(gl, n, 4.0, arm2Length, 4.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  // A palm
  var palmLength = 2.0;
  g_modelMatrix.translate(0.0, arm2Length, 0.0);       // Move to palm
  g_modelMatrix.rotate(g_joint2Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
  drawBox(gl, n, 2.0, palmLength, 6.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);  // Draw

  // Move to the center of the tip of the palm
  g_modelMatrix.translate(0.0, palmLength, 0.0);

  // Draw finger1
  pushMatrix(g_modelMatrix);
  g_modelMatrix.translate(0.0, 0.0, 2.0);
  g_modelMatrix.rotate(g_joint3Angle, 1.0, 0.0, 0.0);  // Rotate around the x-axis
  drawBox(gl, n, 1.0, 2.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
  g_modelMatrix = popMatrix();

  // Draw finger2
  g_modelMatrix.translate(0.0, 0.0, -2.0);
  g_modelMatrix.rotate(-g_joint3Angle, 1.0, 0.0, 0.0);  // Rotate around the x-axis
  drawBox(gl, n, 1.0, 2.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
}

var g_matrixStack = []; // Array for storing a matrix
function pushMatrix(m) { // Store the specified matrix to the array
  var m2 = new Matrix4(m);
  g_matrixStack.push(m2);
}

function popMatrix() { // Retrieve the matrix from the array
  return g_matrixStack.pop();
}

var g_normalMatrix = new Matrix4();  // Coordinate transformation matrix for normals

// Draw rectangular solid
function drawBox(gl, n, width, height, depth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
  pushMatrix(g_modelMatrix);   // Save the model matrix
  // Scale a cube and draw
  g_modelMatrix.scale(width, height, depth);
  // Calculate the model view project matrix and pass it to u_MvpMatrix
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
  // Calculate the normal transformation matrix and pass it to u_NormalMatrix
  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
  // Draw
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  g_modelMatrix = popMatrix();   // Retrieve the model matrix
}

var lastX = -1, lastY = -1;   // Last position of the mouse
function initEventHandlers(canvas) {
  var dragging = false;         // Dragging or not

  canvas.onmousedown = function (ev) {   // Mouse is pressed
    var x = ev.clientX, y = ev.clientY;
    // Start dragging if a moue is in <canvas>
    var rect = ev.target.getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      lastX = x; lastY = y;
      dragging = true;
    }
  };

  canvas.onmouseup = function (ev) { dragging = false; }; // Mouse is released

  var nf = document.getElementById('xy');
  canvas.onmousemove = function (ev) { // Mouse is moved
    var x = ev.clientX, y = ev.clientY;
    if (dragging) {
      var factor = 100 / canvas.height; // The rotation ratio
      var dx = factor * (x - lastX);
      var dy = factor * (y - lastY);
      // Limit x-axis rotation angle to -90 to 90 degrees
      // currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
      currentAngle[0] = currentAngle[0] + dy;
      currentAngle[1] = currentAngle[1] + dx;
    }
    lastX = x, lastY = y;
  };
}

function draw2D(ctx) {
  //手指
  var a = 10;
  var b = 10;
  var x = 20;
  var y = 30;
  ctx.clearRect(0, 0, 800, 500); // Clear <hud>
  // Draw triangle with white lines
  ctx.beginPath();                      // Start drawing
  ctx.moveTo(40 - 20, 10 + 60 + 25);
  ctx.lineTo(220 - 20, 10 + 60 + 25);
  ctx.lineTo(220 - 20, 35 + 60 + 25);
  ctx.lineTo(150 - 20, 35 + 60 + 25);
  ctx.lineTo(150 - 20, 120 + 60 + 60 + 25);
  ctx.lineTo(160 - 20, 120 + 60 + 60 + 25);
  ctx.lineTo(160 - 20, 205 + 60 + 60 + 25);
  ctx.lineTo(100 - 20, 205 + 60 + 60 + 25);
  ctx.lineTo(100 - 20, 120 + 60 + 60 + 25);
  ctx.lineTo(110 - 20, 120 + 60 + 60 + 25);
  ctx.lineTo(110 - 20, 35 + 60 + 25);
  ctx.lineTo(40 - 20, 35 + 60 + 25);
  ctx.lineTo(40 - 20, 10 + 60 + 25);
  ctx.moveTo(110 - 20, 35 + 60 + 25);
  ctx.lineTo(150 - 20, 35 + 60 + 25);
  ctx.moveTo(110 - 20, 120 + 60 + 60 + 25);
  ctx.lineTo(150 - 20, 120 + 60 + 60 + 25);
  ctx.moveTo(90 - 20, 205 + 60 + 60 + 25);
  ctx.lineTo(170 - 20, 205 + 60 + 60 + 25);
  ctx.lineTo(170 - 20, 220 + 60 + 60 + 25);
  ctx.lineTo(90 - 20, 220 + 60 + 60 + 25);
  ctx.lineTo(90 - 20, 205 + 60 + 60 + 25);
  ctx.moveTo(90 + a - 20, 220 + 60 + 60 + 25);
  ctx.lineTo(90 + a + x - 20, 220 + 60 + 60 + 25);
  ctx.lineTo(90 + a + x - 20, 220 + y + 60 + 60 + 25);
  ctx.lineTo(90 + a - 20, 220 + y + 60 + 60 + 25);
  ctx.lineTo(90 + a - 20, 220 + 60 + 60 + 25);
  ctx.moveTo(170 - a - 20, 220 + 60 + 60 + 25);
  ctx.lineTo(170 - a - x - 20, 220 + 60 + 60 + 25);
  ctx.lineTo(170 - a - x - 20, 220 + y + 60 + 60 + 25);
  ctx.lineTo(170 - a - 20, 220 + y + 60 + 60 + 25);
  ctx.closePath();

  ctx.strokeStyle = 'rgba(0.9467, 0.9091, 0.7921, 1)'; // Set white to color of lines
  ctx.stroke();                           // Draw Triangle with white lines
  // Draw white letters
  ctx.font = '15px "Times New Roman"';
  ctx.fillStyle = 'rgba(0.1607, 0.2078, 0.1921, 1)'; // Set white to the color of letters
  // ctx.fillText('HUD: Head Up Display', 40, 300);
  // ctx.fillText('Triangle is drawn by Canvas 2D API.', 40, 320);
  ctx.fillText('基座', 210, 90 + 25);
  ctx.fillText('肩臂 ← →', 140, 175 + 25);
  ctx.fillText('前臂 ↑ ↓', 148, 290 + 25);
  ctx.fillText('手掌 z x', 157, 340 + 25);
  ctx.fillText('手指 c v', 147, 362 + 25);
  ctx.font = '20px "Times New Roman"';
  ctx.fillStyle = 'rgba(0.9467, 0.9091, 0.7921, 1)'; // Set white to the color of letters
  ctx.fillText('Y: ' + lastX, 610, 440);
  ctx.fillText('X: ' + lastY, 610, 420);
  ctx.fillText('Current AngleY: ' + Math.floor(currentAngle[0]), 610, 480);
  ctx.fillText('Current AngleX: ' + Math.floor(currentAngle[1]), 610, 460);
}

function initTextures(gl, n, ctx, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
  var texture = gl.createTexture();//创建纹理对象
  if (!texture) {
    console.log("纹理对象创建失败！");
  }
  // 获取u_Sample的存储位置
  var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!u_Sampler) {
    console.log("u_Sampler存储位置获取失败！");
  }
  var image = new Image();//创建一个image对象
  if (!image) {
    console.log("image对象创建失败！");
  }
  // 注册图像加载事件的响应函数
  image.onload = function () { loadTexture(gl, n, texture, u_Sampler, image, ctx, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); };
  // 浏览器开始加载图像
  image.src = '../img/DLS.jpg';
  return true;
}

function loadTexture(gl, n, texture, u_Sampler, image, ctx, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);//对纹理图像进行y轴反转
  // 开启0号纹理单元
  gl.activeTexture(gl.TEXTURE0);
  // 向target绑定纹理对象
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 配置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // 配置纹理图像
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  //将0号纹理传递给着色器中的取样器变量
  gl.uniform1i(u_Sampler, 0);
  var tick = function () {
    draw2D(ctx);
    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw the robot arm
    requestAnimationFrame(tick);
  }
  tick();

}