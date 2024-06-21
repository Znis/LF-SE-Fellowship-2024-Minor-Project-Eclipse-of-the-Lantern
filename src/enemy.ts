import { Point } from "./shapes/point";
import { stateVariables } from "./stateVariables";
import { calculateAngle, distance, getRandomInt } from "./utils/util";

export class Enemy {
  startPoint: Point;
  images_back: HTMLImageElement[];
  images_front: HTMLImageElement[];
  images_left: HTMLImageElement[];
  images_right: HTMLImageElement[];
  MAX_HEALTH: number;
  MIN_HEALTH: number;
  damage: number;
  health: number;
  movement_speed: number;
  finalX: number;
  finalY: number;
  direction: string;
  frameToShow: number;
  time: number;
  h: number;
  w: number;
  r: number;
  default_movement_speed: number;
  default_damage: number;
  default_health: number;
  damageTimeout: number | null;

  constructor(x: number, y: number) {
    this.startPoint = new Point(x, y);
    this.direction = "d";
    this.h = getRandomInt(80, 100);
    this.w = this.h;
    this.r = 40;

    this.MAX_HEALTH = 5;
    this.MIN_HEALTH = 2;
    this.default_damage = 1;
    this.damage = this.default_damage;

    this.images_back = [];
    this.images_front = [];
    this.images_left = [];
    this.images_right = [];

    this.frameToShow = 0;
    this.time = 0;

    this.damageTimeout = null;

    this.default_health =
      Math.random() * (this.MAX_HEALTH - this.MIN_HEALTH) + this.MIN_HEALTH;
    this.health = this.default_health;

    this.default_movement_speed = 1;
    this.movement_speed = Math.random() + this.default_movement_speed;

    this.finalX =
      stateVariables.player.startPoint.x +
      Math.floor((2 * Math.random() - 1) * 50) -
      40;

    this.finalY =
      stateVariables.player.startPoint.y +
      Math.floor((2 * Math.random() - 1) * 50) -
      40;
  }


  initialiseGolblinImages(path: string, no_of_frames: number) {
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

  change_frames() {
    let frameSpeed = 4;
    if (this.time > frameSpeed) {
      this.frameToShow += 1;

      if (this.frameToShow == this.images_back.length) {
        this.frameToShow = 0;
      }

      this.time = 0;
    }
    this.time++;
  }

  updateAttributes(){
    const dist = distance(this.startPoint, stateVariables.player.startPoint);
    if(dist >  stateVariables.lantern.maxRadiusInnerCircle * 2){
      this.movement_speed = this.default_movement_speed * 2;
      this.damage = this.default_damage * 2;
      this.health = this.default_health * 2;
    }else{
      this.movement_speed = this.default_movement_speed;
      this.damage = this.default_damage;
    }
  }
  determineDirection() {
    const angle =
      calculateAngle(new Point(this.finalX, this.finalY), this.startPoint) *
      (180 / Math.PI);
    if (angle >= -45 && angle < 45) {
      this.direction = "r";
    } else if (angle >= 45 && angle < 135) {
      this.direction = "d";
    } else if (angle >= -135 && angle < -45) {
      this.direction = "u";
    } else {
      this.direction = "l";
    }
  }

  show(ctx: CanvasRenderingContext2D = stateVariables.ctx) {
    let img = this.images_right[this.frameToShow];
    if (this.direction == "r") {
      img = this.images_right[this.frameToShow];
    } else if (this.direction == "l") {
      img = this.images_left[this.frameToShow];
    } else if (this.direction == "u") {
      img = this.images_back[this.frameToShow];
    } else if (this.direction == "d") {
      img = this.images_front[this.frameToShow];
    }

    ctx.fillStyle = "rgba(20, 20, 20, 0.6)";
    ctx.beginPath();
    const randomWidth = this.w/3;
    const randomHeight = this.h/10;
    ctx.ellipse(
      this.startPoint.x + this.w/2,
      this.startPoint.y + this.h - 10,
      randomWidth,
      randomHeight,
      0,
      0,
      2 * Math.PI
    );
    ctx.fill();

    if (
      this.startPoint.x > -100 &&
      this.startPoint.x < stateVariables.windowWidth &&
      this.startPoint.y > -100 &&
      this.startPoint.y < stateVariables.windowHeight
    ) {
      ctx.drawImage(img, this.startPoint.x, this.startPoint.y, this.w, this.h);
    }
  }


  move() {
    if (distance(stateVariables.player.startPoint, this.startPoint) < 1000) {
      let delta_x = this.finalX - this.startPoint.x;
      let delta_y = this.finalY - this.startPoint.y;
      let dist = distance(new Point(this.finalX, this.finalY), this.startPoint);
      if (dist > this.movement_speed) {
        let ratio = this.movement_speed / dist;
        let x_move = ratio * delta_x;
        let y_move = ratio * delta_y;

        if (
          stateVariables.bgImage.checkCollision(
            stateVariables.bgImage.startPoint.x -
              this.startPoint.x +
              this.finalX,
            stateVariables.bgImage.startPoint.y -
              this.startPoint.y +
              this.finalY +
              this.movement_speed
          )
        ) {
          this.startPoint.x = x_move + this.startPoint.x;
        } else if (
          stateVariables.bgImage.checkCollision(
            stateVariables.bgImage.startPoint.x -
              this.startPoint.x +
              this.finalX +
              this.movement_speed,
            stateVariables.bgImage.startPoint.y -
              this.startPoint.y +
              this.finalY
          )
        ) {
          this.startPoint.y = y_move + this.startPoint.y;
        } else {
          this.startPoint.x = x_move + this.startPoint.x;
          this.startPoint.y = y_move + this.startPoint.y;
        }
      } else {
        this.startPoint.x = this.finalX;
        this.startPoint.y = this.finalY;
      }

      if (
        this.startPoint.x == this.finalX &&
        this.startPoint.y == this.finalY
      ) {
        if (stateVariables.player.health > 0) {
          if(!this.damageTimeout){
          this.damageTimeout = setTimeout(() => {
          stateVariables.player.health -= this.damage;
          this.damageTimeout = null;
          }, 500);
        }
        }else{
          clearTimeout(this.damageTimeout!);
        }
      }
    }
    this.change_frames();
  }
}
