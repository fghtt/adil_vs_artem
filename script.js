let cvs = document.querySelector('canvas');
cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

let ctx = cvs.getContext('2d');

let date1 = new Date();

let bg        = new Image();
let artem     = new Image();
let adil      = new Image();
let adilDead  = new Image();
let pistol    = new Image();
let bullet    = new Image();
let adilGhost = new Image();

let laughter = new Audio();

bg.src     = 'images/background.png';
artem.src  = 'images/artemForward.png';
adil.src   = 'images/adilForward.png';
adilDead.src   = 'images/adilDead.png';
adilGhost.src = 'images/adilGhost.png';
pistol.src = 'images/pistol.png'; 
bullet.src = 'images/bullet.png';

laughter.src = 'audio/gagagagga.mp3';

let xPos       = 0;
let yPos       = 440;
let artemWidth = [65, 70]
let adilXPos   = window.innerWidth - 200;
let adilYPos   = 415;
let pistolYPos = 0;
let pistolXPos = 0;
let bulletXPos = 0;

let spriteInterval = 68;

let haveArmor = 'no'

let n = 1;

let aInx = 1;

let system = 'play';

let doShoot = false;

let adilIsLive = true;

let timeDeath = 0;

let look = 'forward';

let score = 0;

let scoreElement = document.querySelector('.score');

let hpElement = document.querySelector('.hp');

let time1 = date1.getTime();

let hp = 3;

function status( option ){
    
    system = option;

}

function draw(){

    ctx.drawImage(bg, 0, 0, window.innerWidth, window.innerHeight);
    ctx.drawImage(artem, spriteInterval * ( n - 1 ), 0, artemWidth['0'], 133, xPos, yPos, artemWidth['1'], 135);

    scoreElement.innerHTML = score;
    hpElement.innerHTML = hp;

    if( hp === 0 ){
    	location.reload();
    }
    
    if( xPos > window.innerWidth ){
    	xPos = 0;
    }

    if( xPos < 0 ){
    	xPos = window.innerWidth;
    }

    if( system !== 'play'){
    	return;
    }
    
    let date2 = new Date();
    
    if ( date2 - time1 > 1000 && haveArmor === 'no' ){

    	if( pistolXPos === 0 ){
    		pistolXPos = Math.floor(Math.random() * (window.innerWidth - 60)) + 60;
    	}
        ctx.drawImage(pistol, pistolXPos, pistolYPos, 60, 41);
        if( pistolYPos < 530 ){
        	pistolYPos += 10;
        }
    }
    
    if( xPos - 60 < pistolXPos && xPos + 60 > pistolXPos && yPos === 440 && pistolYPos > 1){
        
        if( look === 'forward' ){
            artem.src = 'images/artemPistol.png';
        } 

        if( look === 'back' ){
        	artem.src = 'images/artemPistolBack.png';
        }
    	
    	haveArmor = 'yes';
    	spriteInterval = 120;
    	artemWidth['0'] = 115;
    	artemWidth['1'] = 125;
    	pistolYPos = -100;
    }

    if( haveArmor === 'no' ){
    	if( look === 'forward' ){
    		artem.src = 'images/artemForward.png';
    	}
    	
    	if ( look === 'back' ){
    		artem.src = 'images/artemBack.png';
    	}
    }

    if( adilIsLive ){
    	adilGo();
    }else{
    	let timeToReverse = new Date();

    	if( timeToReverse - timeDeath > 3000 ){

    		save();
    	}else{
    		ctx.drawImage( adilDead, adilXPos, adilYPos + 120, 170, 32);
    	}
        
    }

    

    requestAnimationFrame(draw);
}

let st;
let count = 0;

