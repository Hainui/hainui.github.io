// HelloPoint1.js
// 顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    'gl_Position = a_Position;\n' + //设置坐标
    'gl_PointSize = 2.0;\n' + //设置尺寸
    '}\n';

// 片元着色器程序
var FSHADER_SOURCE =
    'void main() {\n' +
    'gl_FragColor = vec4(1.0,0.0,0.5,1.0);\n' + //设置颜色
    '}\n';
var A = [-1, -1], B = [1, -1], C = [0, Math.sqrt(3.0) - 1];
var xy;
function main() {
    // 获取<canvas>元素
    var canvas = document.getElementById('webgl');

    //获取WebGL绘图上下文
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    //初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }
    var x, y, random;
    r1 = Math.random();//[0,1)
    r2 = Math.random();//[0,1)
    x = (1 - Math.sqrt(r1)) * A[0] + (Math.sqrt(r1) * (1 - r2)) * B[0] + r2 * Math.sqrt(r1) * C[0];
    y = (1 - Math.sqrt(r1)) * A[1] + (Math.sqrt(r1) * (1 - r2)) * B[1] + r2 * Math.sqrt(r1) * C[1];
    xy = [x, y];
    //定义点的个数
    var nums = prompt("请输入点的个数:");
    //获取待绘制点坐标
    var vertices = ProducePoints(nums);
    //将数组中的点写入顶点缓冲区
    var n = initVertexBuffers(gl, vertices);
    if (n < 0) {
        console.log("顶点位置设置失败！")
        return;
    }

    //设置<canvas>的背景色
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制点
    gl.drawArrays(gl.POINTS, 0, nums);


}

//生成点坐标
var p = [];
function ProducePoints(nums) {
    if (nums <= 0) {
        return new Float32Array([]);

    } else if (nums != 0) {
        for (var i = 0; i < nums; i++) {
            var random = getRandomIntInclusive(1, 3);
            switch (random) {
                case 1:
                    x = (A[0] + xy[0]) / 2, y = (A[1] + xy[1]) / 2;
                    break;
                case 2:
                    x = (B[0] + xy[0]) / 2, y = (B[1] + xy[1]) / 2;
                    break;
                case 3:
                    x = (C[0] + xy[0]) / 2, y = (C[1] + xy[1]) / 2;
                    break;
            }
            p.push(x), p.push(y);
            xy[0]=x,xy[1]=y;
        }
    }
    return new Float32Array(p);
}

function initVertexBuffers(gl, vertices) {
    // var vertices = new Float32Array([
    //     -0.5, 1.0,
    //     -1.0, 0.0,
    //     0.0, 0.0,
    //     0.0, 0.0,
    //     1.0, 0.0,
    //     0.0, -1.0,
    //     1.0, -1.0
    // ]);
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
//随机获取包括两个值之间的整数（包括两个值）
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}





