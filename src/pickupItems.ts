import { Point } from "./shapes/point";
import fuel from "./sprites/fuel";
import { inventory, stateVariables } from "./stateVariables";
import { distance } from "./utils/util";

export class PickupItems {
  images: HTMLImageElement[];
  startPoint: Point;
  isUsed: boolean;
  type: { [key: string]: string };
  frameCount: number;
  spritePos: number;
  constructor(x: number, y: number, pickupItemType: { [key: string]: string }) {
    this.images = [];
    this.startPoint = new Point(x, y);
    this.isUsed = false;
    this.type = pickupItemType;
    this.frameCount = 11;
    this.spritePos = 0;
  }

  initialiseImages() {
    for (let i = 1; i <= this.frameCount; i++) {
      const img = new Image();
      img.src = `${this.type.images_path}${this.type.itemName} (${i}).png`;
      this.images[i - 1] = img;
    }
  }

  show(
    img: HTMLImageElement,
    shadowFrame: number,
    ctx: CanvasRenderingContext2D = stateVariables.ctx
  ) {
    const imgX = this.startPoint.x;
    const imgY = this.startPoint.y;
    let ellipseX = imgX + 16;
    let ellipseY = imgY + 40;
    let ellipseWidth = shadowFrame + 10;
    let ellipseHeight = shadowFrame + 5;

    if (this.type.itemName == "fuel") {
      const staggerFrame = 5;
      let position = Math.floor(this.spritePos / staggerFrame) % 8;
      ctx.drawImage(
        fuel.sprite,
        fuel.position[position].x,
        fuel.position[position].y,
        fuel.width,
        fuel.height,
        imgX,
        imgY,
        30,
        30
      );
      this.spritePos++;
    } else if (this.type.itemName == "health_pack") {
      ellipseX = imgX + 30;
      ellipseY = imgY + 50;
      ellipseWidth = shadowFrame + 14;
      ellipseHeight = shadowFrame + 4;
      ctx.drawImage(img, imgX, imgY, 60, 60);
    } else if (this.type.itemName == "ammo") {
      ellipseWidth = shadowFrame + 22;
      const img = new Image();
      img.src = "./assets/inventory/ammo.png";
      ctx.drawImage(img, imgX, imgY, 30, 30);
    }

    ctx.fillStyle = "rgba(20, 20, 20, 150)";

    ctx.beginPath();
    ctx.ellipse(
      ellipseX,
      ellipseY,
      ellipseWidth / 2,
      ellipseHeight / 2,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  collect() {
    if (distance(this.startPoint, stateVariables.player.startPoint) < 50) {
      if (this.type.itemName == "health_pack") {
        inventory.medKit++;
      } else if (this.type.itemName == "fuel") {
        inventory.fuel++;
      } else if (this.type.itemName == "ammo") {
        inventory.ammo += 50;
      }
      this.isUsed = true;
    }
  }
}
