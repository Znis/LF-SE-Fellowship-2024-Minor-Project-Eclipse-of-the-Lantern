import { Boss } from "../boss";
import { Character } from "../character";
import { Enemy } from "../enemy";
import { Point } from "../shapes/point";
import { playSound } from "../soundPlayingFunction";
import { voice } from "../sounds";
import { stateVariables } from "../stateVariables";
import { distance } from "../utils/util"; 
export class FireProjectile{ 
    startPoint: Point;
    initialX: number;
    initialY: number;
    r:number;
    endPoint: Point;
    movement_speed: number;
    dir: string;
    toDelete: boolean;
    images: HTMLImageElement[];
    spritePos: number;
    owner: string;
    constructor(startPoint: Point,dir:string,endPoint: Point, owner: string){
        this.startPoint= new Point(startPoint.x-30, startPoint.y+30);
  
    this.dir = dir;
        this.initialX = this.startPoint.x;
        this.initialY = this.startPoint.y;
    
        this.r = 5;
    
        this.endPoint = new Point(endPoint.x * 1.05, endPoint.y * 1.05);
    
        this.movement_speed = 10;
        this.toDelete = false;
        this.images = [];
        this.spritePos = 0;
        this.initialiseImages();
        this.owner = owner;
    }

initialiseImages(){
  
      this.images = stateVariables.flameImages;
      
}
    show(ctx: CanvasRenderingContext2D = stateVariables.ctx){
        const staggerFrame = 5;
            let position = Math.floor(this.spritePos / staggerFrame) % 30;

            ctx.save();

        ctx.translate(this.startPoint.x, this.startPoint.y);
        ctx.rotate(Math.atan2(this.endPoint.y-this.startPoint.y  , this.endPoint.x-this.startPoint.x));
            ctx.drawImage(
              this.images[position],
              -100,
              -100,
           200,200
            );
            ctx.restore();
            this.spritePos++;


    }

    hits(enemy: Enemy | Boss | Character){
        let dist = distance(new Point(this.startPoint.x -100, this.startPoint.y - 130), new Point(enemy.startPoint.x - 50, enemy.startPoint.y - 50));

        playSound(voice.howsharp, 1);

          
        if (dist < this.r +enemy.r)
        {
            return true;
        } else {
            return false;
        }
    }

    evaporate(){
            this.toDelete=true;

    }

    move(){
        
  
            let dx = this.endPoint.x - this.startPoint.x
            let dy = this.endPoint.y - this.startPoint.y
                let dist = distance(this.endPoint, this.startPoint);
                if (dist > this.movement_speed)
                {
                    let ratio = this.movement_speed / dist
                    let x_move = ratio * dx 
                    let y_move = ratio * dy 
                    this.startPoint.x = x_move + this.startPoint.x 
                    this.startPoint.y = y_move + this.startPoint.y
                }
                else
                {   
                    this.startPoint.x = this.endPoint.x
                    this.startPoint.y = this.endPoint.y
                    
                    this.evaporate();
                }

                
        
        
    }
}
