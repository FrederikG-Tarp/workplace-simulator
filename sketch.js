const supabaseUrl = "https://gwgaqrknjtejnphcntdz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3Z2FxcmtuanRlam5waGNudGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTY3MzcsImV4cCI6MjA5Nzg5MjczN30.pjBXbVzn8hGgsF3NeIW2GqWHjbd0mvz4U3ejqPROjd8";

// VIGTIG: dette navn bruger du resten af koden
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// ---------------- SOUNDS ----------------

let correctSound;
let bgMusic;
let clickSound;


// ---------------- IMAGES ----------------

let coworker;
let colleagues;
let femaleWorker;
let startBackground;
let changeBackground;
let adaptImages = [];


// ---------------- GAME STATE ----------------

let feedback = "";

let questionIndex = 0;

let answered = false;

let gameStarted = false;

let readyScreen = true;

let state = "quiz1";

let noMessage = "";

let responses = [];

let ageGroup = "";

let saved = false;

// ---------------- PERSONALITY ----------------

let teamPlayer = 0;

let fastDecisionMaker = 0;

let analyst = 0;


// ---------------- ADAPTABILITY ----------------

let changeScore = 0;

let adaptIndex = 0;

let adaptAnswered = false;

let adaptAnswers = [];



// ---------------- QUESTIONS ----------------

let questions = [

"A teammate is struggling with a critical task and the deadline is soon, but your own task is also unfinished. What do you do?",

"A shortcut could save time, but increases the risk of hidden bugs in production. What is your decision?",

"A client requests a major change late in the project that may delay delivery. How do you respond?",

"You strongly disagree with a senior developer during a design decision in a meeting. What do you do?",

"Your team is missing deadlines due to uneven workload distribution. You are not the team lead. What do you do?",

"A critical system failure happens during working hours affecting customers. What is your first action?",

"A colleague repeatedly misses deadlines and the team performance is at risk. What is your response?",

"You are assigned a task outside your expertise with a tight deadline. How do you approach it?",

"A meeting is going off track with no clear decisions and time is running out. What do you do?",

"You identify a serious future risk that nobody else seems to take seriously. What do you do?"
];

// ---------------- OPTIONS ----------------

