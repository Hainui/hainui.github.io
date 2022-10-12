// HelloTriangle.js
// 顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main() {\n' +
    '   gl_Position = a_Position;\n' +
    // 'gl_PointSize = a_PointSize;\n' +
    '} \n';

// 片元着色器程序
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main() {\n' +
    'gl_FragColor = u_FragColor;\n' + //设置颜色
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
    //获取attribute变量的存储位置
    // var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    //获取uniform变量的存储位置
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    console.log(u_FragColor);

    if (!u_FragColor) {
        console.log("u_FragColor:获取u_FragColor失败");
        return;
    }

    //注册鼠标点击事件响应函数
    // canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position,u_FragColor); };
    //设置顶点的位置
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log("顶点位置设置失败！")
        return;
    }


    // 将顶点的位置传输给attribute变量
    // gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);//传入三个值，第四个分量默认为1.0
    // 将顶点的大小传输给attribute变量
    // gl.vertexAttrib1f(a_PointSize, 6.0);
    // 顶点颜色传输给uniform变量
    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);


    //设置<canvas>的背景色
    gl.clearColor(0.7, 0.0, 0.0, 0.7);

    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制三个点
    gl.drawArrays(gl.TRIANGLES, 0, n); //n = 3

}

function initVertexBuffers(gl) {
    var vertices = new Float32Array(
        [
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
        ]
    );
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




