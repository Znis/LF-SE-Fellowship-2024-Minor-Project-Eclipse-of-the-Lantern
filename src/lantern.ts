import { canvas } from "./main";
import { stateVariables } from "./stateVariables";

export class Lantern {
  x: number;
  y: number;
  maxRadiusInnerCircle: number;
  maxRadiusOuterCircle: number;
  decreaseLuminosity: number | null;
  constructor() {
    this.decreaseLuminosity  = null;
    this.x = stateVariables.player.startPoint.x + 20;
    this.y = stateVariables.player.startPoint.y + 50;
    this.maxRadiusInnerCircle = 250;
    this.maxRadiusOuterCircle =
      Math.max(stateVariables.windowWidth, stateVariables.windowHeight) / 2;
  }
  showLuminosity() {
    const gradient = stateVariables.ctx.createRadialGradient(
      this.x,
      this.y,
      this.maxRadiusInnerCircle,
      this.x,
      this.y,
      this.maxRadiusOuterCircle

    );
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)"); 
    gradient.addColorStop(0.1, "rgba(0, 0, 0, 0.8)"); 
    gradient.addColorStop(0.2, "rgba(0, 0, 0, 0.9)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 1)"); 

    stateVariables.ctx.fillStyle = gradient;

    stateVariables.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  changeLuminosity(){
    if(!this.decreaseLuminosity){
    this.decreaseLuminosity = setInterval(() => {
        if(this.maxRadiusInnerCircle <= 0){
            this.maxRadiusInnerCircle = 0;
            clearInterval(this.decreaseLuminosity!);
        }else{
        this.maxRadiusInnerCircle -= 1;
        }

    }, 200);
  
  }

  }
  resetLuminosity(){
      const resetLuminosity = setInterval(() => {
          if(this.maxRadiusInnerCircle >= 250){
              this.maxRadiusInnerCircle = 250;
              clearInterval(resetLuminosity);
          }else{
          this.maxRadiusInnerCircle += 5;
          }
  
      }, 10);
    
    
    
  }
}
