let canvasX = 400;
let canvasY = 400;

function setup(){
    createCanvas(canvasX,canvasY);
}
 
class Vec2 {
    constructor(_x, _y){
        this.x = _x;
        this.y = _y;
    }

    add(b){
        let a = this;
        return new Vec2(a.x+b.x, a.y+b.y);
    }

    mul(s){
        let a = this;
        return new Vec2(s*a.x, s*a.y);
    }
    
    mag(){
        let a = this;
        return sqrt(a.x**2 + a.y**2);
    }

    sub(b){
        let a = this;
        return new Vec2(a.x-b.x, a.y-b.y);
    }

    norm(){
        let a = this;
        return a.mul(1/a.mag());
    }

    dot(b){
        let a = this;
        return a.x*b.x + a.y*b.y;
    }

    reflect(w){
        let v = this;
        let cosTheta = v.mul(-1).dot(w)/(v.mul(-1).mag()*w.mag());
        let n = w.norm().mul(v.mag()*cosTheta);
        let r = v.add(n.mul(2));
        return r;
    }

}


function Vec2Add(a,b){
    return new Vec2(a.x+b.x, a.y+b.y);
}
    
function Vec2Mul(a,s){
    return new Vec2(s*a.x, s*a.y);
}

class Ball {
    constructor(_p, _v, _r){
        this.p = _p;
        this.v = _v;
        this.r = _r;
    }
}

class Block {
    constructor(_p, _r){
        this.p = _p;
        this.r = _r;
    }
}

class Paddle {
    constructor(_p, _r) {
        this.p = _p;
        this.r = _r;
    }
}

let ballP = new Vec2(30,30);
let ballV = new Vec2(200,100);
let ballR = 15;
let ball = new Ball(ballP,ballV,ballR);


let blockR = 15;
let blocks = [];
for (let i=0; i<30; i=i+1){
    let p = new Vec2(45+15*(1+2*(i%10)),15*(1+2*(Math.floor(i/10))));
    blocks.push(new Block(p, blockR));
}

let paddleP = new Vec2(200,320);
let paddleR = 30;

let paddle = new Paddle(paddleP,paddleR);

function draw(){

    ball.p = ball.p.add(ball.v.mul(1/60));

    if (abs(ball.p.x - canvasX/2) > (canvasX/2 - ball.r-1)){
        ball.v.x = -ball.v.x;    
    }

    if (abs(ball.p.y - canvasY/2) > (canvasY/2 - ball.r-1)){
        ball.v.y = -ball.v.y;    
    }

    if (ball.p.x > canvasX){
        ball.p.x = canvasX - 2*ball.r;    
    }
    if (ball.p.y > canvasY){
        ball.p.y = canvasY - 2*ball.r;    
    }
    if (ball.p.x < 0){
        ball.p.x = 2*ball.r;    
    }
    if (ball.p.y < 0){
        ball.p.y = 2*ball.r;    
    }


    for (let block of blocks){
        let d = ball.p.sub(block.p).mag();
        if (d < (ball.r + block.r)){
            let w = ball.p.sub(block.p);
            ball.v = ball.v.reflect(w);
            blocks.splice(blocks.indexOf(block),1);
        }
    }   

    paddle.p.x = max(paddle.r+1,min(canvasX-paddle.r-1,mouseX));

    background(220);
    circle(ball.p.x, ball.p.y, 2*ball.r);
    for (let block of blocks){
        circle(block.p.x, block.p.y, 2*block.r);
    }

    let d = ball.p.sub(paddle.p).mag();
    if (d < (ball.r + paddle.r)){
        let w = ball.p.sub(paddle.p);
        ball.v = ball.v.reflect(w);
        ball.p = paddle.p.add(w.norm().mul(ball.r+paddle.r));
    }    
    circle(paddle.p.x,paddle.p.y,2*paddle.r);
}