function punch(){

    if ( count < 160 ){
    	requestAnimationFrame( punch );
    }else{
    	count = 0;
    	fall();
    }
    
    if( adilXPos >= xPos ){
        xPos -= 20;
    }

    if( adilXPos <= xPos ){
    	xPos += 20
    }

    yPos -= 20;

    count += 20;
}
function goForward( status ){

	if( status === "go" ){
		st = "go";
		if( haveArmor === 'no'){
			artem.src = 'images/artemForward.png';
		}
		if( haveArmor === 'yes' ){
			artem.src = 'images/artemPistol.png';
		}
		
	}
        
    if( st === "go" ){
    	requestAnimationFrame( goForward );
    }
    if( status === "stop"){
    	st = "";
    	n = 1;
    	return;
    }
    n++;
    xPos += 8;
    look = 'forward';

    if ( n >= 3 ){
    	n = 1;
    }
}

function goBack( status ){

	if( status === "go" ){
		st = "go";
		if( haveArmor === 'no'){
			artem.src = 'images/artemBack.png';
		}
		if( haveArmor === 'yes'){
			artem.src = 'images/artemPistolBack.png';
		}
	}
        
    if( st === "go" ){
    	requestAnimationFrame( goBack );
    }

    if( status === "stop"){
    	st = "";
    	n = 1;
    	return;
    }
    
   
    n++;
    xPos -= 8;
    look = 'back';
    if ( n >= 3 ){
    	n = 1;
    }
}

function jump(){
    
	if( yPos === 440){

		let intervalId = setInterval( () => {

		if ( yPos === 250 ){

			clearInterval( intervalId);	
    	    fall();

    	}

    	yPos -= 10;

        

        }, 10);
	}
}

function fall(){

	if ( yPos < 440 ){
		yPos += 10;
		requestAnimationFrame( fall );
	}
}

function shoot(){

	if( doShoot === false ){

		if( look === 'forward' ){
			bulletXPos = xPos + artemWidth['0'];
		}

		if( look === 'back' ){
            bulletXPos = xPos + artemWidth['0'] - 90;
        }
		
	}

	if( haveArmor === 'yes' ){

		doShoot = true;

		ctx.drawImage( bullet, bulletXPos, 470, 47, 15);

		if( look === 'forward' ){
			bullet.src = 'images/bullet.png';
			bulletXPos += 15;
		}
 
        if( look === 'back' ){
        	bullet.src = 'images/bulletBack.png';
            bulletXPos -= 15;
        }

        if( adilXPos > bulletXPos - 10 && adilXPos < bulletXPos + 10 && adilIsLive){
        	haveArmor = 'no';
        	doShoot = false;
        	artemWidth['0'] = 65;
         	artemWidth['1'] = 70;
         	spriteInterval = 68;
         	pistolXPos = 0;
         	adilIsLive = false;
         	score++;
         	timeDeath = new Date();
        }
        if( bulletXPos < 0 || bulletXPos > window.innerWidth ){
        	haveArmor = 'no';
        	doShoot = false;
        	artemWidth['0'] = 65;
         	artemWidth['1'] = 70;
         	spriteInterval = 68;
         	pistolXPos = 0;
        }

        requestAnimationFrame( shoot );

	}
}

function adilGo(){

	ctx.drawImage( adil, 178 * ( aInx - 1 ), 0, 178, 248, adilXPos, adilYPos, 104, 153);
    
    if( xPos > adilXPos ){
        adilXPos += 2;

        if( aInx === 3 ){
            aInx = 1;
    	}

    	aInx++;
        adil.src = 'images/adilForward.png';
    }

    if( xPos < adilXPos ){
    	adilXPos -= 2;

    	if( aInx === 3 ){
            aInx = 1;
    	}

    	aInx++;
    	adil.src = 'images/adilBack.png';
    }

    if( adilXPos > xPos - 20 && adilXPos < xPos + 20 && yPos === 440 ){
    	hp--;
        punch();
    }

}

function save(){

    let timeToSave = new Date();

    laughter.play();

    if( timeToSave - timeDeath > 6000 ){
    	adilIsLive = true;
    }

    if( xPos < adilXPos ){
    	adilGhost.src = 'images/adilGhostBack.png';
    }

    if( xPos > adilXPos ){
    	adilGhost.src = 'images/adilGhost.png';
    }

    ctx.drawImage( adilGhost, adilXPos, adilYPos, 81, 143);
}
draw();