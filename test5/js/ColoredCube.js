// ColoredCube.js
// 顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'varying vec2 v_TexCoord;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'void main(){\n' +
    '   gl_Position = u_MvpMatrix * u_ModelMatrix*a_Position;\n' +
    '   v_TexCoord = a_TexCoord;\n' +
    '}\n';

// 片元着色器程序
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform sampler2D u_Sampler;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main(){\n' +
    ' gl_FragColor = texture2D(u_Sampler,v_TexCoord);\n' +
    '}\n';

var XYZ = 3;// 1 X轴 2 Y轴 3 Z轴

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

    //设置顶点的位置
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log("顶点位置设置失败！")
        return;
    }

    //获取u_ModelViewMatrix
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if (!u_MvpMatrix) {
        console.log("u_MvpMatrix：获取失败！");
        return;
    }
    //设置视点、视线和上方向 //set 设置透视投影矩阵
    var mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, 1, 1, 100);
    //再与视图矩阵相乘
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

    //将矩阵传给对应的uniform变量
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    //设置背景颜色
    gl.clearColor(0.5, 0.5, 1.0, 1.0);
    // 开启隐藏面消除
    gl.enable(gl.DEPTH_TEST);
    // // 清空颜色和深度缓冲区
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // // 绘制立方体
    // gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    initTextures(gl, n);
    // while(true){
    //     if(flag==1){
    //         if(flag==1) render(gl,n);
    //         break;
    //     }
    // }

}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        //顶点坐标和颜色
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,//前A1 B1 C1 D1
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,//右A2 B2 C2 D2
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,//上A3 B3 C3 D3
        -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0,//左
        1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0,//下
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0,//后
    ]);
    //颜色
    var colors = new Float32Array([
        0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0,
        0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4,
        1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4,
        1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0,
        1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4,
        0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0,
    ]);
    var texture = new Float32Array([
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    ]);

    //顶点索引
    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,//前
        4, 5, 6, 4, 6, 7,//右
        8, 9, 10, 8, 10, 11,//上
        12, 13, 14, 12, 14, 15,//左
        16, 17, 18, 16, 18, 19,//下
        20, 21, 22, 20, 22, 23,//后
    ]);
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        console.log("缓冲区对象创建失败！");
        return -1;
    }
    // 将顶点坐标和纹理坐标写入缓冲区对象
    if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position'))
        return -1;
    if (!initArrayBuffer(gl, texture, 2, gl.FLOAT, 'a_TexCoord'))
        return -1;

    //将顶点索引数据写入缓冲区对象
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function initArrayBuffer(gl, data, num, type, attribute) {
    var buffer = gl.createBuffer();// 创建缓冲区对象
    if (!buffer) {
        console.log('缓冲区对象创建失败！');
        return false;
    }
    //将数据写入缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // 将缓冲区对象分配给attribute变量
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
        console.log('a_attribute:获取存储位置失败！');
        return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // 将缓冲区对象分配给attribute变量
    gl.enableVertexAttribArray(a_attribute);

    return true;
}

function initTextures(gl, n) {
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
    image.onload = function () { loadTexture(gl, n, texture, u_Sampler, image); };
    // 浏览器开始加载图像
    image.src = '../images/tx.jpg';
    return true;
}
var flag = 0;
function loadTexture(gl, n, texture, u_Sampler, image) {
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
    //三角形的当前旋转角度
    var currentAngle = 0.0;

    // 创建Matrix4对象
    var modelMatrix = new Matrix4();

    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('u_ModelMatrix存储位置获取失败！');
    }
    // drawX(gl,n,currentAngle,modelMatrix,u_ModelMatrix);
    var tick = function () {
        currentAngle = animate(currentAngle);//更新旋转角
        switch (XYZ) {
            case 1:
                drawX(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
                break;
            case 2:
                drawY(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
                break;
            case 3:
                drawZ(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
        }
        requestAnimationFrame(tick);//请求浏览器调用tick
    };
    tick();
}

function render(gl, n) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 绘制立方体
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

//转速 °/s
var ANGLE_STEP = 100;
//设置X Y Z 方向上面的偏移量
var X = 0.0;//表示原图形往X轴移动X长度
var Y = 0.0;
var Z = 0.0;
//缩放因子
var XS = 1.0;
var YS = 1.0;
var ZS = 1.0;
function drawX(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
    // 设置模板矩阵
    modelMatrix.setTranslate(X, Y, Z);
    modelMatrix.rotate(currentAngle, 1, 0, 0);
    modelMatrix.translate(-X, -Y, -Z);
    modelMatrix.translate(X, Y, Z);
    modelMatrix.scale(XS, YS, ZS);
    // 将旋转矩阵传输给顶点着色器
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 绘制立方体
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}
function drawY(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
    // 设置模板矩阵
    modelMatrix.setTranslate(X, Y, Z);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    modelMatrix.translate(-X, -Y, -Z);
    modelMatrix.translate(X, Y, Z);
    modelMatrix.scale(XS, YS, ZS);
    // 将旋转矩阵传输给顶点着色器
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 绘制立方体
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}
function drawZ(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
    // 设置模板矩阵
    modelMatrix.setTranslate(X, Y, Z);
    modelMatrix.rotate(currentAngle, 0, 0, 1);
    modelMatrix.translate(-X, -Y, -Z);
    modelMatrix.translate(X, Y, Z);
    modelMatrix.scale(XS, YS, ZS);
    // 将旋转矩阵传输给顶点着色器
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 绘制立方体
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}
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
    ANGLE_STEP += 100;
}
//实现标量减速忽略方向
function down() {
    if (ANGLE_STEP < 0) {
        ANGLE_STEP = -(Math.abs(ANGLE_STEP) - 100);
    } else if (ANGLE_STEP > 0) {
        ANGLE_STEP = Math.abs(ANGLE_STEP) - 100;
    }
}
function reverse() {
    ANGLE_STEP = -ANGLE_STEP;
}
function Xl() {
    X -= 0.1;
}
function Xr() {
    X += 0.1;
}
function Ys() {
    Y += 0.1;
}
function Yx() {
    Y -= 0.1;
}
function Zl() {
    Z -= 0.1;
}
function Zw() {
    Z += 0.1;
}
function xx() {
    XYZ = 1;
    console.log(XYZ);
}
function yy() {
    XYZ = 2;
    console.log(XYZ);
}
function zz() {
    XYZ = 3;
    console.log(XYZ);
}
function Xup() {
    XS += 0.1;
}
function Xdown() {
    if (XS > 0.1)
        XS -= 0.1;
    console.log(XS);
}
function Yup() {
    YS += 0.1;
}
function Ydown() {
    if (YS > 0.1)
        YS -= 0.1;
    console.log(YS);
}
function Zup() {
    ZS += 0.1;
}
function Zdown() {
    if (ZS > 0.1)
        ZS -= 0.1;
    console.log(ZS);
}