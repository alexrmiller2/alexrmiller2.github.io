const ctx = document.getElementById("myCanvas").getContext("2d");

const nodeList = document.body.childNodes;

const containerElement = document.body.getElementsByClassName("container")[0];
const containerCoords = containerElement.getBoundingClientRect();

for (let i = 0; i < nodeList.length; i++) {
    console.log(nodeList[i]);
}

ctx.font = "30px serif";
ctx.fillText(containerCoords.x, 0, 50);