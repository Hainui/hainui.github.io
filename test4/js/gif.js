// RotatedTriangles_Matrix4.js
// 顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '   gl_Position = a_Position;\n' +
    '   v_Color = a_Color;\n' +
    '} \n';

// 片元着色器程序
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    'gl_FragColor = v_Color;\n' + //设置颜色
    '}\n';

//变速 °/s 
var LENGTH_STEP1 = 0.5;
var LENGTH_STEP2 = 3.0;
var LENGTH_STEP3 = 1.0;
var LENGTH_STEP4 = 2.5;
var LENGTH_STEP5 = 3.5;
var backdrop = 1.0;

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


    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('a_Position:获取存储位置失败！');
    }

    // drawRectangle3(gl, 1.3, 1.3, 1.3, 1.3, 1.3);

    var h1 = 0.0, h2 = 0.0, h3 = 0.3, h4 = 0.5, h5 = 0.7;
    //开始绘制
    var tick = function () {
        h1 = animate1(h1);//更新高度
        h2 = animate2(h2);//更新高度
        h3 = animate3(h3);//更新高度
        h4 = animate4(h4);//更新高度
        h5 = animate5(h5);//更新高度
        drawRectangle3(gl, h1, h2, h3, h4, h5);
        requestAnimationFrame(tick);//请求浏览器调用tick
    };
    tick();


}

// 记录上一次调用函数的时刻
var g_last1 = Date.now();
function animate1(height) {
    // 计算距离上次调用经过多长时间
    var now = Date.now();
    var elapsed = now - g_last1;//毫秒
    g_last1 = now;
    // 根据距离上次调用的时间，更新当前高度
    var newHeight = height + (LENGTH_STEP1 * elapsed) / 1000.0;//毫秒转化为秒
    return newHeight %= 1.5;
}
var g_last2 = Date.now();
function animate2(height) {
    // 计算距离上次调用经过多长时间
    var now = Date.now();
    var elapsed = now - g_last2;//毫秒
    g_last2 = now;
    // 根据距离上次调用的时间，更新当前高度
    var newHeight = height + (LENGTH_STEP2 * elapsed) / 1000.0;//毫秒转化为秒
    return newHeight %= 1.5;
}
var g_last3 = Date.now();
function animate3(height) {
    // 计算距离上次调用经过多长时间
    var now = Date.now();
    var elapsed = now - g_last3;//毫秒
    g_last3 = now;
    // 根据距离上次调用的时间，更新当前高度
    var newHeight = height + (LENGTH_STEP3 * elapsed) / 1000.0;//毫秒转化为秒
    return newHeight %= 1.5;
}
var g_last4 = Date.now();
function animate4(height) {
    // 计算距离上次调用经过多长时间
    var now = Date.now();
    var elapsed = now - g_last4;//毫秒
    g_last4 = now;
    // 根据距离上次调用的时间，更新当前高度
    var newHeight = height + (LENGTH_STEP4 * elapsed) / 1000.0;//毫秒转化为秒
    return newHeight %= 1.5;
}
var g_last5 = Date.now();
function animate5(height) {
    // 计算距离上次调用经过多长时间
    var now = Date.now();
    var elapsed = now - g_last5;//毫秒
    g_last5 = now;
    // 根据距离上次调用的时间，更新当前高度
    var newHeight = height + (LENGTH_STEP5 * elapsed) / 1000.0;//毫秒转化为秒
    return newHeight %= 1.5;
}

