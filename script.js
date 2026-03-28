const canvas = document.getElementById("rain");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== ЗВИЧАЙНІ ЗІРКИ =====
class Star {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = 0.8 + Math.random() * 1.7;
    this.alpha = 0.7 + Math.random() * 0.3;
    this.alphaChange = 0.01 + Math.random() * 0.02;
    this.speedX = (Math.random() * 0.2 - 0.1);
    this.speedY = (Math.random() * 0.2 - 0.1);
  }
  draw() {
    this.alpha += this.alphaChange;
    if (this.alpha <= 0.7 || this.alpha >= 1) this.alphaChange = -this.alphaChange;
    this.x += this.speedX;
    this.y += this.speedY;
    if(this.x < 0) this.x = canvas.width;
    if(this.x > canvas.width) this.x = 0;
    if(this.y < 0) this.y = canvas.height;
    if(this.y > canvas.height) this.y = 0;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${this.alpha.toFixed(2)})`;
    ctx.shadowColor = `rgba(255,255,255,${this.alpha.toFixed(2)})`;
    ctx.shadowBlur = 12;
    ctx.fill();
  }
}

// ===== ПАДАЮЧІ ЗІРКИ =====
class ShootingStar {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height/2;
    this.len = 150 + Math.random()*100;
    this.speed = 10 + Math.random()*5;
    this.angle = Math.PI/4 + (Math.random()*0.2 - 0.1);
    this.alpha = 0.7 + Math.random()*0.3;
    this.trail = [];
    this.maxTrail = 20 + Math.floor(Math.random()*30);
  }
  draw() {
    this.trail.push({x:this.x,y:this.y,alpha:this.alpha});
    if(this.trail.length>this.maxTrail) this.trail.shift();
    for(let i=0;i<this.trail.length;i++){
      const p=this.trail[i];
      ctx.beginPath();
      ctx.arc(p.x,p.y,2,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${(i/this.trail.length)*p.alpha})`;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(this.x,this.y,2,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${this.alpha})`;
    ctx.shadowColor=`rgba(255,255,255,0.8)`;
    ctx.shadowBlur=15;
    ctx.fill();
    this.x+=this.speed*Math.cos(this.angle);
    this.y+=this.speed*Math.sin(this.angle);
    if(this.x>canvas.width+this.len || this.y>canvas.height+this.len) this.reset();
  }
}

// ===== ЧАСТКИ ЗА КУРСОРОМ =====
class MouseParticle {
  constructor(x,y){
    this.x=x;
    this.y=y;
    this.radius=2+Math.random()*2;
    this.alpha=1;
    this.speedX=(Math.random()*2-1);
    this.speedY=(Math.random()*2-1);
    this.fade=0.02+Math.random()*0.02;
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${this.alpha.toFixed(2)})`;
    ctx.fill();
    this.x+=this.speedX;
    this.y+=this.speedY;
    this.alpha-=this.fade;
  }
}

// ===== ІНІЦІАЛІЗАЦІЯ =====
const stars=[]; for(let i=0;i<400;i++) stars.push(new Star());
const shootingStars=[]; for(let i=0;i<6;i++) shootingStars.push(new ShootingStar());
const mouseParticles=[];

let mouseX=0, mouseY=0;
window.addEventListener("mousemove",(e)=>{
  mouseX=e.clientX;
  mouseY=e.clientY;
  for(let i=0;i<2;i++) mouseParticles.push(new MouseParticle(mouseX,mouseY));
});

// ===== АНІМАЦІЯ =====
function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  stars.forEach(s=>s.draw());
  shootingStars.forEach(s=>s.draw());
  for(let i=mouseParticles.length-1;i>=0;i--){
    const p=mouseParticles[i];
    p.draw();
    if(p.alpha<=0) mouseParticles.splice(i,1);
  }
  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize",()=>{
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
});

// ===== TYPING ПО РЯДКАХ =====
const lines = [
  "🎮 Геймер",
  "💻 Кодер-початківець",
  "🌐 Роблю сайти",
  "🛠 Розбираюсь у ПК"
];

let currentLine = 0;
let charIndex = 0;
const typingSpeed = 70;

function typeWriter() {
  const typingElement = document.getElementById("typing");
  if (charIndex < lines[currentLine].length) {
    if (!typingElement.children[currentLine]) {
      const newLine = document.createElement("div");
      newLine.classList.add("typing-line");
      typingElement.appendChild(newLine);
    }
    typingElement.children[currentLine].innerHTML += lines[currentLine].charAt(charIndex);
    charIndex++;
    setTimeout(typeWriter, typingSpeed);
  } else {
    charIndex = 0;
    currentLine++;
    if (currentLine < lines.length) {
      setTimeout(typeWriter, typingSpeed);
    }
  }
}

typeWriter();