let options = [

[
{
text:"Support the teammate while also making sure my own responsibilities stay on track.",
type:"team"
},

{
text:"Take ownership of the situation and coordinate a solution to ensure the deadline is met.",
type:"fastDecisionMaker"
},

{
text:"Analyse the situation first and identify the most efficient way to solve the problem.",
type:"analyst"
}
],


[
{
text:"Discuss the trade-off between speed and quality with the team and decide together what is more important for the project.",
type:"team"
},

{
text:"Use the shortcut because finishing faster is the highest priority in this situation and I want to show that I can make quick decisions.",
type:"fastDecisionMaker"
},

{
text:"Reject the shortcut because quality should never be compromised and I want to maintain high standards in my work.",
type:"analyst"
}

],


[
{
text:"Clarify the priority and discuss the impact on the project timeline with the client to find a solution that works for both sides.",
type:"team"
},

{
text:"Accept the request immediately to satisfy the client's needs and show that I am a flexible co-worker.",
type:"fastDecisionMaker"
},

{
text:"Reject the request because it is outside the original scope and I want to maintain focus on the agreed-upon deliverables.",
type:"analyst"
}

],


[
{
text:"Discuss the disagreement professionally and explain my own perspective since I value open communication and want to find the best solution for the project.",
type:"team"
},

{
text:"Avoid conflict and follow the decision because I respect the senior developer's experience and authority.",
type:"analyst"
},

{
text:"Criticise the decision afterwards instead of addressing it directly because I want to avoid confrontation but still express my disagreement.",
type:"fastDecisionMaker"
}

],


[
{
text:"Discuss workload distribution and help create balance in the workforce to ensure the team can progress effectively together.",
type:"team"
},

{
text:"Continue with my own tasks because everyone has their own responsibilities and I want to focus on doing my part well.",
type:"analyst"
},

{
text:"Wait until someone else notices the problem in order to avoid interfering in others' work and focus on my own tasks.",
type:"fastDecisionMaker"
}

],


[
{
text:"Investigate the issue and take action based on the current situation in order to solve the problem as quickly as possible.",
type:"analyst"
},

{
text:"Immediately try to fix the issue myself to show that I can handle pressure and solve problems independently.",
type:"fastDecisionMaker"
},

{
text:"Delay action until someone else also steps in because I value cooperation and want to make sure we solve the problem together.",
type:"team"
}

],


[
{
text:"Talk with the colleague and understand the reason behind the delays to find a solution together and support them in improving their performance.",
type:"team"
},

{
text:"Ignore it because it is not my responsibility to manage others' performance and I want to focus on my own work.",
type:"analyst"
},

{
text:"Report to your boss immediately because it is important to address performance issues quickly and I want to ensure the team can progress effectively.",
type:"fastDecisionMaker"
}

],


[
{
text:"Ask questions, learn, and find the best way to complete the task because I am open to new challenges and want to grow professionally.",
type:"fastDecisionMaker"
},

{
text:"Avoid the task because I lack experience and I want to focus on tasks I am more comfortable with.",
type:"analyst"
},

{
text:"Delay starting until teamwork and cooperation can be arranged to ensure I can complete the task successfully with support from others.",
type:"team"
}

],


[
{
text:"Help bring the meeting back on track and create focus to ensure that the team can make a clear decision together.",
type:"team"
},

{
text:"Stay silent because it is not my role to manage meetings and I want to avoid conflict, but I still want to be supportive.",
type:"analyst"
},

{
text:"Leave the meeting and focus on my own work because I want to avoid the unproductive discussion and focus on my own tasks instead.",
type:"fastDecisionMaker"
}

],


[
{
text:"Raise the concern and discuss possible solutions with the team to proactively manage the risk and ensure the project can progress smoothly.",
type:"team"
},

{
text:"Ignore it unless it becomes a real problem because it is not certain that it will actually affect the project and I want to focus on my current tasks.",
type:"analyst"
},

{
text:"Try to solve it immediately without investigating further because I want to show that I can handle problems independently and I prefer to take action rather than waiting.",
type:"fastDecisionMaker"

}

]
];

// ---------------- ADAPTABILITY ----------------


let adaptQuestions = [

  "A new IT system is introduced at your workplace. What do you do?",

  "AI tools are introduced as a support tool in your workplace. How do you respond?",

  "Organisational restructuring occurs at your workplace. What do you do?",

  "New work-processes are introduced at work. How do you respond?",

  "Skill development is required from your boss. What do you do?",

  "Hybrid/remote work is introduced as a method in your company. How do you respond?",

  "Company leadership introduces a new strategic direction. How do you respond?",

  "Communication between your co-workers is unclear. What do you do?",

  "Team structure suddenly changes at work. How do you act?",

  "A system failure suddenly occurs at your workplace. What do you do?",

  "You are granted new and increased responsibilities. What do you do?",

  "You are asked to share important and beneficial knowledge to other co-workers. What do you do?"

];



