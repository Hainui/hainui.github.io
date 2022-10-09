// SierpinskiGasketwithColor.js
// 顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    'gl_Position = a_Position;\n' + //设置坐标

    'gl_PointSize = 2.0;\n' + //设置尺寸
    '}\n';

// 片元着色器程序
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main() {\n' +
    'gl_FragColor = u_FragColor;\n' + //设置颜色
    '}\n';
var A = [-1.0, 0.0,0.5], B = [1.0,0.0,0.5], C = [0.0,0.0,-0.5],D=[0.0,1.0,0.0];
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
    //定义点的个数
    var nums = prompt("请输入点的个数:");
    // var nums = 10000;
    var xy=[-1.0, 0.0,0.5];
    //获取待绘制点坐标
    var vertices = ProducePoints(nums,xy);
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

    //获取uniform变量的存储位置
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    console.log(u_FragColor);
    if (!u_FragColor) {
        console.log("u_FragColor:获取u_FragColor失败");
        return;
    }

    var r,g,b;
    for(var i=0;i<vertices.length/3;i++){
        r=(1+vertices[i*3])/2;
        g=(1+vertices[i*3+1])/2;
        b=(1+vertices[i*3+2])/2;
        // 顶点颜色传输给uniform变量
        gl.uniform4f(u_FragColor, r, g, b, 1.0);
        //绘制点
        gl.drawArrays(gl.POINTS, i, i+1);
    }
}

//生成点坐标
var p = [];
function ProducePoints(nums,xy) {
    if (nums <= 0) {
        return new Float32Array([]);

    } else if (nums != 0) {
        for (var i = 0; i < nums; i++) {
            var random = getRandomIntInclusive(1, 4);
            switch (random) {
                case 1:
                    x = (A[0] + xy[0]) / 2, y = (A[1] + xy[1]) / 2,
                    z=(A[2]+xy[2])/2;
                    break;
                case 2:
                    x = (B[0] + xy[0]) / 2, y = (B[1] + xy[1]) / 2,
                    z=(B[2]+xy[2])/2;
                    break;
                case 3:
                    x = (C[0] + xy[0]) / 2, y = (C[1] + xy[1]) / 2,
                    z=(C[2]+xy[2])/2;
                    break;
                case 4:
                    x = (D[0] + xy[0]) / 2, y = (D[1] + xy[1]) / 2,
                    z=(D[2]+xy[2])/2;
                    break;
            }
            p.push(x), p.push(y),p.push(z);
            xy[0]=x,xy[1]=y,xy[2]=z;
            
        }
    }
    return new Float32Array(p);
}

function initVertexBuffers(gl, vertices) {
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
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
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





