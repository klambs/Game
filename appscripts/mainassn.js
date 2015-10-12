require(
    [],
    function () {
            
        console.log("yo, I'm alive!");

        //Prompt box pop up welcoming the player and giving the player some basic instructions on how to start the game
        confirm("Welcome! Let's see how many times you can click on the space invader in 10 seconds! To begin, select your desired level of difficulty using the dropdown menu.")

        //The variable "paper" was created to start a Raphael project
        var paper = new Raphael(document.getElementById("mySVGCanvas"));

        //The variable "change" was defined to hold different setInterval values, which determine the frequency of a change in direction during the movement of the target object
        var change;

        //HTML DOM to retrieve dropdown menu
        var userDifficulty = document.getElementById("myList");
        //HTML DOM to retrieve the ready (or "Let's Go!") button
        var doItButton = document.getElementById("readyButton");
        //An event listener was added to the ready button
        doItButton.addEventListener("click", function(){
            var setDifficulty = userDifficulty.options[userDifficulty.selectedIndex].value;
            //Conversion of the string to an integer (1 for Easy, 2 for Medium or 3 for Difficult)
            var difficultyValue = parseInt(setDifficulty)
            console.log("the level selected is "+ difficultyValue);
            //Calls the ready function
            ready();
            //Depending on the difficulty level chosen, the speed and the frequency of change in direction of the target object is changed
            if (difficultyValue == 1) {
                //This is the easiest mode. The speed and frequency of change is the lowest.
                rect1.rateX = 1
                rect1.rateY = 1
                change = setInterval(changeDirection,3000) //changes direction once per 3 seconds
            } else if (difficultyValue == 2) {
                rect1.rateX = 2
                rect1.rateY = 2
                change = setInterval(changeDirection,2000) //changes direction once per 2 seconds
            } else if (difficultyValue == 3) {
                //This is the most difficult mode. The speed and frequency of change is the highest.
                rect1.rateX = 3
                rect1.rateY = 3
                change = setInterval(changeDirection,1000) //changes direction once per second
            }
        });

        //Ready function displays the start button to allow the player to start the game
        var ready = function(){
            startButton.show();
            startText.show();
        };

        //Drawing the startbutton and starttext using Raphael
        var startButton = paper.circle(300, 200, 40);
        var startText = paper.text(300, 200, 'START');
        startButton.attr({
        	stroke: "black",
        	fill: "silver"
        });
        startText.attr({
            "font-family": "Copperplate, 'Copperplate Gothic Light', fantasy",
            "font-size": 18 
        });

        //Hides the startbutton and starttext, so that they are only shown when the player is ready to start i.e. after choosing the level of difficulty
        startButton.hide();
        startText.hide();

        //Start function hides the startbutton and starttext to start the game and allow gameplay
        var start = function (){
        	console.log("game is starting");
        	startButton.hide();
        	startText.hide();            

        	counter = 0; //Set the counter for the score to 0 every time a new game is started

            moveSquare(); //Calls the moveSquare function
            timer(); //Calls the timer function
        };

        //The start function is only called when the startbutton is pressed
        startButton.node.addEventListener('click', start);

        //Drawing the target object using Raphael (in this case, we have used a .gif image from the internet)
        var rect1 = paper.image("http://files.gamebanana.com/img/ico/sprays/render_9.gif",-100,-100,80,80)

        //Returns a random integer between m and n inclusive
        var randInt = function( m, n ) {
            var range = n-m+1;
            var frand = Math.random()*range;
            return m+Math.floor(frand);
        };

        //Moves the target object to a random position on the paper at the beginning of the game
        var moveSquare = function(){
            rect1.posX = randInt(0,520); //upper bound = size of paper - size of target object
            rect1.posY = randInt(0,320);

            rect1.attr({
                x: rect1.posX,    
                y: rect1.posY,
                cursor: "pointer" //changes the cursor to a pointer when it is on the target object
            });
            return;
        };

        //Setting the default rate
        rect1.rateX = 1
        rect1.rateY = 1

        //Setting the initial angle of movement in radians
        var angle = 2*Math.random()*Math.PI;

        //Setting the velocity in the x and y axes by multiplying the rate by the angle
        var vx = rect1.rateX*Math.sin(angle);
        var vy = rect1.rateY*-Math.cos(angle);
        
        //The changeDirection function is called to set a new angle in order to change the direction of the target object
        var changeDirection = function(){
            angle = 2*Math.random()*Math.PI;
            vx = rect1.rateX*Math.sin(angle);
            vy = rect1.rateY*-Math.cos(angle);
            console.log("changing direction...")
        };

        //Arbitrary variable to hold a value as we move the target object by repeatedly calling the draw function
        var a = 0

        //Moving the target object within the confines of the paper specifications
        var draw = function(){
            a += 1;
            if (rect1.posX > 520) {
                vx = rect1.rateX*Math.sin((1+Math.random())*Math.PI) //Moves the target object to the left once it hits the right edge of the paper
            };
            if (rect1.posX < 0) {
                vx = rect1.rateX*Math.sin(Math.random()*Math.PI) //Moves the target object to the right once it hits the left edge of the paper
            };
            if (rect1.posY > 320) {
                vy = rect1.rateY*-Math.cos(((3 + 2*Math.random())/2)*Math.PI) //Moves the target object upwards once it hits the button edge of the paper
            };
            if (rect1.posY < 0){
                vy = rect1.rateY*-Math.cos(((1 + 2*Math.random())/2)*Math.PI) //Moves the target object downwards once it hits the top edge of the paper
            };
            //Stores new x and y coordinates of the target object as it moves at the velocities vx and vy
            rect1.posX += vx
            rect1.posY += vy;
            rect1.attr({
                x: rect1.posX,
                y: rect1.posY
            });
        };

        //The variables "animate" and "timeout" were declared to be used in functions later
        var animate;
        var timeout;

        //Timer function makes sure the game ends after 10 seconds
        var timer = function(){
            timeout = setTimeout(end, 10000); //the end function is called after 10 seconds
            rect1.node.addEventListener('click', keepScore); //the keepScore function is called everytime the target object is clicked
            animate = setInterval(draw,1); //animates the movement of the target object by calling the draw function every 1 ms
        };

        //Counter starts at zero by default
        var counter = 0;

        //Increases the score by one every time the target object is clicked
        var keepScore = function(){
            counter++;
            console.log("your square move count is now " + counter);
        };

        //Ends the game
        var end = function(){
            //A pop up box to let the user know how he/she fared in the game
            confirm("Congratulations! You have achieved a score of " + counter + ". Select the level of difficulty to start the game again.");   
            //Hides the target object off screen
            rect1.attr({
                    x: -100,
                    y: -100
                });
            console.log("game has ended");
            //Clears all intervals set to stop the animation and movement of the target object
            clearInterval(animate);
            clearInterval(change);
        };

        //Ends the game when the player chooses to do so before the end of the 10 seconds
        var prematureEnd = function(){
            //A pop up box to prompt the player to start a new game
            confirm("You have ended the game. Select the level of difficulty to start a new game.");   
            //Hides the target object off screen
            rect1.attr({
                    x: -100,
                    y: -100
                });
            console.log("game has ended");
            //Clears all intervals set to stop the animation and movement of the target object
            clearInterval(animate);
            clearInterval(change);
        };

        //HTML DOM to retrieve the end button
        var endGameButton = document.getElementById("endButton");
        //An event listener was added to the end button
        endGameButton.addEventListener("click", function(){
            prematureEnd(); //calls the prematureEnd function
            clearTimeout(timeout); //clears the timeout previously set when the game was started
        });

        //when clicking the green dot the music will play 
        var music = new Audio("resources/322616__burkay__cicada2.wav");
        rect1.node.addEventListener("click", function(){
            music.play();
        });
        //To play music in the background
        var musicBackground = new Audio("resources/70100__gregswinford__eerie-forest.mp3")
        musicBackground.play();


    }
);