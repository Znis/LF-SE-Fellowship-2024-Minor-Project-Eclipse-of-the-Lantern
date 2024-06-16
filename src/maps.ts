import { Point } from "./shapes/point";
export class Maps {
  startPoint: Point;
  w: number;
  h: number;
  img: HTMLImageElement;
  name: string;
  saved_settings: any;
  constructor(imgName: string) {
    this.startPoint = new Point(-2300, -2053);
    this.w = 0;
    this.h = 0;

    this.name = imgName;
    this.img = new Image();
    this.img.src = "./assets/maps/" + this.name;

    this.saved_settings = {
      "main-map.jpg": {
        size: "native",
      },
    };
  }

  show(ctx: CanvasRenderingContext2D) {



    if (
      this.w == 0 &&
      this.h == 0 &&
      this.saved_settings[this.name].size == "native"
    ) {
      ctx.drawImage(this.img, this.startPoint.x, this.startPoint.y);
    } else {
      const size = this.saved_settings[this.name].size;
      if (size == "native") {
        ctx.drawImage(this.img, this.startPoint.x, this.startPoint.y);
      } else {
        ctx.drawImage(
          this.img,
          this.startPoint.x,
          this.startPoint.y,
          size.width,
          size.height
        );
      }
    }
  }
}
