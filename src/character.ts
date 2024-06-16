import { stateVariables } from "./stateVariables";
import { Point } from "./shapes/point";
export class Character {
  id: string;
  startPoint: Point;
  movement_speed: number;
  default_speed: number;
  direction: string;
  imgSrc: string;
  images_back: HTMLImageElement[];
  images_front: HTMLImageElement[];
  images_right: HTMLImageElement[];
  images_left: HTMLImageElement[];
  health: number;
  score: number;
  time: number;
  frameToShow: number;

  constructor() {
    this.id = "";
    this.startPoint = new Point(0, 0);
    this.movement_speed = 5;
    this.default_speed = this.movement_speed;
    this.direction = "r"; //'l' is left 'r' is right 'u' and 'd' is up and down
    this.imgSrc = "";

    this.images_back = [] as HTMLImageElement[];
    this.images_front = [] as HTMLImageElement[];
    this.images_left = [] as HTMLImageElement[];
    this.images_right = [] as HTMLImageElement[];
    this.health = 100;
    this.score = 0;
    this.time = 0;
    this.frameToShow = 0;
  }

  initialiseImages(path: string, no_of_frames: number) {
    const loadImagesForDirection = (direction: string) => {
      const imagesArray = [];
      for (let i = 1; i <= no_of_frames; i++) {
        const img = new Image();
        img.src = `${path}/${direction}/${direction} (${i}).png`;
        imagesArray.push(img);
      }
      return imagesArray;
    };

    this.images_back = loadImagesForDirection("back");
    this.images_front = loadImagesForDirection("front");
    this.images_left = loadImagesForDirection("left");
    this.images_right = loadImagesForDirection("right");
  }

  change_frames(hit = false) {
    let frameSpeed = 2;
    if (hit) {
      frameSpeed = 0;
    }
    if (this.time > frameSpeed) {

      this.frameToShow += 1;

      if (this.frameToShow == this.images_back.length) {
        this.frameToShow = 0;
      }

      this.time = 0;

    }
    this.time++;

  }

  show(ctx: CanvasRenderingContext2D) {
    let img = this.images_right[this.frameToShow];
    if (this.direction == 'r'){
      img = this.images_right[this.frameToShow];
    }
    else if (this.direction == 'l'){
      img = this.images_left[this.frameToShow];
    }
    else if (this.direction == 'u'){
      img = this.images_back[this.frameToShow];
    }
    else if (this.direction == 'd'){
      img = this.images_front[this.frameToShow];
    }

    ctx.fillStyle = "rgba(20, 20, 20, 0.59)"; 
    ctx.beginPath();
    ctx.fill();
    ctx.closePath();
    if (this.health > 0) {
      ctx.ellipse(
        this.startPoint.x + 20,
        this.startPoint.y + 70,
        27 / 2,
        14 / 2,
        0,
        0,
        Math.PI * 2
      );

      ctx.drawImage(img, this.startPoint.x, this.startPoint.y);

    }
  }

  moveLeft() {

    if (this.health > 0) {

      stateVariables.bgImage.startPoint.x += this.movement_speed;
      this.direction = "l";
      this.change_frames();
    }
  }
  moveUp() {
    if (this.health > 0) {
      stateVariables.bgImage.startPoint.y += this.movement_speed;
      this.direction = "u";
      this.change_frames();
    }
  }
  moveRight() {
    if (this.health > 0) {
      stateVariables.bgImage.startPoint.x -= this.movement_speed;
      this.direction = "r";
      this.change_frames();
    }
  }
  moveDown() {
    if (this.health > 0) {
      stateVariables.bgImage.startPoint.y -= this.movement_speed;

      this.direction = "d";
      this.change_frames();
    }
  }
  
}