let adaptOptions = [

[
"I explore the new system independently and try to understand its possibilities",
"I learn the system through training and guidance before fully using it",
"I prefer to continue with existing methods until the benefits of the new system are clear"
],


[
"Use AI actively in my current work-process because it can be a useful supplement to my work.",
"Use it only when needed in new tasks in order to learn it, but I want to make sure I can still do my work independently.",
"Avoid using AI completely and work independently because I prefer to rely on my own skills and knowledge."
],


[
"Immediately look for an  opportunity in order to be a part of it because I am interested in new challenges.",
"Observe the new changes first, then adapt to them when I am ready, since I prefer to adjust with caution.",
"I prefer stability and will try to avoid it in order to maintain my current work style and avoid uncertainty."
],


[
"I will participate actively and even try to help improve the work-process. It is interesting to learn new methods and I want to be a part of the change.",
"I will follow the rules and adjust slowly because I want to make sure I understand the new process correctly.",
"I prefer to continue using the old methods until I feel comfortable with the new process."
],


[
"I will try to learn the new required skills independently because I am open to developing myself professionally.",
"I want to learn them with support from my co-workers because I value cooperation and want to make sure I learn them correctly.",
"I prefer not to change my current skills because I feel more comfortable with what I already know."
],


[
"I will adapt quickly and be open to working from different locations because I value flexibility.",
"I will adjust gradually because I value both flexibility and social interaction with colleagues.",
"I prefer traditional workplace routines because I work best with physical presence and familiar structures."
],


[
"I openly support the new changes because I mostly find new ideas at work interesting and I want to be a part of the change.",
"Observe the newly introduced changes first, then critically determine if I want to support the new changes because I like measuring new ideas before supporting them.",
"Question the new changes at first, since I like discussing new ideas before supporting them in order to make sure they are good and I am comfortable with them."
],


[
"Intervene and ask questions because you really care about your co-workers: 'How did this happen?' and 'How can I help?'",
"Wait for them to resolve it themselves because you are not directly part of it, but you still do care and want to be supportive.",
"Avoid it because you feel uncertain and not comfortable with interfering in your fellow co-workers' issues and you expect there is a service desk that can solve it."
],


[
"I try to integrate as fast as I possibly can in order to impress my boss and show that I can handle new challenges.",
"I try to adjust, but with caution in order to avoid errors and be a competent co-worker in the company.",
"I will try to avoid it with caution. I want to minimize errors so I can maintain being a skilled co-worker."
],


[
"I will try to help fix it immediately with any useful knowledge I have so I can contribute to the solution.",
"I try to work around and focus on my ongoing tasks so I don't fall behind in my work, but I still care about the issue and want to be supportive.",
"Avoid getting involved to focus on my own tasks. I expect there is a service desk that can solve  the issue."
],

[
"I am honored and accept the new responsibilities because I am open to new challenges and want to grow professionally.",
"I accept, but I want to adjust slowly, because I sometimes find it hard learning new challenges fast and I want to ensure I can perform well.",
"I accept but emphasize support to make sure that I can perform the new role and advance with the new responsibilities in order to avoid errors."
],

[
"I openly share my knowledge, even though there is a risk you later on may not get credit for most of your ideas, because I value cooperation and want to be helpful.",
"Only if needed, because I fear that other people may use my own ideas and I won't get the full credit i deserve as the one who came up with the idea, but I still want to be supportive.",
"Only necessary and crucial knowledge because getting the full credit for your own ideas is simply a fair idea and practice."
]

];

// ---------------- UI ----------------


let btnX = 60;

let btnY = 290;

let btnW = 680;

let btnH = 60;


let nextX = 600;

let nextY = 450;

let nextW = 160;

let nextH = 40;





// ---------------- PRELOAD ----------------


// ---------------- PRELOAD ----------------

function preload(){

correctSound = loadSound("assets/correct.wav");
clickSound = loadSound("assets/correct.wav");

bgMusic = loadSound("assets/background.mp3");


coworker = loadImage("assets/coworker.png");

colleagues = loadImage("assets/colleagues.png");

femaleWorker = loadImage("assets/femaleofficeworker.png");


startBackground = loadImage("assets/startbackground.png");

changeBackground = loadImage("assets/changebackground.png");


// QUIZ 2

adaptImages[0] = loadImage("assets/system.png");
adaptImages[1] = loadImage("assets/ai.png");
adaptImages[2] = loadImage("assets/restructure.png");
adaptImages[3] = loadImage("assets/process.png");
adaptImages[4] = loadImage("assets/skills.png");
adaptImages[5] = loadImage("assets/hybrid.png");
adaptImages[6] = loadImage("assets/leadership.png");
adaptImages[7] = loadImage("assets/communication.png");
adaptImages[8] = loadImage("assets/team.png");
adaptImages[9] = loadImage("assets/failure.png");
adaptImages[10] = loadImage("assets/responsibility.png");
adaptImages[11] = loadImage("assets/knowledge.png");

}

// ---------------- SETUP ----------------


