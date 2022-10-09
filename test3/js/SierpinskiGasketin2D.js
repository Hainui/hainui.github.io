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

    //获取uniform变量的存储位置
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    console.log(u_FragColor);

    if (!u_FragColor) {
        console.log("u_FragColor:获取u_FragColor失败");
        return;
    }
    var level = prompt("请输入leve:");
    var A = [-1.0, 0.0], B = [0.0, 1.0], C = [1.0, 0.0];
    //获取三角形四等分点 9个坐标
    var vertice = TrianglDivision(A,B,C,level);
    console.log(vertice);

    var vertices = new Float32Array(vertice);

    //设置顶点的位置
    var n = initVertexBuffers(gl, vertices);
    if (n < 0) {
        console.log("顶点位置设置失败！")
        return;
    }

    // 顶点颜色传输给uniform变量
    gl.uniform4f(u_FragColor, 0.6, 0.5, 0.4, 1.0);


    //设置<canvas>的背景色
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    console.log("pow"+3*Math.pow(3,level));
    //绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, 3*Math.pow(3,level)); //

}

function initVertexBuffers(gl, vertices) {
    // var vertices = new Float32Array([
    //     0.0, -1.0, 
    //     1.0, -1.0, 
    //     0.5, Math.sqrt(3)/2-1
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
function TrianglDivision(A, B, C, level) {
    var p = [A[0], A[1], B[0], B[1], C[0], C[1]];
    if (level == 0) return new Float32Array(p);
    for (var i = 0; i < level; i++) {
        p = TrianglDivisionN_N1(p);
        console.log(p);
    }
    return new Float32Array(p);
}
//将一个三角形四等分
function TrianglDivision4(A, B, C) {
    var p = [];
    p.push(A[0]), p.push(A[1]);
    p.push((A[0] + B[0]) / 2), p.push((A[1] + B[1]) / 2);
    p.push((A[0] + C[0]) / 2), p.push((A[1] + C[1]) / 2);

    p.push((A[0] + B[0]) / 2), p.push((A[1] + B[1]) / 2);
    p.push(B[0]), p.push(B[1]);
    p.push((B[0] + C[0]) / 2), p.push((B[1] + C[1]) / 2);

    p.push((A[0] + C[0]) / 2), p.push((A[1] + C[1]) / 2);
    p.push((B[0] + C[0]) / 2), p.push((B[1] + C[1]) / 2);
    p.push(C[0]), p.push(C[1]);
    return p;
}
//传入level=n返回level=n+1
function TrianglDivisionN_N1(p) {
    var cnt = p.length / 6;//传入的三角形个数
    console.log(cnt);
    var num = 0;
    var q = [], p1 = [], p2 = [], p3 = [];
    for (var i = 0; i < cnt; i++) {
        p1 = [p[num * 6], p[num * 6 + 1]];
        // console.log(p1);
        p2 = [p[num * 6 + 2], p[num * 6 + 3]];
        // console.log(p2);
        p3 = [p[num * 6 + 4], p[num * 6 + 5]];
        // console.log(p3);
        q = [].concat(TrianglDivision4(p1, p2, p3), q);
        // console.log(q);
        num++;
    }
    return q;
}





