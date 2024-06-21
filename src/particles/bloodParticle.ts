import { stateVariables } from "../stateVariables";
import { Point } from "../shapes/point";

export class BloodParticle {
  startPoint: Point;
  state: number;
  blood_img: HTMLImageElement[];
  show: boolean;
  constructor(x: number, y: number) {
    this.startPoint = new Point(x, y);
    this.state = 0;
    this.show = true;
    this.blood_img = [];
  }

  initialiseImages(path: string, frames: number) {
    const loadImages = () => {
      const imagesArray = [];
      for (let i = 0; i <= frames; i++) {
        const img = new Image();
        img.src = `${path}/sprite_${i}.png`;
        imagesArray.push(img);
      }
      return imagesArray;
    };

    this.blood_img = loadImages();

    for (let i = 0; i < this.blood_img.length-1; i++) {
      setTimeout(() => {
        this.state++;
      }, 90 * i);
    }
  }

  showAnimation(ctx: CanvasRenderingContext2D = stateVariables.ctx) {
    if(this.show){
    ctx.drawImage(
      this.blood_img[this.state],
      this.startPoint.x + stateVariables.bgImage.startPoint.x,
      this.startPoint.y + stateVariables.bgImage.startPoint.y
    );
}
    const bloodShowTimeout = setTimeout(() => {
        this.show = false;
        clearTimeout(bloodShowTimeout);
    },5000);
  }
}