function setup(){

  let canvas = createCanvas(800,500);

  canvas.parent("gameContainer");


  if(bgMusic){

    bgMusic.setVolume(0.12);

  }


  if(correctSound){

    correctSound.setVolume(0.04);

  }


  shuffleOptions();

}

// ---------------- DRAW ----------------


function draw(){


background(245);



if(readyScreen){

drawReadyScreen();

return;

}



if(!gameStarted){

drawStartScreen();

return;

}


if(state==="quiz1"){

  drawOffice();
  drawScene();

  if(questionIndex < questions.length){

    drawHUD();  
    drawQuestion();
    drawOptions();

    drawProgressBar();
    drawNext();

  }
  else{
    drawResult();
  }

}  


else if(state==="changeStart"){

drawChangeStartScreen();

}


else if(state==="quiz2"){

drawAdaptability();

}

else if(state==="result2"){

drawAdaptabilityResult();

if(!saved){
  saveToSupabase();
  saved = true;
}

}


}


// ---------------- READY SCREEN ----------------


function drawReadyScreen(){


background(245);


textAlign(CENTER);



fill(0);


textSize(26);



text(
"Are you ready to determine your work style?",
width/2,
200
);



fill(0,140,255);



rect(
width/2-160,
260,
120,
50,
10
);



fill(255);


textSize(18);


text(
"YES",
width/2-100,
293
);



fill(255,215,0);



rect(
width/2+40,
260,
120,
50,
10
);



fill(0);


text(
"NO",
width/2+100,
293
);

fill(0);

textSize(19);

textAlign(CENTER);

text(
noMessage,
110,
350,
600,
100
);


}






// ---------------- START SCREEN ----------------


function drawStartScreen(){



if(startBackground){

image(
startBackground,
0,
0,
width,
height
);

}



fill(0,120);


rect(
0,
0,
width,
height
);



fill(255);


textAlign(CENTER);



textSize(32);



text(
"WORKPLACE SIMULATOR",
width/2,
180
);



textSize(17);



text(
"Make decisions. Shape your work style. Discover your result.",
width/2,
220
);



fill(0,140,255);



rect(
width/2-100,
270,
200,
60,
10
);



fill(255);



textSize(18);



text(
"START",
width/2,
307
);

fill(255);
textAlign(CENTER);
textSize(16);
text("Choose age group:", width/2, 360);

// knapper
fill(200);

// 18–33
if (ageGroup === "18-33") {
  fill(0, 140, 255);
} else {
  fill(200);
}
rect(width/2 - 150, 380, 100, 40, 8);
fill(0);
text("18–33", width/2 - 100, 405);

// 34–45
if (ageGroup === "34-45") {
  fill(0, 140, 255);
} else {
  fill(200);
}
rect(width/2 - 50, 380, 100, 40, 8);
fill(0);
text("34–45", width/2, 405);

// 55+
if (ageGroup === "55+") {
  fill(0, 140, 255);
} else {
  fill(200);
}
rect(width/2 + 50, 380, 100, 40, 8);
fill(0);
text("55+", width/2 + 100, 405);

fill(0, 140, 255);
textSize(14);
textAlign(CENTER);

if (ageGroup) {
  text("Selected: " + ageGroup, width/2, 440);
} else {
  text("Please select your age group", width/2, 440);
}

}

// ---------------- CHANGE START SCREEN ----------------

function drawChangeStartScreen(){


if(changeBackground){

image(
changeBackground,
0,
0,
width,
height
);

}


fill(0,120);

rect(
0,
0,
width,
height
);


fill(255);

textAlign(CENTER);


textSize(32);

text(
"ORGANIZATIONAL CHANGE SIMULATOR",
width/2,
180
);



textSize(18);

text(
"Make decisions. Measure your adaptability.",
width/2,
230
);



fill(0,140,255);


rect(
width/2-100,
280,
200,
60,
10
);



fill(255);


textSize(18);


text(
"START",
width/2,
312
);

}


// ---------------- MOUSE INPUT ----------------

