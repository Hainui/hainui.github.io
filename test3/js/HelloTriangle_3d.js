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
    // 顶点颜色传输给uniform变量
    gl.uniform4f(u_FragColor, 0.6, 0.5, 0.4, 1.0);
    var A = [-1.0, -0.75, 0.0], B = [0.0, 1.0, 0.0], C = [1.0, -0.75, 0.0], D = [0.0, 0.0, 1.0];
    var level = prompt("请输入level:");
    // var level = 1;
    //获取三角形四等分点 9个坐标
    var p = TrianglDivision(A, B, C, D, level);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (var i = 0; i < p.length / 12; i++) {
        var a = [p[i * 12], p[i * 12 + 1], p[i * 12 + 2]];
        var b = [p[i * 12 + 3], p[i * 12 + 4], p[i * 12 + 5]];
        var c = [p[i * 12 + 6], p[i * 12 + 7], p[i * 12 + 8]];
        var d = [p[i * 12 + 9], p[i * 12 + 10], p[i * 12 + 11]];
        drawTetrahedron(a, b, c, d, gl);
    }

}
function TrianglDivision(A, B, C, D, level) {
    var p = [A[0], A[1], A[2], B[0], B[1], B[2], C[0], C[1], C[2], D[0], D[1], D[2]];
    if (level == 0) return new Float32Array(p);
    for (var i = 0; i < level; i++) {
        p = TrianglDivisionN_N1(p);
        console.log(p);
    }
    return p;
}
//将一个三角形四等分
function TrianglDivision4(A, B, C, D) {
    var p = [];
    p.push(A[0]), p.push(A[1]), p.push(A[2]);
    p.push((A[0] + B[0]) / 2), p.push((A[1] + B[1]) / 2), p.push((A[2] + B[2]) / 2);
    p.push((A[0] + C[0]) / 2), p.push((A[1] + C[1]) / 2), p.push((A[2] + C[2]) / 2);
    p.push((A[0] + D[0]) / 2), p.push((A[1] + D[1]) / 2), p.push((A[2] + D[2]) / 2);

    p.push((A[0] + B[0]) / 2), p.push((A[1] + B[1]) / 2), p.push((A[2] + B[2]) / 2);
    p.push(B[0]), p.push(B[1]), p.push(B[2]);
    p.push((B[0] + C[0]) / 2), p.push((B[1] + C[1]) / 2), p.push((B[2] + C[2]) / 2);
    p.push((B[0] + D[0]) / 2), p.push((B[1] + D[1]) / 2), p.push((B[2] + D[2]) / 2);

    p.push((A[0] + C[0]) / 2), p.push((A[1] + C[1]) / 2), p.push((A[2] + C[2]) / 2);
    p.push((B[0] + C[0]) / 2), p.push((B[1] + C[1]) / 2), p.push((B[2] + C[2]) / 2);
    p.push(C[0]), p.push(C[1]), p.push(C[2]);
    p.push((C[0] + D[0]) / 2), p.push((C[1] + D[1]) / 2), p.push((C[2] + D[2]) / 2);

    p.push((A[0] + D[0]) / 2), p.push((A[1] + D[1]) / 2), p.push((A[2] + D[2]) / 2);
    p.push((B[0] + D[0]) / 2), p.push((B[1] + D[1]) / 2), p.push((B[2] + D[2]) / 2);
    p.push((C[0] + D[0]) / 2), p.push((C[1] + D[1]) / 2), p.push((C[2] + D[2]) / 2);
    p.push(D[0]), p.push(D[1]), p.push(D[2]);
    return p;
}
//传入level=n返回level=n+1
function TrianglDivisionN_N1(p) {
    var cnt = p.length / 12;//传入的三角形个数
    console.log(cnt);
    var q = [], p1 = [], p2 = [], p3 = [], p4 = [];
    for (var i = 0; i < cnt; i++) {
        p1 = [p[i * 12], p[i * 12 + 1], p[i * 12 + 2]];
        // console.log(p1);
        p2 = [p[i * 12 + 3], p[i * 12 + 4], p[i * 12 + 5]];
        // console.log(p2);
        p3 = [p[i * 12 + 6], p[i * 12 + 7], p[i * 12 + 8]];
        p4 = [p[i * 12 + 9], p[i * 12 + 10], p[i * 12 + 11]];
        // console.log(p3);
        q = q.concat(TrianglDivision4(p1, p2, p3, p4));
        // console.log(q);
    }
    return q;
}

function drawTetrahedron(A, B, C, D, gl) {
    var vertice = new Float32Array([
        A[0], A[1], A[2],
        B[0], B[1], B[2],
        D[0], D[1], D[2],

        A[0], A[1], A[2],
        C[0], C[1], C[2],
        D[0], D[1], D[2],

        B[0], B[1], B[2],
        C[0], C[1], C[2],
        D[0], D[1], D[2],
    ]);
    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("缓冲区对象创建失败！");
        return -1;
    }
    //将缓冲区对象绑定到目标 gl.ARRAY_BUFFER表示缓冲区对象中包含了顶点的数据
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertice, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('a_Position:获取存储位置失败！');
    }
    //将缓冲区分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    // 连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);
    //获取uniform变量的存储位置
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    console.log(u_FragColor);
    if (!u_FragColor) {
        console.log("u_FragColor:获取u_FragColor失败");
        return;
    }
    // 绘制第一个三角形
    // 顶点颜色传输给uniform变量
    gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    // 绘制第二个三角形
    // 顶点颜色传输给uniform变量
    gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, 3, 3);
    // 绘制第三个三角形
    // 顶点颜色传输给uniform变量
    gl.uniform4f(u_FragColor, 0.0, 0.0, 1.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, 6, 3);
}





