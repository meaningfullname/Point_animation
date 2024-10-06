"use strict";

let c, ctx, W, H;
let touchx,touchy;
let camera, e;
let points = [];
let move = false;
let mouse = {x: 0, y: 0};

const random = (max=1, min=0) => Math.random() * (max - min) + min;

const clear = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, W, H);
};

class Point {
    constructor(x, y, z, a, s, c){
        this.x = x;
        this.y = y;
        this.z = z;
        this.a = a;
        this.rad = 150;
        this.size = s;
    }
    projection(){
        this.dx = this.x + this.rad*Math.cos(this.a) - camera.x;
        this.dy = this.y + this.rad*Math.sin(this.a) - camera.y;
        this.dz = this.z - camera.z;
        this.bx = e.z * this.dx/this.dz + e.x;
        this.by = e.z * this.dy/this.dz + e.y;
        return [this.bx+W/2, this.by+H/2];
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(...this.projection(), this.size*(100/this.dz ), 0, Math.PI*2);
        ctx.fill();
    }
    update() {
        this.a += 0.01;
        this.z -= 0.07;
        this.rad += 0.5*Math.cos(this.z/2) * checkBox(this.a);
        this.color = 'hsl(' + (this.z+200)  + ', 100%, 50%)';
        this.draw();
    }
}

const touchStart = (e)=> {
    touchx = e.touches[0].pageX;
    touchy = e.touches[0].pageY;
};

const touchMove = (e)=> {
    camera.x += 2*(e.touches[0].pageX-touchx);
    touchx = e.touches[0].pageX;
    camera.y += 2*(e.touches[0].pageY-touchy);
    touchy = e.touches[0].pageY;
};

const getPos = (i) => {
    let posX = W;
    let posY = H;
    let posZ = i / 7;
    let angle = i;
    let size = 0.2;
    return [posX, posY, posZ, angle, size];
};

const checkBox = (a) => {
    if(document.getElementById("boom").checked){
        checkboxes.style.display = 'none'
        return Math.tan(a)*3
    }
    else return 1;
};

const init = () => {
    c = document.getElementById("canvas");
    c.width = W = window.innerWidth;
    c.height = H = window.innerHeight;
    ctx = c.getContext("2d");

    camera = new Point(W, H*1.5, -1);
    e = new Point(0,0,-5);
    for(let i=100; i<400; i+=0.1)points.push(new Point(...getPos(i)));

    c.addEventListener("touchstart",touchStart,{passive:false});
    c.addEventListener("touchmove",touchMove,{passive:false});
    c.addEventListener("mousemove", function(e){
        if(move){
            camera.x += 2*(e.clientX-mouse.x);
            camera.y += 2*(e.clientY-mouse.y);
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }
    });
    c.addEventListener("mousedown", function(e){
        move=true;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    c.addEventListener("mouseup", function(){move=false});

    animate();
};


const animate = () => {
    clear();
    for(var i = points.length - 1; i >= 0; i--){
        points[i].update();
        if(points[i].z<0){
            points[i].z = 42
            points.push(points.shift());
        }
    }
    window.requestAnimationFrame(animate);
};

window.onload = init;