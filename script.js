const canvas=document.getElementById('myCanvas')
const ctx=canvas.getContext('2d')
const chartCanvas=document.getElementById('chartCanvas')
const chartCtx=chartCanvas.getContext('2d')

canvas.width=window.innerWidth
canvas.height=window.innerHeight/1.5
chartCanvas.width=window.innerWidth
chartCanvas.height=window.innerHeight/5

const offset={
    x: canvas.width/2,
    y: canvas.height/2
}
const chartOffset={
    x: chartCanvas.width/2,
    y: chartCanvas.height/2
}

let theta=0
let auto=false
const c=220

let mouseX=0

const A={x:0, y:0}
const B={x:Math.cos(theta)*c, y:Math.sin(theta)*c}
const C={x:B.x, y:0}

ctx.translate(offset.x, offset.y)
chartCtx.translate(chartOffset.x, chartOffset.y)

drawCoordinateSystem(chartCtx, chartOffset)

update()
document.onwheel=(event)=>{


    if(!auto){
        theta+=toRad(Math.sign(event.deltaY))
        B.x=Math.cos(theta)*c
        B.y=Math.sin(theta)*c
    
        C.x=B.x
    
    }    
}

document.onmousemove=(event)=>{
    mouseX=event.x-offset.x
}

function update(){
    console.log(mouseX)
    if(auto){
        if(mouseX<0){
            theta-=toRad(1)
        }else{
            theta+=toRad(1)
        }
        B.x=Math.cos(theta)*c
        B.y=Math.sin(theta)*c
    
        C.x=B.x
    } 
    // const c=distance(A,B)
    // const b=distance(A,C)
    // const a=distance(C,B)

    const sin=Math.sin(theta)
    const cos=Math.cos(theta)
    const tan=Math.tan(theta)

    const T={
        x:Math.sign(cos)*Math.hypot(1,tan)*c,
        y:0
    }

    ctx.clearRect(-offset.x, -offset.y, canvas.width, canvas.height)

    drawCoordinateSystem(ctx, offset)

    drawText(
        "sin(θ) = "+sin.toFixed(2),
        {x:-offset.x/1.1, y:offset.y*0.7},
        "red"
    )

    drawText(
        "cos(θ) = "+cos.toFixed(2),
        {x:-offset.x/1.1, y:offset.y*0.8},
        "blue"
    )

    drawText(
        "tan(θ) = "+tan.toFixed(2),
        {x:-offset.x/1.1, y:offset.y*0.9},
        "green"
    )

    
    drawText(
        "θ = "+-theta.toFixed(2)+" rad"+"("+-Math.round(toDeg(theta))+"°)",
        {x:-offset.x/1.12, y:offset.y*0.6}
    )

    drawLine(A,B)
    drawText("1", average(A,B))
    drawLine(A,C,"blue")
    drawText("cos", average(A,C), "blue")
    drawLine(B,C, "red")
    drawText("sin", average(C,B), "red")
    drawLine(B,T,"green")
    drawText("tan", average(B,T),"green")

    drawText("θ",A)

    ctx.beginPath()
    ctx.strokeStyle="black"
    ctx.lineWidth=3
    ctx.arc(0,0,c,0,theta,theta<0)

    ctx.stroke()

    const chartScaler=chartOffset.y
    drawPoint({
        x:-theta*chartScaler,
        y:sin*chartScaler
    },4,"red")
    drawPoint({
        x:-theta*chartScaler,
        y:cos*chartScaler
    },4,"blue")
    drawPoint({
        x:-theta*chartScaler,
        y:tan*chartScaler
    },4,"green")

    requestAnimationFrame(update)
}

function toDeg(rad){
    return rad*180/Math.PI
}

function toRad(deg){
    return deg*Math.PI/180
}

function average(p1, p2){
    return{
        x: (p1.x+p2.x)/2,
        y: (p1.y+p2.y)/2

    }
}

function distance(p1, p2){
    return Math.hypot(p1.x-p2.x, p1.y-p2.y)
}


function drawText(text, loc, color='black'){
    ctx.beginPath()
    ctx.fillStyle=color
    ctx.textAlign='center'
    ctx.textBaseline='middle'
    ctx.font='bold 18px Courier'
    ctx.strokeStyle='white'
    ctx.lineWidth=7
    ctx.strokeText(text, loc.x, loc.y)
    ctx.fillText(text, loc.x,loc.y)
}

function drawPoint(loc, size=20, color="black"){
    chartCtx.beginPath()
    chartCtx.fillStyle=color
    chartCtx.arc(loc.x, loc.y, size/2, 0, Math.PI*2)
    chartCtx.fill()
}

function drawLine(p1, p2, color='black'){
    ctx.beginPath()
    ctx.strokeStyle=color
    ctx.lineWidth=2
    ctx.setLineDash([0,0])
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()

}

function drawCoordinateSystem(ctx, offset){
    ctx.beginPath()
    ctx.moveTo(-offset.x,0)
    ctx.lineTo(canvas.width-offset.x,0)
    ctx.moveTo(0,-offset.y)
    ctx.lineTo(0,canvas.height-offset.y)
    ctx.setLineDash([4,2])
    ctx.lineWidth=1
    ctx.strokeStyle='gray'
    ctx.stroke()
}

window.addEventListener("keypress", function(e){
    if(e.key==" "){
        if (auto) {
            auto=false
        } else {
            auto=true
        }
    }

})
