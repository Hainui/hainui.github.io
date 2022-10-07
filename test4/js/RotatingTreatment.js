// RotatedTriangles_Matrix4.js
// 顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'void main() {\n' +
    '   gl_Position = u_ModelMatrix * a_Position;\n' +
    '} \n';

// 片元着色器程序
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main() {\n' +
    'gl_FragColor = u_FragColor;\n' + //设置颜色
    '}\n';

//转速 °/s
var ANGLE_STEP = 0;

function main() {
    // 获取<canvas>元素
    var canvas = document.getElementById('webgl');

    //获取WebGL绘图上下文
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('WebGL绘图上下文获取失败');
        return;
    }

    //初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('着色器初始化失败！');
        return;
    }
    //设置<canvas>的背景色
    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    //获取uniform变量的存储位置
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    console.log(u_FragColor);

    if (!u_FragColor) {
        console.log("u_FragColor:获取u_FragColor失败");
        return;
    }
    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
    //设置顶点的位置
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log("顶点位置设置失败！")
        return;
    }

    //三角形的当前旋转角度
    var currentAngle = 0.0;

    // 创建Matrix4对象
    var modelMatrix = new Matrix4();

    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('u_ModelMatrix存储位置获取失败！');
    }

    //开始绘制三角形
    var tick = function () {
        currentAngle = animate(currentAngle);//更新旋转角
        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick);//请求浏览器调用tick
    };
    tick();
}


var vertices = new Float32Array([
    //一个大三角形
    -1.0, 0.0,
    -1.0, -1.0,
    0.0, -1.0,
    //10个小三角形
    -1.0, 0.0,
    -0.9, 0.0,
    -0.9, -0.1,

    -0.9, -0.1,
    -0.8, -0.1,
    -0.8, -0.2,

    -0.8, -0.2,
    -0.7, -0.2,
    -0.7, -0.3,

    -0.7, -0.3,
    -0.6, -0.3,
    -0.6, -0.4,

    -0.6, -0.4,
    -0.5, -0.4,
    -0.5, -0.5,

    -0.5, -0.5,
    -0.4, -0.5,
    -0.4, -0.6,

    -0.4, -0.6,
    -0.3, -0.6,
    -0.3, -0.7,

    -0.3, -0.7,
    -0.2, -0.7,
    -0.2, -0.8,

    -0.2, -0.8,
    -0.1, -0.8,
    -0.1, -0.9,

    -0.1, -0.9,
    0.0, -0.9,
    0.0, -1.0,
    //一个大三角形
    -1.0, 0.0,
    -1.0, 1.0,
    0.0, 1.0,
    //十个小三角形
    -1.0, 0.0,
    -0.9, 0.0,
    -0.9, 0.1,

    -0.9, 0.1,
    -0.8, 0.1,
    -0.8, 0.2,

    -0.8, 0.2,
    -0.7, 0.2,
    -0.7, 0.3,

    -0.7, 0.3,
    -0.6, 0.3,
    -0.6, 0.4,

    -0.6, 0.4,
    -0.5, 0.4,
    -0.5, 0.5,

    -0.5, 0.5,
    -0.4, 0.5,
    -0.4, 0.6,

    -0.4, 0.6,
    -0.3, 0.6,
    -0.3, 0.7,

    -0.3, 0.7,
    -0.2, 0.7,
    -0.2, 0.8,

    -0.2, 0.8,
    -0.1, 0.8,
    -0.1, 0.9,

    -0.1, 0.9,
    0.0, 0.9,
    0.0, 1.0,
    //一个大三角形
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    //十个小三角形
    0.0, 1.0,
    0.0, 0.9,
    0.1, 0.9,

    0.1, 0.9,
    0.1, 0.8,
    0.2, 0.8,

    0.2, 0.8,
    0.2, 0.7,
    0.3, 0.7,

    0.3, 0.7,
    0.3, 0.6,
    0.4, 0.6,

    0.4, 0.6,
    0.4, 0.5,
    0.5, 0.5,

    0.5, 0.5,
    0.5, 0.4,
    0.6, 0.4,

    0.6, 0.4,
    0.6, 0.3,
    0.7, 0.3,

    0.7, 0.3,
    0.7, 0.2,
    0.8, 0.2,

    0.8, 0.2,
    0.8, 0.1,
    0.9, 0.1,

    0.9, 0.1,
    0.9, 0.0,
    1.0, 0.0,
    //一个大三角形
    0.0, -1.0,
    1.0, -1.0,
    1.0, 0.0,
    //十个小三角形
    0.0, -1.0,
    0.0, -0.9,
    0.1, -0.9,

    0.1, -0.9,
    0.1, -0.8,
    0.2, -0.8,

    0.2, -0.8,
    0.2, -0.7,
    0.3, -0.7,

    0.3, -0.7,
    0.3, -0.6,
    0.4, -0.6,

    0.4, -0.6,
    0.4, -0.5,
    0.5, -0.5,

    0.5, -0.5,
    0.5, -0.4,
    0.6, -0.4,

    0.6, -0.4,
    0.6, -0.3,
    0.7, -0.3,

    0.7, -0.3,
    0.7, -0.2,
    0.8, -0.2,

    0.8, -0.2,
    0.8, -0.1,
    0.9, -0.1,

    0.9, -0.1,
    0.9, 0.0,
    1.0, 0.0,
    //最后中间四个三角形
    -0.1, 0.8,
    -0.1, -0.8,
    0.1, -0.8,

    -0.1, 0.8,
    0.1, 0.8,
    0.1, -0.8,

    -0.8, 0.1,
    -0.8, -0.1,
    0.8, 0.1,

    0.8, 0.1,
    0.8, -0.1,
    -0.8, -0.1
]);
function initVertexBuffers(gl) {
    var n = 144; //点的个数

    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("缓冲区对象创建失败！");
        return -1;
    }

    //将缓冲区对象绑定到目标 gl.ARRAY_BUFFER表示缓冲区对象中包含了顶点的数据
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('a_Position:获取存储位置失败！');
    }
    //将缓冲区分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // 连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    return n;
}

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
    // 设置旋转矩阵
    modelMatrix.setRotate(currentAngle, 0, 0, 1);
    // modelMatrix.translate(0.35, 0, 0);

    // 将旋转矩阵传输给顶点着色器
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    // 清除<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
// 记录上一次调用函数的时刻
var g_last = Date.now();

function animate(angle) {
    // 计算距离上次调用经过多长时间
    var now = Date.now();
    var elapsed = now - g_last;//毫秒
    g_last = now;
    // 根据距离上次调用的时间，更新当前旋转角度
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;//毫秒转化为秒
    return newAngle %= 360;
}

function up() {
    ANGLE_STEP = Math.abs(ANGLE_STEP) + 100;
}
//实现标量减速忽略方向
function down() {
    if(ANGLE_STEP <0){
        ANGLE_STEP = -(Math.abs(ANGLE_STEP)-100);
    }else if(ANGLE_STEP>0){
        ANGLE_STEP = Math.abs(ANGLE_STEP) - 100;
    }
}
function reverse() {
    ANGLE_STEP = -ANGLE_STEP;
}











