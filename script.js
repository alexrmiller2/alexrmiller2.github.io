const ctx = document.getElementById("myCanvas").getContext("2d");

const containerElement = document.body.getElementsByClassName("container")[0];
const containerCoords = containerElement.getBoundingClientRect();

const title = document.body.getElementsByClassName("header")[0].childNodes[1];

class Letter {
    constructor(letter, x, y) {
        this.x = x;
        this.y = y;
        this.letter = letter;
        this.rotation = 0;
        this.radius = 1;
        this.velx = 0;
        this.vely = 0;
    }
    
    draw() {
        ctx.save();
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

        let l = new Letter(element.textContent[i],startX + charWidth * scaling, currentY);
        l.draw();
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

    let bullet = new Letter("• ", bottomListCoords.left - containerCoords.left - 10,bottomListCoords.top - containerCoords.top+14)
    bullet.draw()
    drawText(bottomListElements[i], bottomListCoords.left - containerCoords.left , bottomListCoords.top - containerCoords.top + 14, 0.998);
}