function mousePressed() {

console.log("CLICK:", mouseX, mouseY);
console.log("ageGroup før:", ageGroup);

  // READY SCREEN
  if (readyScreen) {
    if (
      mouseX > width/2 - 160 &&
      mouseX < width/2 - 40 &&
      mouseY > 260 &&
      mouseY < 310
    ) {
      noMessage = "";
      readyScreen = false;
      gameStarted = false;
      startMusic();
    }

    if (
      mouseX > width/2 + 40 &&
      mouseX < width/2 + 160 &&
      mouseY > 260 &&
      mouseY < 310
    ) {
      noMessage = "No worries! This simulation is designed to help you discover your work style, strengths, and how you respond to challenges. Give it a try and learn more about yourself!";
    }
    return;
  }

// START SCREEN
  if (!gameStarted) {


  // 18-33
  if (
    mouseX > width/2 - 150 &&
    mouseX < width/2 - 50 &&
    mouseY > 380 &&
    mouseY < 420
  ) {
    ageGroup = "18-33";
  }


  // 34-45
  if (
    mouseX > width/2 - 50 &&
    mouseX < width/2 + 50 &&
    mouseY > 380 &&
    mouseY < 420
  ) {
    ageGroup = "34-45";
  }


  // 55+
  if (
    mouseX > width/2 + 50 &&
    mouseX < width/2 + 150 &&
    mouseY > 380 &&
    mouseY < 420
  ) {
    ageGroup = "55+";
  }

  if (!ageGroup) {
  noMessage = "Please select an age group first";
} else {
  noMessage = "";
}

  // START knap
if (
  mouseX > width/2 - 100 &&
  mouseX < width/2 + 100 &&
  mouseY > 270 &&
  mouseY < 330
) {
  if (!ageGroup) {
    noMessage = "Please select an age group first";
  } else {
    noMessage = "";
    gameStarted = true;
    startMusic();
  }
}

  return;
}

  // QUIZ 1
  if (state === "quiz1") {

    // Hvis quizzen er færdig → gå til næste del
    if (questionIndex >= questions.length) {
      if (
        mouseX > 300 &&
        mouseX < 500 &&
        mouseY > 340 && 
        mouseY < 390
      ) {

        state = "changeStart";
        adaptIndex = 0;
        adaptAnswered = false;
        adaptAnswers = [];
        changeScore = 0;
      }
      return;
    }

    // Svar på spørgsmål
    if (!answered) {
      for (let i = 0; i < 3; i++) {
        let y = btnY + i * btnH;

        if (
          mouseX > btnX &&
          mouseX < btnX + btnW &&
          mouseY > y &&
          mouseY < y + btnH
        ) {
          answered = true;
          clickSound.setVolume(0.15);
          clickSound.play();

          let selected = options[questionIndex][i].type;

          responses.push(selected);

          if (selected === "team") teamPlayer++;
          else if (selected === "fastDecisionMaker") fastDecisionMaker++;
          else if (selected === "analyst") analyst++;

          feedback = "Your response has been recorded ✓";
          return;   // vigtigt
        }
      }
    }

    // Next knap
    if (
      answered &&
      mouseX > nextX &&
      mouseX < nextX + nextW &&
      mouseY > nextY &&
      mouseY < nextY + nextH
    ) {
      questionIndex++;
      answered = false;
      feedback = "";

      if (questionIndex < questions.length) {
        shuffleOptions();
      }
    }
    return;
  }

  // CHANGE START SCREEN
  if (state === "changeStart") {
    if (
      mouseX > width/2 - 100 &&
      mouseX < width/2 + 100 &&
      mouseY > 280 &&
      mouseY < 340
    ) {
      state = "quiz2";
    }
    return;
  }

  // QUIZ 2 (Adaptability)
  if (state === "quiz2") {
    if (!adaptAnswered) {
      for (let i = 0; i < 3; i++) {
        let y = 270 + i * 50;

        if (
          mouseX > 20 &&
          mouseX < 780 &&
          mouseY > y &&
          mouseY < y + 45
        ) {
          clickSound.setVolume(0.15);
          clickSound.play();

          adaptAnswered = true;
          adaptAnswers.push(i + 1);
          changeScore += [5, 4, 1][i];
          return;
        }
      }
    } 
    else {
      // Next knap i quiz 2
      if (
        mouseX > 600 &&
        mouseX < 760 &&
        mouseY > 440 &&
        mouseY < 475
      ) {
        adaptIndex++;
        adaptAnswered = false;

        if (adaptIndex >= adaptQuestions.length) {
          state = "result2";
        }
      }
    }
  }
}




