

let flowers = [
  'red.png',
   'white.png',
   'green.png',
   'golden_start2.png',
   'bling.png'
 ];
 
 
 let spritesFlowers = [];
 
 let group = [];
 
 
 let settings = {
 
 flowers: true, 
 
 fr: 60,
   redraw_bg: true,
   damping: 1,
   transparency: 0.5,
   seek: 0.5,
   rotate: false,
   twitch: 0, 
 
   separate: 0.5, 
   cohesion: 0, 
   align: 0,
 
   numberOfAgents: 108,
   size: 100,
 
 };
 
 let bg_color = {
   bg_red: 255,
   bg_green:255,
   bg_blue: 255,
 bg_alpha: 255
 }
 
 
 let gui;
 
 let paused = false; 
 //----------------------------------------------
 
 function preload() {
 
   for ( let f of flowers) {
     let img = loadImage(f);
     spritesFlowers.push(img);
   }
 }
 
 
 //----------------------------------------------
 // Create a new canvas to match the browser size
 function setup() {
   createCanvas(windowWidth, windowHeight);
   frameRate(settings.fr);
    noStroke();
   
   //  gui = new dat.GUI();
 
   // gui.add(settings, 'numberOfAgents', 0, 200, step=1).name('Number of agents');
   // gui.add(settings, 'size', 10, 200, step=1).name('Agent Size');
   // gui.add(settings, 'damping', 0.1, 1).name('Speed');
   // gui.add(settings, 'fr', 10, 300).name('Frame Rate');
 
   // gui.add(settings, 'rotate', false, true).name('Rotate');
   // gui.add(settings, 'twitch', 0, 2).name('Twitch');
   // gui.add(settings, 'seek', 0.01, 0.9).name('Seek the Mouse');
   // gui.add(settings, 'separate', 0, 3).name('Separation');
   // gui.add(settings, 'cohesion', 0, 2).name('Cohesion');
   // gui.add(settings, 'align', 0, 2).name('Alignment');
   // gui.add(bg_color, 'bg_red', 0, 255).name(('Background Red'));
   // gui.add(bg_color, 'bg_green', 0, 255).name(('Background Green'));
   // gui.add(bg_color, 'bg_blue', 0, 255).name(('Background Blue'));
   // gui.add(settings, 'redraw_bg').name('Redraw Background');
   
   // // gui.add(settings, 'emojis', false, true).name('Emojis'),
 
   
 
  
 
   
 
  
 
   // gui.remember(settings);
   // gui.width = 300;
   // gui.close();
   
   background(bg_color.bg_red, bg_color.bg_green, bg_color.bg_blue, bg_color.bg_alpha);
 }
 
 //----------------------------------------------
 // On window resize, update the canvas size
 function windowResized() {
   resizeCanvas(windowWidth, windowHeight);
   background(bg_color.bg_red, bg_color.bg_green, bg_color.bg_blue, bg_color.bg_alpha);
 }
 
 //----------------------------------------------
 function keyPressed() { 
   if (key == ' ') {
     if (paused == false) {
       noLoop();  
       paused = true;
     }  
     else {
       loop(); 
       paused = false;
     }    
   }
   
   if (key == 's') {
     save("culture_bot.jpg");
   }
   if (key == 'r') {
     background(bg_color.bg_red, bg_color.bg_green, bg_color.bg_blue, bg_color.bg_alpha);
   }
   if (key == 'd') {
      settings.redraw_bg = !settings.redraw_bg;
   
   }
 }
 
 //----------------------------------------------
 // Main render loop 
 function draw() {
  



   // Fill in the background
   frameRate(settings.fr);
   if (settings.redraw_bg){
   background(bg_color.bg_red, bg_color.bg_green, bg_color.bg_blue, bg_color.alpha);
  };  
   
   if (settings.numberOfAgents > group.length) {
     let agent = createAgent(); 
     group.push(agent);
   }  
   if (settings.numberOfAgents < group.length) {
     group.pop();
   }
  
 
 
   let mouse = new p5.Vector(mouseX, mouseY);
     
   for (let agent of group) { 
     // behaviours
     seek(agent, mouse, settings.seek);
   
     twitch(agent, settings.twitch);
     
     separate(agent, group, settings.separate);
     
     align(agent, group, settings.align);
     
     cohesion(agent, group, settings.cohesion);
      
     move(agent);
    
     wrap(agent);  // teleport the agent back to the other side
     
     render(agent);
   }
 }
 
 //----------------------------------------------
 function createAgent() {
  
   let newAgent = { 
   
     pos: new p5.Vector(random(width), random(height)),  // pos -> position   
     vel: new p5.Vector(random(-1, 1), random(-1, 1)),   // vel -> velocity 
     acc: new p5.Vector(),  
     maxspeed: random(2, 6), 
     maxforce: settings.damping,
     color: [random(255), random(255), random(255)],
     spritesFlowers: random(spritesFlowers),
     
   };  
   return newAgent; 
 }
 
 //----------------------------------------------
 function render(agent) { 
 
 
   push(); 
   // if (settings.square) {
    
     // let n = sin((agent.id+frameCount)*0.)
     // let s = map(n, -1, 1, 1, 10);
     
     stroke(agent.color);
     fill(agent.color);
     // strokeWeight(s);
     //let n = noise((agent.id+frameCount)*0.01);
     //let n = random(1);
     translate(agent.pos.x, agent.pos.y);
 
     
 
 if (settings.rotate == false && settings.flowers == true)  {
     imageMode(CENTER);
     image(agent.spritesFlowers, 0, 0, settings.size, settings.size);
   }
   
   else if (settings.rotate == true && settings.flowers == true)  {
     rotate(agent.vel.heading());
     imageMode(CENTER);
     image(agent.spritesFlowers, 0, 0, settings.size, settings.size);
   }
 
 
 pop();
 }
 
 
 
 
 //----------------------------------------------
 function move(agent) {  
   agent.vel.add(agent.acc);       // vel = vel + acc   
   agent.vel.mult(settings.damping);
   agent.pos.add(agent.vel);       // pos = pos + vel    
   agent.acc.mult(0);              // acc = acc * 0 --> resets
 }
 
 //----------------------------------------------
 function wrap(agent) {
   if (agent.pos.x < -100) agent.pos.x = width+100; 
   if (agent.pos.y < -100) agent.pos.y = height+100; 
   if (agent.pos.x > width+100) agent.pos.x = -100; 
   if (agent.pos.y > height+100) agent.pos.y = -100;   
 }
 
 
 //----------------------------------------------
 function applyForce(agent, force, strength=1) {
   force.mult(strength);
   agent.acc.add(force);           // add the force to the agent's acceleration 
 }
 
 //----------------------------------------------
 function seek(agent, target, strength=1) {
   let targetDirection = p5.Vector.sub(target, agent.pos); // targetDirection = target - agent.pos 
   targetDirection.normalize();  // 
   targetDirection.mult(agent.maxspeed);
   
   steer(agent, targetDirection, strength);
 }
 
 //----------------------------------------------
 function steer(agent, targetDirection, strength=1) { 
   let steer = p5.Vector.sub(targetDirection, agent.vel); 
   steer.limit(agent.maxforce);
   applyForce(agent, steer, strength);
 }
 
 //----------------------------------------------
 function separate(agent, group, strength=1) {
   
   let separation = settings.size + 80;  // radius neightbourhood/sensorium
   
   let sum = new p5.Vector(); 
   let count = 0;
   
   for (let other of group) {
     let d = agent.pos.dist(other.pos);    
     if (d > 0 && d < separation) { 
       let diff = p5.Vector.sub(agent.pos, other.pos); 
       diff.normalize();  // weight in favor of the closer objects
       diff.div(d);       
       sum.add(diff);
       count++;  // keep track of how many we've added to sum 
     }    
   }
    
   if (count > 0) {
     sum.div(count);
     sum.setMag(agent.maxspeed);
     // steer towards the averaged sum 
     steer(agent, sum, strength);  
   }
 }
 
 //----------------------------------------------
 function align(agent, group, strength=1) {
    
   let neighborhood = settings.size+80;  // radius neightbourhood/sensorium
   
   let sum = new p5.Vector(); 
   let count = 0;
   
   for (let other of group) {
     let d = agent.pos.dist(other.pos);    
     if (d > 0 && d < neighborhood) { 
       sum.add(other.vel); // velocity -> heading 
       count++;
     }
   }
   
   if (count > 0) {
     sum.div(count);    
     sum.normalize(); 
     sum.mult(agent.maxspeed);
     // steer towards the averaged sum 
     steer(agent, sum, strength);  
   }
 }
 
 
 //----------------------------------------------
 function cohesion(agent, group, strength=1) {
    
   let neighborhood = settings.size+80;  // radius neightbourhood/sensorium
   
   let sum = new p5.Vector(); 
   let count = 0;
   
   for (let other of group) {
     let d = agent.pos.dist(other.pos);    
     if (d > 0 && d < neighborhood) { 
       sum.add(other.pos); // velocity -> heading 
       count++;
     }
   }
   
   if (count > 0) {
     sum.div(count);
     // seek the averaged position 
     seek(agent, sum, strength);  
   }
 }
 
 //----------------------------------------------
 function twitch(agent, strength=1, twitchRadius=PI/2, twitchRate=0.01) {
   let twitchDirection = agent.vel.copy(); 
   let n = noise((agent.pos.x + frameCount) * twitchRate);
   let twitchAngle = map(n, 0, 1, -twitchRadius, twitchRadius);
   twitchDirection.rotate(twitchAngle);   
   steer(agent, twitchDirection, strength);  
 }