//Global Variables
let userStrength = 6;
let userCunning = 6;
let userSpeed = 6;
let userFatigue = 30;
let userDefense;
let userOriginalFatigue;
let userDamage;
let cpuStrength = 6;
let cpuCunning = 6;
let cpuSpeed = 6;
let cpuFatigue = 30;
let cpuDefense;
let cpuOriginalFatigue;
let cpuDamage;
let log = "";

const randomizeStats = () => { //Randomizes the Stats of the 2 Fighters, Uses 2 possible combinations to adjust their values
    let randomNum = Math.floor(Math.random() *2) + 1;
    if (randomNum === 1) {
        // Increase Strength and Cunning by 0 or 1
        userStrength += Math.floor(Math.random() * 2);
        userCunning += Math.floor(Math.random() * 2);
        // Decrease Speed by 0 or 1
        userSpeed -= Math.floor(Math.random() * 2);
        // Decrease Fatigue by a number between 0 and 6
        userFatigue -= Math.floor(Math.random() * 7);
    } else if (randomNum === 2) {
        // Decrease Strength and Cunning by 0 or 1
        userStrength -= Math.floor(Math.random() * 2);
        userCunning -= Math.floor(Math.random() * 2);
        // Increase Speed by 0 or 1
        userSpeed += Math.floor(Math.random() * 2);
        // Increase Fatigue by a number between 0 and 6
        userFatigue += Math.floor(Math.random() * 7);
    }

    userOriginalFatigue = userFatigue; //Used for my Fatigue/Health Bar

    let cpuRandomNum = Math.floor(Math.random() * 2) + 1;
    if (cpuRandomNum === 1) {
        cpuStrength += Math.floor(Math.random() * 2);
        cpuCunning += Math.floor(Math.random() * 2);
        cpuSpeed -= Math.floor(Math.random() * 2);
        cpuFatigue -= Math.floor(Math.random() * 7);
    } else if (cpuRandomNum === 2) {
        cpuStrength -= Math.floor(Math.random() * 2);
        cpuCunning -= Math.floor(Math.random() * 2);
        cpuSpeed += Math.floor(Math.random() * 2);
        cpuFatigue += Math.floor(Math.random() * 7);
    }
 
    cpuOriginalFatigue = cpuFatigue; //Used for my Fatigue/Health Bar

    //I display the innerHTML for all these values at the onload for the body because this is only required once and it makes it to where I don't have to call display as well
    document.querySelector("#playerStrength").innerHTML = userStrength;
    document.querySelector("#playerSpeed").innerHTML = userSpeed;
    document.querySelector("#playerCunning").innerHTML = userCunning;
    document.querySelector("#playerFatigue").value = userFatigue;
    document.querySelector("#playerFatigue").max = userOriginalFatigue;
    document.querySelector("#playerFatigueHeader").innerHTML = userFatigue + "/" + userOriginalFatigue;

    document.querySelector("#cpuStrength").innerHTML = cpuStrength;
    document.querySelector("#cpuSpeed").innerHTML = cpuSpeed;
    document.querySelector("#cpuCunning").innerHTML = cpuCunning;
    document.querySelector("#cpuFatigue").value = cpuFatigue;
    document.querySelector("#cpuFatigue").max = cpuOriginalFatigue;
    document.querySelector("#cpuFatigueHeader").innerHTML = cpuFatigue + "/" + cpuOriginalFatigue;
}

function attack() { //Method called once the attack button is clicked 
    document.querySelector("#attackButton").disabled = true; //All buttons get disabled to prevent spamming of a button to break the function
    document.querySelector("#blockButton").disabled = true;
    document.querySelector("#finishingMoveButton").disabled = true;
    playerSwitchImage("punchP1.png", "stillP1.png"); //Calls method to switch images to create animation effect.
    cpuSwitchImage("blockCPU.png", "stillCPU.png");
    userDamage = Math.floor((userStrength + userSpeed + userCunning) / (Math.floor((Math.random() * 3) + 1)));
    userDefense = userSpeed + (Math.floor(Math.random() * 6) + 1);
    log = log + "&gt; USER just ATTACKED and dealt " + userDamage + " damage. <hr>";
    playTurn(1); //Calls method to get cpu action and calculate if there is damage inflicted on either 2.
}

