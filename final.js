
var interval
var interval2
var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d');
var blockSize = 25
var blockCount = 25
var snack
var apple
var score = 0
var second = 0
var minutes = 00
var speed = 15
var once = 0//used in the speed setting(the speed just add one time when reaching certain size)
var checkPoint = 0;// used in the function, player can just press one key in one frame
var audio1
var audio2
var audio3
var audio4
var state = 'u'//to set the rotation of snack head
var bodyColor = '#9ddcb1'
var imgEat = new Image();// load image
imgEat.src = "./image/apple.png";
var imgHead = new Image();
imgHead.src = "./image/snackHead.png";
var checkTheSpeed=0// used to check whether the frame number match specific number, used in rontine() 

function returnToMenu() {
    audio4.play()
    document.getElementById('deadText').style.visibility = 'hidden';
    document.getElementById('startButton').style.visibility = 'hidden';
    document.getElementById('returnDiv').style.visibility = 'hidden';
    document.getElementById('initialButton').style.visibility = 'visible';
    document.getElementById('settingButton').style.visibility = 'visible';
}
function changeBodyColor() {
    audio4.play()
    var gets = document.getElementsByName('color');
    for (var g = 0; g < gets.length; g++) {
        if (gets[g].checked) {
            bodyColor = gets[g].value
            alert('You choose your body color:  ' + gets[g].value)
            document.getElementById('initialButton').style.visibility = 'visible';
            document.getElementById('settingButton').style.visibility = 'visible';
            document.getElementById('settingDiv').style.visibility = 'hidden';
        }
    }
}
function settingButton() {
    audio4.play()
    document.getElementById('initialButton').style.visibility = 'hidden';
    document.getElementById('settingButton').style.visibility = 'hidden';
    document.getElementById('settingDiv').style.visibility = 'visible';
}


function initialButton() {
    audio4.play()
    document.getElementById('deadText').style.visibility = 'hidden';
    document.getElementById('startButton').style.visibility = 'hidden';
    document.getElementById('returnDiv').style.visibility = 'hidden';
    document.getElementById('initialButton').style.visibility = 'hidden';
    document.getElementById('settingButton').style.visibility = 'hidden';
    document.getElementById('canvas').style.visibility = 'visible';
    document.getElementById('score').style.visibility = 'visible';
    document.getElementById('score2').style.visibility = 'visible';
    gameStart()
}


function gameOff() {// game off
    audio1.pause();
    clearInterval(interval);
    clearInterval(interval2);
    if(minutes<10){
        document.getElementById('minute').innerHTML = "0"+String(minutes)
    }else{
        document.getElementById('minute').innerHTML = minutes
    }
    
    if(second<10){
        document.getElementById('second').innerHTML = "0"+second
    }else{
        document.getElementById('second').innerHTML = second
    }
    
    document.getElementById('finalScore').innerHTML = score
    score = 0
    second = 0
    minutes = 0
    document.getElementById('canvas').style.visibility = 'hidden';
    document.getElementById('score').style.visibility = 'hidden';
    document.getElementById('score2').style.visibility = 'hidden';
    document.getElementById('deadText').style.visibility = 'visible';
    document.getElementById('startButton').style.visibility = 'visible';
    document.getElementById('returnDiv').style.visibility = 'visible';
}


function moveSnack() {
    var newposition = {
        x: snack.body[0].x + snack.direction.x,
        y: snack.body[0].y + snack.direction.y
    }
    snack.body.unshift(newposition)// put new location in front of  the list
    while (snack.body.length > snack.size) {// check the size to take out the last position 
        snack.body.pop()
    }
}


function gameStart() {
    document.getElementById('score2').innerHTML = score// so I can change the content in that tag
    audio1.play();
    state = 'u';//reset
    speed= 15;
    snack = {
        body: [{ x: Math.floor(blockCount / 2), y: Math.floor(blockCount / 2) }],
        size: 6,
        direction: { x: 0, y: -1 }
    }
    putApple()
    interval = setInterval(routine, 1000/60);//update the movement of snack
    interval2 = setInterval(updateTime, 1000);//update time


}


function updateTime() {
    second += 1
    if (second == 60) {
        second = 0
        minutes += 1
    }
}


function updateScore(newScore) {
    score = newScore;
    document.getElementById('score2').innerHTML = score;// update the content in the tag

}


function putApple() {
    apple = {
        x: Math.floor(Math.random() * (blockCount - 6)) + 2,
        y: Math.floor(Math.random() * (blockCount - 6)) + 2
    }
    for (var i = 0; i < snack.body.length; i++) {
        if (snack.body[i].x == apple.x && snack.body[i].y == apple.y) {
            putApple() // if the location of new apple is at the body's, do it again
            break
        }
    }
}