function shuffleOptions(){

if(questionIndex >= options.length){
return;
}

shuffle(options[questionIndex]);

}

// ---------------- OFFICE ----------------



function drawOffice(){


fill(235);


rect(
0,
100,
width,
200
);



fill(180);


rect(
100,
170,
600,
60,
10
);



}


// ---------------- SCENE ----------------


function drawScene(){
  if(colleagues){
    image(colleagues,20,90,120,120);
  }

  if(coworker){
    image(coworker,320,60,160,160);
  }

  if(femaleWorker){
    image(femaleWorker,660,90,120,120);
  }
} 


// ---------------- QUESTION ----------------



function drawQuestion(){



fill(0);


textAlign(LEFT);



textSize(17.5);



textAlign(LEFT);
textSize(17.5);

textAlign(LEFT);
textSize(17.5);
textLeading(22);

text(
  questions[questionIndex],
  7,
  235,
  width - 14
);



if(feedback==="Your response has been recorded ✓"){

    fill(0,140,255);

}
else{

    fill(0);

}



text(
feedback,
7,
222
);



}










// ---------------- OPTIONS ----------------



function drawOptions(){

textSize(17);

for(let i=0;i<3;i++){

let y = btnY+i*btnH;


fill(255);

stroke(200);


rect(
btnX,
y,
btnW,
btnH,
8
);


noStroke();

fill(0);


textAlign(LEFT);


text(
options[questionIndex][i].text,
btnX+15,
y+15,
btnW-30,
btnH-10
);


}

}







// ---------------- PROGRESS BAR ----------------



function drawProgressBar(){



let progress =
(questionIndex + 1) / questions.length;



fill(220);


rect(
60,
50,
680,
10,
5
);



fill(0,140,255);


rect(
60,
50,
680*progress,
10,
5
);



}









// ---------------- NEXT BUTTON ----------------



function drawNext(){



if(!answered){

return;

}



fill(0,140,255);



rect(
nextX,
nextY,
nextW,
nextH,
10
);



fill(255);



textAlign(CENTER);


textSize(18);



text(
"Next →",
nextX+nextW/2,
nextY+nextH/2+6
);



}


// ---------------- RESULT ----------------