function defend() {
    document.querySelector("#attackButton").disabled = true; //All buttons get disabled to prevent spamming of a button to break the function
    document.querySelector("#blockButton").disabled = true;
    document.querySelector("#finishingMoveButton").disabled = true;
    playerSwitchImage("blockP1.png", "stillP1.png");
    userDefense = userSpeed + userCunning;
    log = log + "&gt; USER just BLOCKED <hr>";
    playTurn(2); //Calls method to get cpu action and calculate if there is damage inflicted on either 2.
}

function finishingMove() {
    document.querySelector("#attackButton").disabled = true; //All buttons get disabled to prevent spamming of a button to break the function
    document.querySelector("#blockButton").disabled = true;
    document.querySelector("#finishingMoveButton").disabled = true;
    playerSwitchImage("uppercutP1.png", "stillP1.png");
    userDamage = Math.floor((userStrength + userSpeed) / (1 + Math.floor(Math.random() * 3)));
    userDefense = userSpeed + (Math.floor(Math.random() * 6) + 1);
    log = log + "&gt; USER just ATTACKED with their FINISHING MOVE and dealt " + userDamage + " damage. <hr>";
    playTurn(3); //Calls method to get cpu action and calculate if there is damage inflicted on either 2.
}

function playTurn(modifier) { //The main logic behind the CPUs actions and how it affects both the user and the CPU, modifier is called so different scenarios can be played out and clutter code less
    let cpuFinish = cpuFatigue >= 2 * userFatigue || userFatigue < 0;
    if (cpuFinish) { //Always checks to see if CPU can use finisher move first then runs the other 3 possibilities.
        cpuSwitchImage("uppercutCPU.png", "stillCPU.png");
        cpuDamage = Math.floor((cpuStrength + cpuSpeed) / (1 + Math.floor(Math.random() * 3)));
        log = log + "&gt; CPU just ATTACKED with their FINISHING MOVE and dealt " + cpuDamage + " damage. <hr>";
        if (cpuDamage - userDefense > 1) {
            log = log + "&gt; USER just got KNOCKED OUT! CPU WINS! <hr>";
            cpuWin(); //Ends game if this is met
        } else if (cpuDamage - userDefense === 1) {
            playerSwitchImage("blockP1.png", "stillP1.png");
            userFatigue--;
            log = log + "&gt; PLAYER just TOOK 1 damage. <hr>";
        } else {
            playerSwitchImage("blockP1.png", "stillP1.png");
            regainFatigue(1);
            log = log + "&gt; USER BLOCKED all damage. REGAINED FATIGUE. <hr>";
        }
    } else {
        let cpuResponse = Math.floor((Math.random() * 2) + 1); //1 represents CPU attacking, 2 represents CPU blocking.
        if (modifier === 1) { // if user attacked
            if (cpuResponse === 1) {
                cpuSwitchImage("punchCPU.png", "stillCPU.png");
                playerSwitchImage("blockP1.png", "stillP1.png");
                cpuDamage = Math.floor((cpuStrength + cpuSpeed + cpuCunning) / (1 + Math.floor(Math.random() * 3)));
                cpuDefense = cpuSpeed + (Math.floor((Math.random() * 6) + 1));
                log = log + "&gt; CPU just ATTACKED and dealt " + cpuDamage + " damage. <hr>";
                calculateDamage(1); //Calls method to see how much damage CPU took
                calculateDamage(2); //Calls method to see how much damage player took
            } else {
                cpuDefense = cpuSpeed + cpuCunning;
                calculateDamage(1); //Calls method to see how much damage CPU took
            }
        } else if (modifier === 2) { // if user defended
            if (cpuResponse === 1) {
                cpuSwitchImage("punchCPU.png", "stillCPU.png");
                playerSwitchImage("blockP1.png", "stillP1.png");
                cpuDamage = Math.floor((cpuStrength + cpuSpeed + cpuCunning) / (1 + Math.floor(Math.random() * 3)));
                cpuDefense = cpuSpeed + (Math.floor(Math.random() * 6) + 1);
                log = log + "&gt; CPU just ATTACKED and dealt " + cpuDamage + " damage. <hr>";
                calculateDamage(2); //Calls method to see how much damage player took
            } else {
                cpuSwitchImage("blockCPU.png", "stillCPU.png");
                log = log + "&gt; CPU just BLOCKED <hr>";
                log = log + "&gt; CPU and USER both BLOCKED, regaining fatigue... <hr>";
                regainFatigue(1); //Both player and CPU regain fatigue through these methods
                regainFatigue(2)
            }
        } else if (modifier === 3) { // if user used special move
            if (cpuResponse === 1) {
                cpuSwitchImage("punchCPU.png", "stillCPU.png");
                playerSwitchImage("blockP1.png", "stillP1.png");
                cpuDamage = Math.floor((cpuStrength + cpuSpeed + cpuCunning) / (1 + Math.floor(Math.random() * 3)));
                cpuDefense = cpuSpeed + (Math.floor(Math.random() * 6) + 1);
                log = log + "&gt; CPU just ATTACKED and dealt " + cpuDamage + " damage. <hr>";
                calculateDamage(2); //Calls method to see how much damage player took
                calculateDamage(3); //Calls method to see how much damage CPU took from finishing move
            } else {
                cpuDefense = cpuSpeed + cpuCunning;
                calculateDamage(3); //Calls method to see how much damage CPU took from finishing move
            }
        }
    }

    display(); //Calls display method once playTurn method is done.

}

