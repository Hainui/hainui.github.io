// HelloTriangle_FragCoord.js
// 顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main() {\n' +
    '   gl_Position = a_Position;\n' +
    '} \n';

// 片元着色器程序
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform float u_Width;\n' +
    'uniform float u_Height;\n' +
    'void main() {\n' +
    'gl_FragColor = vec4(gl_FragCoord.x/u_Width,0.5,gl_FragCoord.y/u_Height,1.0);\n' + //设置颜色
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


    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log("顶点位置设置失败！")
        return;
    }

    var u_Height = gl.getUniformLocation(gl.program, 'u_Height');
    if (!u_Height) {
        console.log("u_Height:获取u_Height失败");
        return;
    }

    gl.uniform1f(u_Height, gl.drawingBufferHeight);
    var u_Width = gl.getUniformLocation(gl.program, 'u_Width');
    if (!u_Width) {
        console.log("u_Width:获取u_Width失败");
        return;
    }

    gl.uniform1f(u_Width, gl.drawingBuffeWidth);


    //设置<canvas>的背景色
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制三个点
    gl.drawArrays(gl.TRIANGLES, 0, n); //n = 3

}

function initVertexBuffers(gl) {
    var vertices = new Float32Array(
        [0.0, 0.5, -0.5, -0.5, 0.5, -0.5]
    );
    var n = 3; //点的个数

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




