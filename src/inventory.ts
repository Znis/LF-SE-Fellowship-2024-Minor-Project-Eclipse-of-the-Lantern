import { canvas } from "./main";
import { inventory, stateVariables } from "./stateVariables";

export class Inventory {
  fuelImg: HTMLImageElement;
  medKitImg: HTMLImageElement;
  ammoImg: HTMLImageElement;
  constructor() {
    this.fuelImg = {} as HTMLImageElement;
    this.medKitImg = {} as HTMLImageElement;
    this.ammoImg = {} as HTMLImageElement;
  }
  initialiseImages() {
    const loadImage = (fullPath: string) => {
      const img = new Image();
      img.src = fullPath;
      return img;
    };
    this.fuelImg = loadImage("./assets/inventory/fuel.png");
    this.medKitImg = loadImage("./assets/inventory/medkit.png");
    this.ammoImg = loadImage("./assets/inventory/ammo.png");
  }

  show(ctx: CanvasRenderingContext2D = stateVariables.ctx) {
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "16px Outfit";

    ctx.drawImage(this.medKitImg, 30, 80, 40, 40);
    ctx.fillText(`x ${inventory.medKit}`, 100, 105, 100);

    ctx.drawImage(this.fuelImg, 30, 140, 40, 40);
    ctx.fillText(`x ${inventory.fuel}`, 100, 170, 100);

    ctx.drawImage(this.ammoImg, 30, 200, 40, 40);
    ctx.fillText(`x ${inventory.ammo}`, 100, 225, 100);
  }

displayMessage(ctx: CanvasRenderingContext2D = stateVariables.ctx, item: string){
  ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "24px Outfit";

    if(item == "health_pack") ctx.fillText(`Out of Med Kit!`, canvas.width/2, canvas.height - 50, 400);
    if(item == "fuel") ctx.fillText(`Out of Fuel!`, canvas.width/2, canvas.height - 50, 400);
    if(item == "ammo") ctx.fillText(`Out of Ammo!`, canvas.width/2, canvas.height - 50, 400);
    
}

}
