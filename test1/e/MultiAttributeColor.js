// RotatedTriangles_Matrix4.js
// 顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +// varying变量
    'void main() {\n' +
    '   gl_Position = a_Position;\n' +
    '   gl_PointSize = 20.0;\n' +
    ' v_Color = a_Color;\n' + // 将数据传给片元着色器
    '} \n';

// 片元着色器程序
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '   gl_FragColor = v_Color;\n' + //从顶点着色器接收数据
    '}\n';



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
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    //设置顶点的位置
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log("顶点位置设置失败！");
        return;
    }
    gl.clear(gl.COLOR_BUFFER_BIT);
    // 绘制三个点
    gl.drawArrays(gl.TRIANGLES, 0, n);

}


function initVertexBuffers(gl) {
    // var vertices = new Float32Array([
    //     0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    // ]);
    // var n = 3; //点的个数

    // var sizes = new Float32Array([
    //     10.0, 20.0, 30.0//点的尺寸
    // ]);

    var verticesColors = new Float32Array([
        // 顶点坐标和颜色
        0.0, 0.5, 0.0, 0.0, 1.0,//第一个点
        -0.5, -0.5, 1.0, 0.0, 0.0,//第二个点
        0.5, -0.5, 0.0, 1.0, 0.0,//第三个点
    ]);

    var n = 3;

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

    return n;
}