//根据高度来绘制矩形
function drawRectangle3(gl, h1, h2, h3, h4, h5) {
    var verticesColors = new Float32Array([
        //1
        -0.8, -0.8, 78 / 255, 190 / 255, 189 / 255,//D1
        -0.6, -0.8, 78 / 255, 190 / 255, 189 / 255,//C1
        -0.8, -0.8 + h1, 1.0, 1.0, 1.0,//B1

        -0.6, -0.8, 78 / 255, 190 / 255, 189 / 255,
        -0.8, -0.8 + h1, 1.0, 1.0, 1.0,
        -0.6, -0.8 + h1, 1.0, 1.0, 1.0,
        //2
        -0.45, -0.8, 78 / 255, 190 / 255, 189 / 255,//D1
        -0.25, -0.8, 78 / 255, 190 / 255, 189 / 255,//C1
        -0.45, -0.8 + h2, 106 / 255, 232 / 255, 245 / 255,//B

        -0.25, -0.8, 78 / 255, 190 / 255, 189 / 255, //C
        -0.45, -0.8 + h2, 106 / 255, 232 / 255, 245 / 255,        //A
        -0.25, -0.8 + h2, 106 / 255, 232 / 255, 245 / 255,        //B
        //3
        -0.1, -0.8, 78 / 255, 190 / 255, 189 / 255,//D1
        0.1, -0.8, 78 / 255, 190 / 255, 189 / 255,//C1
        -0.1, -0.8 + h3, 1.0, 1.0, 1.0,//B1

        0.1, -0.8, 78 / 255, 190 / 255, 189 / 255,
        -0.1, -0.8 + h3, 1.0, 1.0, 1.0,
        0.1, -0.8 + h3, 1.0, 1.0, 1.0,
        //4
        0.25, -0.8, 78 / 255, 190 / 255, 189 / 255,//D1
        0.45, -0.8, 78 / 255, 190 / 255, 189 / 255,//C1
        0.25, -0.8 + h4, 106 / 255, 232 / 255, 245 / 255,//B1

        0.45, -0.8, 78 / 255, 190 / 255, 189 / 255,
        0.25, -0.8 + h4, 106 / 255, 232 / 255, 245 / 255,
        0.45, -0.8 + h4, 106 / 255, 232 / 255, 245 / 255,
        //5
        0.6, -0.8, 78 / 255, 190 / 255, 189 / 255,//D1
        0.8, -0.8, 78 / 255, 190 / 255, 189 / 255,//C1
        0.6, -0.8 + h5, 1.0, 1.0, 1.0,//B1

        0.8, -0.8, 78 / 255, 190 / 255, 189 / 255,
        0.6, -0.8 + h5, 1.0, 1.0, 1.0,
        0.8, -0.8 + h5, 1.0, 1.0, 1.0,

    ]);
    var n = 36; //点的个数

    //创建缓冲区对象
    var vertexColorBuffer = gl.createBuffer();
    if (!vertexColorBuffer) {
        console.log("vertexColorBuffer缓冲区对象创建失败！");
        return -1;
    }

    //将缓冲区对象绑定到目标 gl.ARRAY_BUFFER表示缓冲区对象中包含了顶点的数据
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    //向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('a_Position:获取存储位置失败！');
    }
    //将缓冲区分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
    // 连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('a_PointSize:获取存储位置失败！');
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color);

    //设置<canvas>的背景色
    gl.clearColor(8 / 255, 28 / 255, 68 / 255, backdrop);

    // 清除<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, n);

}

function up1() {
    LENGTH_STEP1 += 0.1;
}
//实现标量减速忽略方向
function down1() {
    if (LENGTH_STEP1 < 0.1) {
    }
    else {
        LENGTH_STEP1 -= 0.1;
    }
    console.log(LENGTH_STEP1);
}
function up2() {
    LENGTH_STEP2 += 0.1;
}
//实现标量减速忽略方向
function down2() {
    if (LENGTH_STEP2 < 0.1) {
    }
    else {
        LENGTH_STEP2 -= 0.1;
    }
    console.log(LENGTH_STEP2);
}
function up3() {
    LENGTH_STEP3 += 0.1;
}
//实现标量减速忽略方向
function down3() {
    if (LENGTH_STEP3 < 0.1) {
    }
    else {
        LENGTH_STEP3 -= 0.1;
    }
    console.log(LENGTH_STEP3);
}
function up4() {
    LENGTH_STEP4 += 0.1;
}
//实现标量减速忽略方向
function down4() {
    if (LENGTH_STEP4 < 0.1) {
    }
    else {
        LENGTH_STEP4 -= 0.1;
    }
    console.log(LENGTH_STEP4);
}
function up5() {
    LENGTH_STEP5 += 0.1;
}
//实现标量减速忽略方向
function down5() {
    if (LENGTH_STEP5 < 0.1) {
    }
    else {
        LENGTH_STEP5 -= 0.1;
    }
    console.log(LENGTH_STEP5);
}
function upbackdrop() {
    backdrop += 0.1;
}
//实现标量减速忽略方向
function downbackdrop() {
    if (backdrop < 0.1) {
    }
    else {
        backdrop -= 0.1;
    }
    console.log(backdrop);
}