function routine() {
    if (snackIsDead()) {// play dead music
        audio2.play()
        gameOff()
        return
    }
    if(checkTheSpeed%speed==0){// at specific frame the snack can move, use this to change the speed of snack
        moveSnack()
        checkPoint = 1// to make sure the snack can not accept two direncitons' instraction in one frame
    }
    checkTheSpeed+=1
    updateCanvas()

    if (snack.body[0].x == apple.x && snack.body[0].y == apple.y) {//play eat apple music
        audio3.play()
        eatApple()
    }

    if (snack.size % 5 == 0 && once == 0) {//change the speed per 10 in size
        once = 1
        speed -= 2

        if (speed == 5) {// set the maximum speed
            speed = 7
        }

        if (snackIsDead != true) {// when it is dead, clear the interval to eliminate the loop
            clearInterval(interval)
            interval = setInterval(routine, 1000/60);
        }
    }

    if (snack.size % 5 == 1 && once == 1) {// to make sure the speed just at once
        once = 0
    }


    
}


function eatApple() {
    snack.size += 1
    if(snack.size%400!=0){
        putApple()
    }
    
    updateScore(score + 100)
}


function snackIsDead() {
    if (snack.body[0].x < 2) {// check whether reach the bord
        return true
    } else if (snack.body[0].x >= blockCount - 3) {
        return true
    } else if (snack.body[0].y < 2) {
        return true
    } else if (snack.body[0].y >= blockCount - 3) {
        return true
    }

    for (var i = 1; i < snack.body.length; i++) {// check whether touch the body
        if (snack.body[0].x == snack.body[i].x && snack.body[0].y == snack.body[i].y) {
            return true
        }
    }
}



function updateCanvas() {
    context.clearRect(0, 0, 600, 600);
    context.strokeStyle = 'darkgreen';//map outline
    context.lineWidth = 0.5;
    context.strokeRect(48, 48, 502, 502);
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillStyle = 'yellow';
    context.font = 'bold 15px Segoe Print';
    context.fillText('Time:', 42, 15);
    context.fillText('Size:', 190, 15);
    context.fillText(String(snack.size), 240, 15);
    if(minutes<10){
        context.fillText("0"+String(minutes), 88, 15);
    }else{
        context.fillText(String(minutes), 88, 15);
    }
    
    context.fillText(':', 115, 15);
    if(second<10){
        context.fillText("0"+String(second), 120, 15);
    }else{
        context.fillText(String(second), 120, 15);
    }
    


    context.drawImage(imgEat, apple.x * blockSize, apple.y * blockSize, blockSize, blockSize)


    context.fillStyle = 'white';
    for (var h = 0; h < snack.body.length; h++) {
        if (h == 0) {
            context.save();
            context.translate(snack.body[h].x * blockSize, snack.body[h].y * blockSize);
            switch (true) {
                case state == 'd':
                    context.rotate(Math.PI / 180 * 90);
                    context.drawImage(imgHead, 0, -blockSize - 3, blockSize + 15, blockSize + 5);
                    break;
                case state == 'l':
                    context.rotate(Math.PI / 180 * 180);
                    context.drawImage(imgHead, -blockSize - 3, -blockSize - 3, blockSize + 15, blockSize + 5);
                    break;
                case state == 'u':
                    context.rotate(Math.PI / 180 * 270);
                    context.drawImage(imgHead, -blockSize - 3, -3, blockSize + 15, blockSize + 5);
                    break;
                case state == 'r':
                    context.rotate(Math.PI / 180 * 360);
                    context.drawImage(imgHead, 0, 0, blockSize + 15, blockSize + 5);
                    break;
            }
            context.restore();
        } else {
            context.beginPath();
            context.fillStyle = bodyColor;
            context.arc(snack.body[h].x * blockSize + blockSize / 2, snack.body[h].y * blockSize + blockSize / 2, (blockSize - 1) / 2, Math.PI / 180 * 0, Math.PI / 180 * 360);
            context.fill();
        }

    }

}


window.onload = onPageLoaded //load this function after the whole web is loaded


function onPageLoaded() {
    document.addEventListener('keydown', whenKeyDown)
    audio1 = document.getElementById('music1');// setup the music
    audio2 = document.getElementById('music2');
    audio3 = document.getElementById('music3');
    audio4 = document.getElementById('music4');
}


function whenKeyDown(input) {
    switch (true) {
        case (input.keyCode == 65 || input.keyCode == 37) && snack.direction.x != 1 && checkPoint == 1: //left
            state = 'l'
            checkPoint = 0
            snack.direction.x = -1
            snack.direction.y = 0
            break;
        case (input.keyCode == 87 || input.keyCode == 38) && snack.direction.y != 1 && checkPoint == 1://up
            state = 'u'
            checkPoint = 0
            snack.direction.x = 0
            snack.direction.y = -1
            break;
        case (input.keyCode == 68 || input.keyCode == 39) && snack.direction.x != -1 && checkPoint == 1://right
            state = 'r'
            checkPoint = 0
            snack.direction.x = 1
            snack.direction.y = 0
            break;
        case (input.keyCode == 83 || input.keyCode == 40) && snack.direction.y != -1 && checkPoint == 1://down
            state = 'd'
            checkPoint = 0
            snack.direction.x = 0
            snack.direction.y = 1
            break;

    }

}
