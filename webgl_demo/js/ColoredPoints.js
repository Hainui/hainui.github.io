// ColoredPoints.js
// 顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main() {\n' +
    '   gl_Position = a_Position;\n' +
    'gl_PointSize = a_PointSize;\n' +
    '} \n';

// 片元着色器程序
var FSHADER_SOURCE =
    'precision mediump float;\n'+
    'uniform vec4 u_FragColor;\n'+
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
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    //获取uniform变量的存储位置
    var u_FragColor = gl.getUniformLocation(gl.program,'u_FragColor');
    console.log(a_Position);
    console.log(a_PointSize);
    console.log(u_FragColor);

    if (a_Position < 0) {
        console.log("a_Position:获取a_Position地址失败");
        return;
    }
    if (a_PointSize < 0) {
        console.log("a_PointSize:获取a_PointSize失败");
        return;
    }
    if (u_FragColor < 0) {
        console.log("u_FragColor:获取u_FragColor失败");
        return;
    }
    
    //注册鼠标点击事件响应函数
    canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position,u_FragColor); };

    // 将顶点的位置传输给attribute变量
    // gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);//传入三个值，第四个分量默认为1.0
    // 将顶点的大小传输给attribute变量
    gl.vertexAttrib1f(a_PointSize, 15.0);


    //设置<canvas>的背景色
    gl.clearColor(0.5, 0.5, 0.0, 1.0);

    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

}

var g_points = []; //鼠标点击位置数组
var g_colors = []; //存储颜色的数组
function click(ev, gl, canvas, a_Position,u_FragColor) {
    var x = ev.clientX; //鼠标点击处的x坐标
    var y = ev.clientY; //鼠标点击处的y坐标
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    // 将坐标存储到g_points数组中
    // g_points.push(x); g_points.push(y);
    g_points.push([x,y]);

    // 将点的颜色存储到g_points数组中
    if(x>=0.0&&y>=0.0){                 // 第二象限
        g_colors.push([0.32,0.84,1.0,1.0])
    }else if(x<0.0&&y<0.0){             // 第三象限
        g_colors.push([0.9,0.5,0.5,1.0])
    }else if(x>=0.0&&y<=0.0){           //第四象限
        g_colors.push([0.5,0.0,1.0,1.0])
    }else{                              //第一象限
        g_colors.push([1.0,1.0,1.0,1.0])
    }

    //清除<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    // for (var i = 0; i < len; i += 2) {
    //     // 将点的位置传递到变量中a_Position
    //     gl.vertexAttrib3f(a_Position, g_points[i], g_points[i + 1], 0.0);

    //     // 绘制点
    //     gl.drawArrays(gl.POINTS, 0, 1);
    // }
    //优化：
    var xy;
    var rgba;
    for(var i =0;i<len;i++){
        xy = g_points[i];
        rgba=g_colors[i];
        //传递点的位置
        gl.vertexAttrib2f(a_Position,xy[0],xy[1]);
        //传递点的颜色
        gl.uniform4f(u_FragColor,rgba[0],rgba[1],rgba[2],rgba[3]);

        //绘制点
        gl.drawArrays(gl.POINTS,0,1);
    }
}




