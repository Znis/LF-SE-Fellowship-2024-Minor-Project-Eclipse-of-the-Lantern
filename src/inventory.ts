import { canvas } from "./main";
import { inventory, stateVariables } from "./stateVariables";

export class Inventory {
  fuelImg: HTMLImageElement;
  medKitImg: HTMLImageElement;
  ammoImg: HTMLImageElement;
  abilities: { [key: string]: {[key: string]: number} };
  showMessage: boolean;
  constructor() {
    this.fuelImg = {} as HTMLImageElement;
    this.medKitImg = {} as HTMLImageElement;
    this.ammoImg = {} as HTMLImageElement;
    this.abilities = {
      "light": {  maxCooldown: 20, cooldown: 0, cooldownInterval: 0 },

  };
  this.showMessage = false;
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
    ctx.font = "18px Outfit";
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.fillText("Items", 80, 100);

    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "16px Outfit";

    ctx.drawImage(this.medKitImg, 30, 120, 40, 40);
    ctx.fillText(`x ${inventory.medKit}`, 100, 145, 100);

    ctx.drawImage(this.fuelImg, 30, 180, 40, 40);
    ctx.fillText(`x ${inventory.fuel}`, 100, 210, 100);

    ctx.drawImage(this.ammoImg, 30, 240, 40, 40);
    ctx.fillText(`x ${inventory.ammo}`, 100, 265, 100);

    this.displayWeapons();
    this.displayAbilities();
  }

  displayMessage(
    ctx: CanvasRenderingContext2D = stateVariables.ctx,
    item: string | void,
    message: string | void
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
    if(message) ctx.fillText(message, canvas.width / 2, canvas.height - 50, 400);
  }

displayWeapons(ctx: CanvasRenderingContext2D = stateVariables.ctx){
  ctx.font = "18px Outfit";
  ctx.textAlign = "left";
  ctx.fillStyle = "white";
  ctx.fillText("Weapons", 30, 320);

  const boxSize = 30;
  const borderColor = "#333";
  let x = 30;
  const y = 350;


  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, boxSize, boxSize);

  if(stateVariables.player.currWeapon == "axe"){
  ctx.strokeStyle = "aqua";
  ctx.lineWidth = 2;
  ctx.strokeRect(x-2, y-2, boxSize+4, boxSize+4);
  }

  const imgGun = new Image();
  imgGun.src = "assets/axe.png";

  ctx.drawImage(imgGun, x, y, boxSize, boxSize);

  x = 80;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, boxSize, boxSize);
  if(stateVariables.player.currWeapon == "gun"){
  ctx.strokeStyle = "aqua";
  ctx.lineWidth = 2;
  ctx.strokeRect(x-2, y-2, boxSize+4, boxSize+4);
  }
  
  const imgAxe = new Image();
  imgAxe.src = "assets/gun.png";

  ctx.drawImage(imgAxe, x, y, boxSize, boxSize);

}

  displayAbilities(ctx: CanvasRenderingContext2D = stateVariables.ctx) {
      const boxSize = 40;
      const borderColor = "#333";
      const x = stateVariables.windowWidth - 215;
      const y = 150;
      const cooldownTime = this.abilities["light"].cooldown;
      const maxCooldown = this.abilities["light"].maxCooldown;

      ctx.font = "18px Outfit";
      ctx.textAlign = "left";
      ctx.fillStyle = "white";
      ctx.fillText("Abilities", x, 120);



      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, boxSize, boxSize);

      const img = new Image();
      img.src = "assets/abilities/light.png";

      ctx.drawImage(img, x, y, boxSize, boxSize);

      ctx.font = "14px Outfit";
      ctx.textAlign = "right";
      ctx.fillStyle = "white";
      ctx.fillText("Light of Blessings", stateVariables.windowWidth-40, 170);

      if(cooldownTime > 0){

      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(
        x+1,
        y + (boxSize/maxCooldown) * (maxCooldown - cooldownTime) + 2,
        boxSize - 2,
        boxSize - (boxSize/maxCooldown) * (maxCooldown - cooldownTime) - 2
      );

      ctx.fillStyle = "white";
      ctx.font = "16px Outfit";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${cooldownTime}s`, x + boxSize / 2, y + boxSize / 2);



      if(!this.abilities["light"].cooldownInterval){
      this.abilities["light"].cooldownInterval = setInterval(() => {
         
        if(this.abilities["light"].cooldown > 0) this.abilities["light"].cooldown--;

      }, 1000);
    }

    }

  }

  resetUltimate(){
    this.abilities["light"].cooldown = this.abilities["light"].maxCooldown;
  }
}
