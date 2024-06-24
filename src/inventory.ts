import { canvas } from "./main";
import { GameState, inventory, stateVariables } from "./stateVariables";

interface Ability {
  name: string;
  src: string;
  maxCooldown: number;
  cooldown: number;
  cooldownInterval: number;
}
export class Inventory {
  fuelImg: HTMLImageElement;
  medKitImg: HTMLImageElement;
  ammoImg: HTMLImageElement;
  abilities: Ability[];
  showMessage: boolean;
  constructor() {
    this.fuelImg = {} as HTMLImageElement;
    this.medKitImg = {} as HTMLImageElement;
    this.ammoImg = {} as HTMLImageElement;
    this.abilities = [
      {
        name: "Light of Blessings",
        src: "assets/abilities/light.png",
        maxCooldown: 30,
        cooldown: 0,
        cooldownInterval: 0,
      },
      {
        name: "Breath of Dragon",
        src: "assets/abilities/flame.png",
        maxCooldown: 20,
        cooldown: 0,
        cooldownInterval: 0,
      },
    ];
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
    if (message)
      ctx.fillText(message, canvas.width / 2, canvas.height - 50, 400);
  }

  displayWeapons(ctx: CanvasRenderingContext2D = stateVariables.ctx) {
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

    if (stateVariables.player.currWeapon == "axe") {
      ctx.strokeStyle = "aqua";
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 2, y - 2, boxSize + 4, boxSize + 4);
    }

    const imgGun = new Image();
    imgGun.src = "assets/axe.png";

    ctx.drawImage(imgGun, x, y, boxSize, boxSize);

    x = 80;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, boxSize, boxSize);
    if (stateVariables.player.currWeapon == "gun") {
      ctx.strokeStyle = "aqua";
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 2, y - 2, boxSize + 4, boxSize + 4);
    }

    const imgAxe = new Image();
    imgAxe.src = "assets/gun.png";

    ctx.drawImage(imgAxe, x, y, boxSize, boxSize);
  }

  displayAbilities(ctx: CanvasRenderingContext2D = stateVariables.ctx) {
    const boxSize = 40;
    const borderColor = "#333";
    const x = stateVariables.windowWidth - 215;
    ctx.font = "18px Outfit";
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.fillText("Abilities", x, 120);

    for (let [index, ability] of this.abilities.entries()) {
      const cooldownTime = ability.cooldown;
      const maxCooldown = ability.maxCooldown;

      let y = 150 + index * 70;

      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, boxSize, boxSize);

      const img = new Image();
      img.src = ability.src;

      ctx.drawImage(img, x, y, boxSize, boxSize);

      ctx.font = "14px Outfit";
      ctx.textAlign = "right";
      ctx.fillStyle = "white";
      ctx.fillText(ability.name, stateVariables.windowWidth - 40, y + 25);

      if (cooldownTime > 0) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(
          x + 1,
          y + (boxSize / maxCooldown) * (maxCooldown - cooldownTime) + 2,
          boxSize - 2,
          boxSize - (boxSize / maxCooldown) * (maxCooldown - cooldownTime) - 2
        );

        ctx.fillStyle = "white";
        ctx.font = "16px Outfit";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${cooldownTime}s`, x + boxSize / 2, y + boxSize / 2);

        if (!ability.cooldownInterval) {
          ability.cooldownInterval = setInterval(() => {
            if (
              ability.cooldown > 0 &&
              stateVariables.gameState != GameState.paused
            )
              ability.cooldown--;
          }, 1000);
        }
      }
    }
  }

  resetAbility(ability: string) {
    if (ability == "light")
      this.abilities[0].cooldown = this.abilities[0].maxCooldown;
    if (ability == "flame")
      this.abilities[1].cooldown = this.abilities[1].maxCooldown;
  }
}