function drawResult(){



background(245);



fill(255);

stroke(220);



rect(
40,
40,
width-80,
height-80,
16
);



noStroke();



fill(0);



textAlign(LEFT);



textSize(26);



text(
"Simulation Complete ✓",
70,
90
);




textSize(16);



fill(80);



text(
"Work style profile:",
70,
120
);





let profile="";

let desc="";


let teamPercent = teamPlayer / questions.length * 100;
let decisionPercent = fastDecisionMaker / questions.length * 100;
let analystPercent = analyst / questions.length * 100;



text(
"Teamwork: " + nf(teamPercent,1,0) + "%",
70,
340
);

text(
"Decision making: " + nf(decisionPercent,1,0) + "%",
70,
370
);

text(
"Analysis: " + nf(analystPercent,1,0) + "%",
70,
400
);

fill(0,140,255);
rect(70,430,teamPercent*3,10);

fill(255,180,0);
rect(70,450,decisionPercent*3,10);

fill(120);
rect(70,470,analystPercent*3,10);


let highest = max(
teamPlayer,
fastDecisionMaker,
analyst
);


if(
teamPlayer === highest &&
fastDecisionMaker !== highest &&
analyst !== highest
){

profile = "Collaborative Problem Solver 🤝";

desc =
"You tend to prioritize team stability and shared success over individual output. " +
"In high-pressure situations you often step in to support others, even when it affects your own deadlines. " +
"You perform best in environments where coordination and communication are central.";

}


else if(
  fastDecisionMaker === highest &&
  teamPlayer !== highest &&
  analyst !== highest
){
  profile = "Action-Oriented Decision Maker ⚡";

  desc =
    "You are comfortable taking initiative, making decisions, and creating progress.";
}


else if(analyst === highest){

profile = "Structured Analyst 🧠";

desc =
"You prefer analysing situations carefully, maintaining quality, and making decisions based on information and structure. " +
"You tend to evaluate risks before acting and perform well in environments where accuracy and thoughtful problem-solving are important.";

}

else{

profile = "Balanced Work Style ⚖️";

desc =
"You adjust your behavior depending on the situation, balancing speed, teamwork, and analysis. " +
"You are flexible and tend to shift approach based on context rather than fixed preference.";

}


fill(30,144,255);



rect(70, 140, 320, 45, 10);




// 🔥 RESET ALIGNMENT (VIGTIG)
textAlign(LEFT, TOP);

// 🟦 PROFILE BOX
fill(30,144,255);
rect(70, 135, 600, 60, 10);

// 🟦 PROFILE TEXT
fill(255);
textSize(20);
textAlign(LEFT, CENTER);
text(profile, 85, 165);

// 🟩 DESC TEXT
fill(60);
textSize(19);
textAlign(LEFT, TOP);
text(desc, 70, 220, width-140, 200);



fill(120);



textSize(14);



textAlign(CENTER);



text(
"Your workplace profile has been generated.",
width/2,
height-97
);
// NEXT QUIZ BUTTON
fill(0,140,255);
rect(300, 340, 200, 50, 10);

// tekst
fill(255);
textAlign(CENTER, CENTER);
textSize(18);
text("NEXT QUIZ →", 400, 365);


}


// ---------------- ADAPTABILITY QUIZ ----------------



function drawAdaptability(){


if(adaptIndex >= adaptQuestions.length){

state="result2";

return;

}


background(245);

// BAGGRUND FØRST
if(adaptImages[adaptIndex]){

image(
adaptImages[adaptIndex],
0,
0,
width,
height
);

fill(0,120);
rect(0,0,width,height);

}

else{

background(245);

}

// QUESTION NUMBER BAR

fill(255);

stroke(200);

rect(
329,
20,
140,
40,
10
);


fill(0);

noStroke();

textAlign(CENTER);

textSize(16);


text(
"Question " + (adaptIndex+1) + " / " + adaptQuestions.length,
400,
32
);


// PROGRESS BAR QUIZ 2

// PROGRESS BAR QUIZ 2

let progress = (adaptIndex + 1) / adaptQuestions.length;

fill(220);

rect(
60,
55,
680,
8,
5
);

fill(0,140,255);

rect(
60,
55,
680 * progress,
8,
5
);

fill(0);



textAlign(LEFT);



textSize(18);



// spørgsmålsboks

fill(255);

stroke(200);

rect(
20,
150,
760,
50,
10
);


// laptop venstre

drawLaptop(5, 164);


// kaffekop højre

drawCoffeeCup(
760,
180
);


// tekst

fill(0);

noStroke();

textSize(18);

textAlign(LEFT);


text(
adaptQuestions[adaptIndex],
70,
155,
660,
90
);




// svarmuligheder

noStroke();
fill(0);
textAlign(LEFT, TOP);
textSize(17);
textWrap(WORD);

for(let i=0;i<3;i++){


let y = 270+i*50;


fill(255);

stroke(200);


rect(
20,
y,
760,
45,
8
);


fill(0);

noStroke();


text(
adaptOptions[adaptIndex][i],
40,
y+5,
700,
40
);


}




// NEXT KNAP

if(adaptAnswered){


fill(0,140,255);


rect(
600,
440,
160,
35,
10
);


fill(255);


textAlign(CENTER);

textSize(18);


text(
"Next →",
680,
450
);

}

}

// ---------------- ADAPTABILITY RESULT ----------------

