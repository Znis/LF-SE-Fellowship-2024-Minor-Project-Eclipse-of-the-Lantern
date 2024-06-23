import { inventory, stateVariables } from "./stateVariables";
import { Point } from "./shapes/point";
import { FireProjectile } from "./weapons/fireProjectile";

export class Character {
  id: string;
  startPoint: Point;
  movement_speed: number;
  default_speed: number;
  dirX: number;
  dirY: number;
  direction: string;
  imgSrc: string;
  images_back: HTMLImageElement[];
  images_front: HTMLImageElement[];
  images_right: HTMLImageElement[];
  images_left: HTMLImageElement[];
  health: number;
  stamina: number;
  score: number;
  time: number;
  frameToShow: number;
  isBlowingLantern: boolean;
  isUsingMedkit: boolean;
  frameTime: number;
  currWeapon: string;
  isAttacking: boolean;
  isWalking: boolean;
  isRunning: boolean;
  abilityMode: boolean;
  r: number;
  constructor() {
    this.id = "";
    this.startPoint = new Point(0, 0);
    this.movement_speed = 4;
    this.default_speed = this.movement_speed;
    this.dirX = 0;
    this.dirY = 0;
    this.direction = "r"; //'l' is left 'r' is right 'u' and 'd' is up and down
    this.imgSrc = "";

    this.images_back = [] as HTMLImageElement[];
    this.images_front = [] as HTMLImageElement[];
    this.images_left = [] as HTMLImageElement[];
    this.images_right = [] as HTMLImageElement[];
    this.health = 100;
    this.stamina = 100;
    this.score = 0;
    this.time = 0;
    this.frameToShow = 0;
    this.isBlowingLantern = false;
    this.isUsingMedkit = false;
    this.frameTime = 4;
    this.currWeapon = "axe";
    this.isAttacking = false;
    this.isWalking = false;
    this.isRunning = false;
    this.abilityMode = false;
    this.r = 50;
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

  increaseSpeed() {
    if (this.stamina > 0) {
      this.movement_speed = 2 * this.default_speed;
      this.isRunning = true;
      this.drainStamina();
    } else {
      this.movement_speed = this.default_speed;
      this.isRunning = false;


    }
  }

  drainStamina() {
    if (this.stamina > 0) {
      this.stamina -= 1;
    } else {
      this.stamina = 0;
    }
  }

  change_frames() {
    if (this.time > this.frameTime) {
      this.frameToShow += 1;

      if (this.frameToShow == this.images_back.length) {
        this.frameToShow = 0;
      }

      this.time = 0;
    }
    this.time++;
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

    if (this.health > 0) {
      ctx.fillStyle = "rgba(20, 20, 20,0.55)";
      ctx.beginPath();
      ctx.ellipse(
        this.startPoint.x + 20,
        this.startPoint.y + 70,
        14,
        7,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();

      if (this.direction == "d") 
        ctx.drawImage(img, this.startPoint.x, this.startPoint.y);
      
      if(this.direction == "u")
        stateVariables.lantern.show();

      if (this.currWeapon == "axe")
        stateVariables.axe.show(stateVariables.ctx, this.isAttacking);

      if (this.currWeapon == "gun")
        stateVariables.gun.show(stateVariables.ctx, this.isAttacking);

      if (this.direction != "d") {
        ctx.drawImage(img, this.startPoint.x, this.startPoint.y);
      }
      if(this.direction != "u")
      stateVariables.lantern.show();

    }
  }

  move() {
    if (!this.isBlowingLantern && !this.isUsingMedkit) {
      if (this.health > 0 && (this.dirX != 0 || this.dirY != 0)) {
        if (
          !stateVariables.bgImage.checkCollision(
            stateVariables.bgImage.startPoint.x +
              this.movement_speed * this.dirX,
            stateVariables.bgImage.startPoint.y +
              this.movement_speed * this.dirY)
          // stateVariables.bgImage.startPoint.x +
          //   stateVariables.adjustDeviceColliderX -
          //   stateVariables.windowWidth / 2 <
          //   0 &&
          // stateVariables.bgImage.startPoint.y +
          //   stateVariables.adjustDeviceColliderY -
          //   stateVariables.windowHeight / 2 >
          //   -stateVariables.bgImage.h &&
          // stateVariables.bgImage.startPoint.y +
          //   stateVariables.adjustDeviceColliderY -
          //   stateVariables.windowHeight / 2 <
          //   0 &&
          // stateVariables.bgImage.startPoint.x +
          //   stateVariables.adjustDeviceColliderX -
          //   stateVariables.windowWidth / 2 >
          //   -stateVariables.bgImage.w
        ) {
          stateVariables.enemiesArray.forEach((enemy) => {
            enemy.startPoint.x += this.movement_speed * this.dirX;
            enemy.startPoint.y += this.movement_speed * this.dirY;
          });
          stateVariables.pickupItemsArray.forEach((pickupItem) => {
            pickupItem.startPoint.x += this.movement_speed * this.dirX;
            pickupItem.startPoint.y += this.movement_speed * this.dirY;
          });
          stateVariables.boss.startPoint.x +=
            this.movement_speed * this.dirX;
          stateVariables.boss.startPoint.y +=
            this.movement_speed * this.dirY;
          stateVariables.bgImage.startPoint.x +=
            this.movement_speed * this.dirX;
          stateVariables.bgImage.startPoint.y +=
            this.movement_speed * this.dirY;
          this.isWalking = true;
          this.change_frames();
        }
      }


    }
  }

  increaseHealth() {
    stateVariables.player.health += 20;
    if (stateVariables.player.health > 100) {
      stateVariables.player.health = 100;
    }
    inventory.medKit--;
  }

  useAbility(ability: string) {
    if(ability == "light"){
      if (stateVariables.inventory.abilities[0].cooldown == 0) {
      stateVariables.lantern.setLuminosity();
      stateVariables.inventory.resetAbility(ability);
      const reset = setTimeout(() => {
        stateVariables.lantern.resetLuminosity();
        clearTimeout(reset);
      }, 5000);

    } else {
      stateVariables.inventory.displayMessage(
        stateVariables.ctx,
        "",
        "Ability on Cooldown!"
      );
    }
  }else if(ability == "flame"){
    if (stateVariables.inventory.abilities[1].cooldown == 0) {
  
      stateVariables.inventory.resetAbility(ability);
      const projectile = new FireProjectile(
        new Point(
          stateVariables.player.startPoint.x + 60,
          stateVariables.player.startPoint.y + 20
        ),
        stateVariables.player.direction,
        new Point(stateVariables.mouseCoords.x, stateVariables.mouseCoords.y),
        "player"
      );
      stateVariables.fireProjectileArray.push(projectile);
    
  }
}
  }
}
