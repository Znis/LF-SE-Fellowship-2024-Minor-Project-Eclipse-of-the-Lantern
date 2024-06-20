import { RainParticle } from "./particles/rainParticle";
import { stateVariables } from "./stateVariables";

export class Ui {
  healthImages: HTMLImageElement[];
  overlayImages: HTMLImageElement[];
  staminaImage: HTMLImageElement;
  healthBars: number;
  staminaBars: number;
  rainParticles: RainParticle[];
  constructor() {
    this.healthImages = [];
    this.staminaImage = {} as HTMLImageElement;
    this.overlayImages = [];
    this.healthBars = 5;
    this.staminaBars = 5;
    this.rainParticles = [] as RainParticle[];
  }

  initialiseImages(path: string) {
    const loadImage = (fullPath: string) => {
      const img = new Image();
      img.src = fullPath;

      return img;
    };

    this.healthImages[0] = loadImage(`${path}/border.png`);
    this.healthImages[1] = loadImage(`${path}/health.png`);
    this.staminaImage = loadImage(`${path}/stamina.png`);
    this.healthImages[2] = loadImage(`${path}/empty.png`);
    this.overlayImages[0] = loadImage(`${path}/bloodOverlay.png`);
  }

  renderBloodOverlay(ctx: CanvasRenderingContext2D = stateVariables.ctx) {
    ctx.drawImage(
      this.overlayImages[0],
      0,
      0,
      stateVariables.windowWidth,
      stateVariables.windowHeight
    );
  }

  renderScore(ctx: CanvasRenderingContext2D = stateVariables.ctx) {
    ctx.font = "40px Outfit";
    ctx.textAlign = "right";
    ctx.fillStyle = "white";

    const xPos = stateVariables.windowWidth - 100;
    ctx.fillText(`Score: ${stateVariables.player.score}`, xPos, 40);
  }

  renderHealth(ctx: CanvasRenderingContext2D = stateVariables.ctx) {
    if (stateVariables.player.health < 30 || stateVariables.lantern.maxRadiusInnerCircle < 80) {
      this.renderBloodOverlay();
    }

    let initial = 0;
    for (let i = 0; i < this.healthBars; i++) {
      ctx.drawImage(this.healthImages[0], (i + 1) * 30 + 10, 10, 30, 30);

      if (stateVariables.player.health > initial) {
        ctx.drawImage(this.healthImages[1], (i + 1) * 30 + 10, 10, 30, 30);
      } else {
        ctx.drawImage(this.healthImages[2], (i + 1) * 30 + 10, 10, 30, 30);
      }
      initial += 100 / this.healthBars;
    }
  }

  renderStamina(ctx: CanvasRenderingContext2D = stateVariables.ctx) {
    let initial = 0;
    for (let i = 0; i < this.staminaBars; i++) {
      ctx.drawImage(this.healthImages[0], 200 +(i + 1) * 30 + 10, 10, 30, 30);

      if (stateVariables.player.stamina > initial) {
        ctx.drawImage(this.staminaImage, 200+ (i + 1) * 30 + 10, 10, 30, 30);
      } else {
        ctx.drawImage(this.healthImages[2], 200 + (i + 1) * 30 + 10, 10, 30, 30);
      }
      initial += 100 / this.staminaBars;
    }

    if(stateVariables.player.stamina < 100) stateVariables.player.stamina += 0.1;

  }


  initialiseRainParticles(){
    for(let i=0; i<200; i++) this.rainParticles[i] = new RainParticle();
  }

  renderRainParticles() {
    let i = 0;
    this.rainParticles.forEach((rainParticle) => {
      rainParticle.show();
      rainParticle.move();
      if (rainParticle.startPoint.y > 1920) {
        this.rainParticles[i] = new RainParticle();
      }
      i += 1;
    });
  }
}
