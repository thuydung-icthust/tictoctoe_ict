let Board;
const humans = 'X';
const AIplayer = 'O';
var sizeOfBoard,cells;
var delayInMilliseconds = 500; //1 second
let BoardStart;
let winnerTemp;
const winDirection1 =[
    [0 ,1 ,2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let choice_win_direct;
function createBoard(){
    for(let i = 0 ; i < 3 ; i++){
        var node = document.createElement("tr");
        document.getElementById("_table3").appendChild(node);
        let row = document.getElementById("_table3").children;
        for(let j =0 ; j < 3 ; j++){
            var block = document.createElement("td");
            block.setAttribute("class", "cell");
            block.setAttribute('id', i*3 +j);
            row[i].appendChild(block);
        }
    }

}
function startGame(){
    sizeOfBoard = 3;
    //createBoard();
    //button[0].style.display = "block";
    //button[1].style.display = "block";
    
    document.querySelector("#btn-group").style.textAlign = "center";
    cells = document.querySelectorAll('#table3 .cell');
    BoardStart = document.getElementById("table3");
    document.getElementById("_table3").style.left = "42%";
    BoardStart.style.display = "block";
    choice_win_direct = winDirection1;
    //document.getElementById("overlay").style.width = "0%";

    Board = Array.from(Array(Math.pow(sizeOfBoard,2)).keys);
    for(let i = 0; i < Math.pow(sizeOfBoard,2); i++){
        cells[i].innerText = "";
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click',turnclick, false);
    }
    //document.getElementById("_table3").innerText = "";
    document.querySelector("#playing").style.display = "block";
    //document.querySelector("#playbut").addEventListener('click', restart);
}

function turnclick(cell){
    playSound();
    let gameWon = turn(cell.target.id,humans);
    if(!gameWon){
        document.querySelector("#playing").innerText = "Turn: Computer";
        let true_id = "#table" + sizeOfBoard  + " " + "table" + " " + "td";
        true_id = document.querySelectorAll(true_id);
        for(let i = 0 ; i < Math.pow(sizeOfBoard,2); i++){
            true_id[i].removeEventListener('click', turnclick, false);
        }
        if(!checkTie()){
        setTimeout(function() {
        //your code to be executed after 1 second
        
            for(let i = 0 ; i < Math.pow(sizeOfBoard,2); i++){
                if(!(Board[i] == humans || Board[i] == AIplayer)){
                    true_id[i].addEventListener('click',turnclick, false);
                }
            }
            turn(bestSpot(Board,AIplayer), AIplayer);
            playSound();
        document.querySelector("#playing").innerText = "Turn: Player";
             }, delayInMilliseconds);
            }
        }
        //document.getElementById(playbut).addEventListener('click', restart);     
}

function turn(id, player){
    Board[Number(id)] = player;
    let true_id = "#table" + sizeOfBoard  + " " + "table" + " " + "td";
    true_id = document.querySelectorAll(true_id);
    true_id[id].innerText = player;
    if(player == humans) true_id[id].style.color = "green";
    if(player == AIplayer) true_id[id].style.color = "blue";
    true_id[id].removeEventListener('click', turnclick, false);
    let gameWon = checkWin(Board);
    if(gameWon[1]){
        for(let i = 0 ;i < Math.pow(sizeOfBoard,2) ;i++){
            document.getElementById(i).removeEventListener('click', turnclick , false);
        } 
        console.log(gameWon[0]);
        declareWinner(player, gameWon[0]); 
    }
    return gameWon[1];
}

function checkWin(Board1){
    // Phần này chắc dễ hiểu =))
    let check = 0;
    let win_seq;
        choice_win_direct.forEach(element=>{
            let num_X = 0;
            let num_O = 0;
            element.forEach(pos=>{
                if(Board1[pos] == humans)
                    num_X++;
                else if(Board1[pos] == AIplayer)
                    num_O++;
            })
            if((num_X == 3 && num_O == 0) || (num_X == 0 && num_O == 3)){
                check = 1;
                win_seq = element;
                return [win_seq,true];
            }
        })
    if(check)
        return [win_seq,true];
    else   
        return [0,false];
}
function checkTie(){
    for(let i = 0 ; i < Math.pow(sizeOfBoard,2) ;i++){
        if(Board[i] == undefined){
            return false;
        }
    }
    for(let i = 0 ; i < Math.pow(sizeOfBoard,2) ;i++){
        cells[i].style.backgroundColor = "yellow";
        declareWinner("Tie Game!!!");
    }
    return true;
}
function declareWinner(player, index){
    if (index)
    for(let i = 0; i< 3; ++i) cells[index[i]].style.backgroundColor = "red";
    document.getElementById("myNav").style.width = "100%";
    if (player == humans) 
    {document.getElementById("winner-player").innerText = "You won!" ;}
    else if (player == AIplayer) document.getElementById("winner-player").innerText = "You lost!";
    else document.getElementById("winner-player").innerText = "Tie Game!";

}



function find_min(list){
    let min = Infinity;
    let node_chose = [];
    list.forEach(element=>{
        if(element[1] < min){
            node_chose = element;
            min = element[1];
        }
    });
    return node_chose;
}
function find_max(list){
    let max = -Infinity;
    let node_chose = [];
    list.forEach(element=>{
        if(element[1] > max){
            node_chose = element;
            max = element[1];
        }
    });
    return node_chose;
}
function Find_available_node(_Board){
    let list = [];
    for(let i = 0 ; i < Math.pow(sizeOfBoard,2);i++){
        if(_Board[i] === undefined)
            list.push(i);
    }
    return list;
}

function _checkTie(_Board){
    for(let i = 0 ; i < Math.pow(sizeOfBoard,2) ;i++){
        if(_Board[i] === undefined){
            return false;
        }
    }
    return true;
}

function bestSpot(_Board,player){
        return alpha_beta_pruning(_Board,0,player,-1000,1000)[0];
}

let count = 0;
// Not done please consider more about alpha beta
function alpha_beta_pruning(_Board,depth,player,alpha,beta){
    
    count++; // Count how many times the function called
    let list = Find_available_node(_Board);
    let list_return_value = [];
    for(let i = 0 ; i < list.length ; i++){
        let _boardCopy = [..._Board];
        _boardCopy[list[i]] = player;
        if(checkWin(_boardCopy)[1]){
            if(player == AIplayer)
                list_return_value.push([list[i],1]);
            else
            list_return_value.push([list[i],-1]);
        }else if(_checkTie(_boardCopy)){
            list_return_value.push([list[i],0]);
        }
        else{
                let value = alpha_beta_pruning(_boardCopy,depth+1,player == AIplayer ? humans : AIplayer,alpha,beta);
                list_return_value.push([list[i],value[1]]);
                if(player === AIplayer){
                    alpha  = Math.max(alpha,value[1]);
                }else{
                    beta = Math.min(beta,value[1]);
                }
        }
        if(alpha >= beta)
            break;
    }
    if(player === AIplayer){
        return find_max(list_return_value);
    }else{
        return find_min(list_return_value);
    }
}
// Hàm đánh giá điểm của từng states mà O được điền vào từng ô trống


// For logic behavior

let menu = document.querySelector("#menu-starter");
let button = document.querySelectorAll(".option-but");
function start(){

   menu.style.display = "none";
    document.querySelector("#btn-group").style.display = "inline-block";
   startGame();
}
function back(){
    menu.style.removeProperty("display");
    document.getElementById("_table3").innerText ="";
    button[0].style.display = "none";
    button[1].style.display ="none";
    BoardStart.style.display ="none";
    document.querySelector("#playing").style.display = "none";
}
function restart(){
    document.getElementById("myNav").style.width = "0%";
    //document.getElementById("overlay").style.width = "100%";
    BoardStart.style.display = "none";
    document.getElementById("playing").style.display = "none";
    //document.getElementById("_table3").innerText ="";
    let cells = document.querySelectorAll('#table3 .cell');
    for (let i = 0; i < Math.pow(sizeOfBoard, 2); i++) {
        cells[i].style.backgroundColor = "white";
        cells[i].innerText = "";
    }
    //document.querySelector("#btn-group").style.display = "inline";
    startGame();
}
function backtoMenu(){
    document.getElementById("myNav").style.width = "0%";
    document.querySelector("#playing").style.display = "none";
    BoardStart.style.display = "none";
    menu.style.removeProperty("display");
    //button[0].style.display = "none";
    //button[1].style.display ="none";
    document.querySelector("#pausegame").style.width = "0%";
    document.querySelector("#btn-group").style.display = "none";
}
function pause(){
    document.querySelector("#pausegame").style.width = "100%";
}
function resume(){
    document.querySelector("#pausegame").style.width = "0%";
}
var sound = new Audio();         // create the audio
sound.src = "sound.wav";  // set the resource location 
sound.oncanplaythrough = function(){   // When the sound has completely loaded
    sound.readyToRock = true;    // flag sound is ready to play
                                   // I just made it up and can be anything
};
sound.onerror = function(){      // not required but if there are problems this will help debug the problem
    console.log("Sound file SoundFileURL.mp3 failed to load.")
};
function playSound(){
    if(sound && sound.readyToRock){  // check for the sound and if it has loaded
        sound.currentTime = 0;       // seek to the start
        sound.play();                // play it till it ends
    }
}
document.getElementById("content").style.height = innerHeight + "px";