function calculateDamage(modifier) { //Helper method to the playTurn method which allows me to better visualize the code and understand how the damage is calculated
    if (modifier === 1) { //Calculating CPU damage received
        if (userDamage - cpuDefense > 0) {
            let damage = userDamage - cpuDefense;
            log = log + "&gt; CPU just took " + damage + " DAMAGE! SUBTRACTING FROM FATIGUE. <hr>";
            cpuFatigue = cpuFatigue - (userDamage - cpuDefense);
        } else {
            log = log + "&gt; CPU BLOCKED all damage. REGAINED FATIGUE. <hr>";
            regainFatigue(2);
        }
    } else if (modifier === 2) { //Calculating User Damage received
        if (cpuDamage - userDefense > 0) {
            let damage = cpuDamage - userDefense;
            log = log + "&gt; USER just took " + damage + " DAMAGE! SUBTRACTING FROM FATIGUE. <hr>";
            userFatigue = userFatigue - (cpuDamage - userDefense);
        } else {
            log = log + "&gt; USER BLOCKED all damage. REGAINED FATIGUE. <hr>";
            regainFatigue(1);
        }
    } else if (modifier === 3) { //Calculating CPU damage received from finishing move
        if (userDamage - cpuDefense > 1) {
            log = log + "&gt; CPU just got KNOCKED OUT! USER WINS! <hr>";
            playerWin(); //Ends game here when condition is met
        } else if (userDamage - cpuDefense === 1) {
            cpuSwitchImage("blockCPU.png", "stillCPU.png");
            cpuFatigue--;
            log = log + "&gt; CPU just TOOK 1 damage. <hr>";
        } else {
            cpuSwitchImage("blockCPU.png", "stillCPU.png");
            regainFatigue(2);
            log = log + "&gt; CPU BLOCKED all damage. REGAINED FATIGUE. <hr>";
        }
    }
}
function regainFatigue(modifier) { //Another helper method that helps me visualize how the user or CPU can gain fatigue, 1 represents user gaining fatigue, 2 for CPU
    if (modifier === 1) {
        if (userFatigue < userOriginalFatigue) { //Make sure user doesn't gain extra fatigue if over the original value
            userFatigue += Math.floor((Math.random() * 6) + 1);
            if (userFatigue >= userOriginalFatigue) { //Makes sure user doesn't go over the fatigue bar but stays at the max.
                userFatigue = userOriginalFatigue;
            }
        }
    }
    if (modifier === 2) {
        if (cpuFatigue < cpuOriginalFatigue) { //Make sure CPU doesn't gain extra fatigue if over the original value
            cpuFatigue += Math.floor((Math.random() * 6) + 1);
            if (cpuFatigue >= cpuOriginalFatigue) { //Makes sure CPU doesn't go over the fatigue bar but stays at the max.
                cpuFatigue = cpuOriginalFatigue;
            }
        }
    }
}
function playerSwitchImage(imageLink, imageLink2) {
    document.getElementById("playerSprite").src = "Boxer-Sprites/" + imageLink; //First switches image to imageLink from Boxer Sprites folder

    setTimeout(function(){ //Calls this function after 1 second(1000 milliseconds)
        document.getElementById("playerSprite").src = "Boxer-Sprites/" + imageLink2;
    }, 1000);
}

