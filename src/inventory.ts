import { canvas } from "./main";
import { inventory, stateVariables } from "./stateVariables";

export class Inventory {
  fuelImg: HTMLImageElement;
  medKitImg: HTMLImageElement;
  ammoImg: HTMLImageElement;
  abilities: { [key: string]: {[key: string]: number} };
  constructor() {
    this.fuelImg = {} as HTMLImageElement;
    this.medKitImg = {} as HTMLImageElement;
    this.ammoImg = {} as HTMLImageElement;
    this.abilities = {
      "fireball": {  maxCooldown: 10, cooldown: 10, cooldownInterval: 0 },
      "light of blessings": { maxCooldown: 15, cooldown: 15, cooldownInterval: 0 },
  };
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

    this.displayAbilities();
  }

  displayMessage(
    ctx: CanvasRenderingContext2D = stateVariables.ctx,
    item: string
  ) {
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "24px Outfit";

    if (item == "health_pack")
      ctx.fillText(
        `Out of Med Kit!`,
        canvas.width / 2,
        canvas.height - 50,
        400
      );
    if (item == "fuel")
      ctx.fillText(`Out of Fuel!`, canvas.width / 2, canvas.height - 50, 400);
    if (item == "ammo")
      ctx.fillText(`Out of Ammo!`, canvas.width / 2, canvas.height - 50, 400);
  }

displayWeapons(ctx: CanvasRenderingContext2D = stateVariables.ctx){

}

  displayAbilities(ctx: CanvasRenderingContext2D = stateVariables.ctx) {
    
      const boxSize = 40;
      const borderColor = "#333";
      const x = stateVariables.windowWidth - 245;
      const y = 100;
      const cooldownTime = this.abilities["fireball"].cooldown;
      const maxCooldown = this.abilities["fireball"].maxCooldown;

      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, boxSize, boxSize);

      const img = new Image();
      img.src = "assets/inventory/fuel.png";

      ctx.drawImage(img, x, y, boxSize, boxSize);

      ctx.font = "14px Outfit";
      ctx.textAlign = "right";
      ctx.fillStyle = "white";
      ctx.fillText("Light of Blessings", stateVariables.windowWidth - 70, 120);

      if(cooldownTime > 0){

      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(
        x+2,
        y + (boxSize/maxCooldown) * (maxCooldown - cooldownTime) + 4,
        boxSize - 4,
        boxSize - (boxSize/maxCooldown) * (maxCooldown - cooldownTime) - 4
      );

      ctx.fillStyle = "white";
      ctx.font = "16px Outfit";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${cooldownTime}s`, x + boxSize / 2, y + boxSize / 2);



      if(!this.abilities["fireball"].cooldownInterval){
      this.abilities["fireball"].cooldownInterval = setInterval(() => {
         
        if(this.abilities["fireball"].cooldown > 0) this.abilities["fireball"].cooldown--;

      }, 1000);
    }

    }

  }
}
