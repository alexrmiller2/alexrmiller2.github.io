const ctx = document.getElementById("myCanvas").getContext("2d");
canvas = document.getElementById("myCanvas");

const containerElement = document.body.getElementsByClassName("container")[0];
const containerCoords = containerElement.getBoundingClientRect();

const title = document.body.getElementsByClassName("header")[0].childNodes[1];

let Letters = [];

const gravity = 1000090;
const drag = .01;

let mouse = { x: 0, y: 0 };

canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX - canvas.offsetLeft;
    mouse.y = event.clientY - canvas.offsetTop;
});

class Letter {
    constructor(letter, font, x, y, velx, vely) {
        this.x = x;
        this.y = y;
        this.letter = letter;
        this.rotation = 0;
        this.radius = 1;
        this.velocityX = velx;
        this.velocityY = vely;
        this.font = font;
    }

    update() {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let angle = Math.atan2(dy, dx);

        let ddx = Math.max(-10, Math.min(10, (gravity*Math.cos(angle)/(distance*distance))));
        let ddy = Math.max(-10, Math.min(10,(gravity*Math.sin(angle)/(distance*distance))));

        this.x += (this.velocityX+ddx)*drag;
        this.y += (this.velocityY+ddy)*drag;

        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.velocityY *= -1;
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.velocityY *= -1;
        }
        if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
            this.velocityX *= -1;
        }
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.velocityX *= -1;
        }
        
    }
    
    draw() {
        ctx.save();
        ctx.font = this.font;
        const textMetrics = ctx.measureText(this.letter);
        const centerX = this.x + textMetrics.width / 2;
        const centerY = this.y - textMetrics.actualBoundingBoxAscent / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);
        ctx.fillText(this.letter, -textMetrics.width / 2, textMetrics.actualBoundingBoxAscent / 2);
        ctx.restore();
    }
}

function drawText(element, startX, startY, scaling = 1, lineHeight = 18) {
    let charWidth = 0;
    let currentY = startY;
    ctx.font = window.getComputedStyle(element).font;

    for (let i = 0; i < element.textContent.length; i++) {
        if (element.textContent[i] === '\n') {
            charWidth = -16;
            currentY += lineHeight;
            continue;
        }
        if (i > 0 && element.textContent[i - 1] !== '\n') {
            charWidth += ctx.measureText(element.textContent[i - 1]).width;
        }

        Letters.push(new Letter(element.textContent[i],ctx.font,startX + charWidth * scaling, currentY, 0, 0));
    }
}

// Draw title text
drawText(title, 325, 27, 0.97);

// Draw left list text
const leftListItems = document.querySelectorAll(".left-list li");
leftListItems.forEach((item, index) => {
    drawText(item, 0, 14 + index * 18);
});

// Draw right list text
const rightListItems = document.querySelectorAll(".right-list li");
rightListItems.forEach((item, index) => {
    drawText(item, 639 + index*25, 14 + index * 18);
});

// Draw section title text
const sectionTitles = document.getElementsByClassName("section-title");
for (let i = 0; i < sectionTitles.length; i++) {
    const sectionTitleCoords = sectionTitles[i].getBoundingClientRect();
    drawText(sectionTitles[i], sectionTitleCoords.left - containerCoords.left, sectionTitleCoords.top - containerCoords.top + 19);
}

// Draw left text
const leftElements = document.getElementsByClassName("info-left");
for (let i = 0; i < leftElements.length; i++) {
    const leftRightCoords = leftElements[i].getBoundingClientRect();
    drawText(leftElements[i], leftRightCoords.left - containerCoords.left, leftRightCoords.top - containerCoords.top + 14, 0.997);
}

// Draw right text
const rightElements = document.getElementsByClassName("info-right");
for (let i = 0; i < rightElements.length; i++) {
    const leftRightCoords = rightElements[i].getBoundingClientRect();
    drawText(rightElements[i], leftRightCoords.left - containerCoords.left, leftRightCoords.top - containerCoords.top + 14);
}

// Draw bottom list text
const bottomListElements = document.getElementsByClassName("bullet");
for (let i = 0; i < bottomListElements.length; i++) {
    const bottomListCoords = bottomListElements[i].getBoundingClientRect();

    Letters.push(new Letter("• ", ctx.font, bottomListCoords.left - containerCoords.left - 10,bottomListCoords.top - containerCoords.top+14, 0, 0));
    drawText(bottomListElements[i], bottomListCoords.left - containerCoords.left , bottomListCoords.top - containerCoords.top + 14, 0.998);
}

function update() {
    Letters.forEach(letter => letter.update());
}

function draw() {
    ctx.clearRect(0, 0, 800, 2000);
    Letters.forEach(letter => letter.draw());
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();