function cpuSwitchImage(imageLink, imageLink2) {
    document.getElementById("cpuSprite").src = "Boxer-Sprites/" + imageLink; //First switches image to imageLink from Boxer Sprites folder

    setTimeout(function(){ //Calls this function after 1 second(1000 milliseconds)
        document.getElementById("cpuSprite").src = "Boxer-Sprites/" + imageLink2;
    }, 1000);
}

function cpuWin() {
    document.querySelector("#attackButton").style.display = "none";
    document.querySelector("#blockButton").style.display = "none";
    document.querySelector("#finishingMoveButton").style.display = "none"; //Prevent the program from continuing once the game is over

    document.querySelector(".cpuBox").style.border = "thick solid gold"; //To distinguish who won the boxing match
    playerSwitchImage("stumbleP1.png", "knockdownP1.png");
    
    setTimeout(function() { //Calls alert function to bring up a box to let the user know they lost. Calls 3 seconds after the playerSwitch
        alert("CPU has won the boxing match! Refresh to Try Again!");
        console.log (`CPU has won the match with a fatigue of : ${cpuFatigue}`); //Prints to console the amount of fatigue CPU won with
    }, 3000);
}

function playerWin() {
    document.querySelector("#attackButton").style.display = "none";
    document.querySelector("#blockButton").style.display = "none";
    document.querySelector("#finishingMoveButton").style.display = "none"; //Prevent the program from continuing once the game is over

    document.querySelector(".playerBox").style.border = "thick solid gold"; //To distinguish who won the boxing match
    cpuSwitchImage("stumbleCPU.png", "knockdownCPU.png");

    setTimeout(function() { //Calls alert function to bring up a box to let the user know they won. Calls 3 seconds after the cpuSwitch
        alert("You have won the boxing match! Refresh to Try Again!");
        console.log (`You have won the match with a fatigue of : ${userFatigue}`); //Prints to console the amount of fatigue user won with
    }, 3000);
}


function display() {
    document.querySelector("#attackButton").disabled = false;
    document.querySelector("#blockButton").disabled = false; //Re displays the 2 buttons so user can click on again 
    
    let isFinish = (userFatigue >= 2 * cpuFatigue || cpuFatigue < 0) ? true : false; //Condition to see if finishingMove can be clicked on

    if (isFinish) {
        document.getElementById("finishingMoveButton").disabled = false;
    } else {
        document.getElementById("finishingMoveButton").disabled = true;
    }
    if (userFatigue < 0) { //Makes sure the bar doesn't break when a negative value is for either user of cpu fatigue
        document.querySelector("#playerFatigue").value = 0;
    } else {
        document.querySelector("#playerFatigue").value = userFatigue;
    }
    if (cpuFatigue < 0) {
        document.querySelector("#cpuFatigue").value = 0
    } else {
        document.querySelector("#cpuFatigue").value = cpuFatigue;
    }
    document.querySelector("#playerFatigueHeader").innerHTML = userFatigue + "/" + userOriginalFatigue;
    document.querySelector("#cpuFatigueHeader").innerHTML = cpuFatigue + "/" + cpuOriginalFatigue;
    document.getElementById("logContent").innerHTML = log; //Updates log given the log variable and the current and original fatigue values.
}

document.getElementById("attackButton").addEventListener("click", attack);
document.getElementById("blockButton").addEventListener("click", defend);
document.getElementById("finishingMoveButton").addEventListener("click", finishingMove); //3 Main buttons of the program