function drawAdaptabilityResult(){


background(245);


fill(0);

textAlign(LEFT);


textSize(28);

text(
"Simulation Complete ✓",
60,
120
);



let result = "";
let explanation = "";


if(changeScore >=50){

result = "Change-oriented 🔄";

explanation =
"You demonstrate a proactive approach to organisational change. You are comfortable exploring new technologies, processes and responsibilities." +
"You tend to see change as an opportunity for learning and improvement.";

}


else if(changeScore >=30){

result = "Balanced adapter ⚖️";

explanation =
"You show flexibility while also valuing structure and preparation." +
"You can adapt to organisational changes but prefer understanding the purpose and consequences before fully adjusting.";

}


else{

result = "Stability-oriented 📋";

explanation =
"You prefer clear structures, routines and predictable workflows." +
"You may benefit from additional communication and support when adapting to major organisational changes.";

}




fill(0,140,255);


textSize(22);


text(
"Result: " + result,
60,
180
);

text(
"Adaptability score: " + changeScore + "/60",
60,
210
);

// label
textSize(16);
text("Workplace adaptability profile generated based on your decisions.", 60, 240);

// explanation (KUN ÉN GANG)
fill(60);
textSize(19);
text(explanation, 60, 280, 680, 220);




// restart knap

fill(120);

textAlign(CENTER);

textSize(14);

text(
"Thank you for participating! Your result has been recorded.",
width/2,
430
);

} // <-- VIGTIG


// ---------------- HUD ----------------

function drawHUD(){

fill(0);

textSize(14);

textAlign(CENTER);

text(
"Question " +
(questionIndex+1) +
" / " +
questions.length,
400,
30
);

}

// ---------------- RESTART ----------------



function restartGame(){


questionIndex=0;


answered=false;


feedback="";


teamPlayer=0;


fastDecisionMaker=0;


analyst=0;


changeScore=0;


adaptIndex=0;


adaptAnswered=false;


state="quiz1";


gameStarted=false;



shuffleOptions();



}









// ---------------- MUSIC ----------------



function startMusic(){



if(
bgMusic &&
!bgMusic.isPlaying()
){



bgMusic.setVolume(0.12);


bgMusic.loop();



}



}









// ---------------- LAPTOP ----------------



function drawLaptop(x,y){



fill(40);



rect(
x,
y,
40,
25,
3
);



fill(100,200,255);



rect(
x+3,
y+3,
34,
19
);



fill(80);



rect(
x-5,
y+25,
50,
6,
2
);



}









// ---------------- COFFEE CUP ----------------



function drawCoffeeCup(x,y){



fill(255);



stroke(120);



strokeWeight(2);



ellipse(
x,
y,
25,
25
);



fill(80,50,20);



noStroke();



ellipse(
x,
y,
18,
18
);



noFill();



stroke(120);



ellipse(
x+12,
y,
10,
12
);


}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

async function saveToSupabase() {

  let workStyle = getWorkStyle();
  let adaptResult = getAdaptResult();

  console.log("SENDER TIL SUPABASE:",
    responses,
    ageGroup,
    workStyle,
    adaptAnswers,
    changeScore,
    adaptResult
  );


  const { data, error } = await supabaseClient
    .from("responses")
    .insert([
      {
        answers: responses,
        age_group: ageGroup,
        work_style: workStyle,
        adapt_answers: adaptAnswers,
        adapt_score: changeScore,
        adapt_result: adaptResult,
        created_at: new Date().toISOString()
      }
    ]);


  if (error) {

    console.error("❌ Supabase ERROR:", error.message, error);

  } else {

    console.log("✅ SAVED TO SUPABASE:", data);

  }

}

function getWorkStyle(){

let highest = max(
teamPlayer,
fastDecisionMaker,
analyst
);

if(teamPlayer === highest &&
fastDecisionMaker !== highest &&
analyst !== highest){

return "Collaborative Problem Solver";

}

else if(fastDecisionMaker === highest &&
teamPlayer !== highest &&
analyst !== highest){

return "Action-Oriented Decision Maker";

}

else if(analyst === highest){

return "Structured Analyst";

}

else{

return "Balanced Work Style";

}

}



function getAdaptResult(){

if(changeScore >=50){

return "Change-oriented";

}

else if(changeScore >=30){

return "Balanced adapter";

}

else{

return "Stability-oriented";

}

}