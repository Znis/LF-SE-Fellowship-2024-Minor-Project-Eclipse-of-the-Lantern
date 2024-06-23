import { BloodParticle } from "./particles/bloodParticle";
import {
  GameState,
  difficultySetting,
  gameOptions,
  inventory,
  pickupItemsTypes,
  stateVariables,
} from "./stateVariables";
import { Character } from "./character";
import { Maps } from "./maps";
import { canvas } from "./main";
import { Lantern } from "./lantern";
import { Enemy } from "./enemy";
import { AnimateEntity } from "./animation";
import { Ui } from "./ui";
import { loadFonts } from "./fonts";
import { MenuScreen } from "./menuScreen";
import { Point } from "./shapes/point";
import { PickupItems } from "./pickupItems";
import { Inventory } from "./inventory";
import { Axe } from "./weapons/axe";
import { Gun } from "./weapons/gun";
import { Boss } from "./boss";
import { getRandomInt } from "./utils/util";

export function preload() {
  stateVariables.player = new Character();
  stateVariables.player.initialiseImages(
    `assets/character/images/characters/${gameOptions.character}`,
    4
  );
  console.log(gameOptions.character);
  stateVariables.player.direction = "r";
  stateVariables.player.startPoint.x = stateVariables.windowWidth / 2;
  stateVariables.player.startPoint.y = stateVariables.windowHeight / 2;
  stateVariables.ui = new Ui();
  stateVariables.cursorImage = new Image();
  stateVariables.cursorImage.src = "./assets/attack.png";
  stateVariables.inventory = new Inventory();
  stateVariables.axe = new Axe();
  stateVariables.gun = new Gun();
  stateVariables.inventory.initialiseImages();
  stateVariables.ui.initialiseImages("./assets/ui");
  stateVariables.ui.initialiseRainParticles();
  stateVariables.lantern = new Lantern();
  stateVariables.lantern.img.src = "assets/lantern/lantern.png";
  stateVariables.bgImage = new Maps("main-map.jpg");
  stateVariables.mainMenu = new MenuScreen();
  stateVariables.boss = new Boss();
  stateVariables.boss.initialiseGolblinImages("assets/boss/", 6);
  let animateEnemy = new AnimateEntity(stateVariables.boss.images_front, 2);
  stateVariables.animateEnemyArray.push(animateEnemy);
  stateVariables.mainMenu.initialiseImages();
  loadFonts();
  stateVariables.flameImages = loadImages("assets/flame", 30);
}

export function loadImages(path: string, num: number) {
  const imagesArray = [];
  for (let i = 0; i < num; i++) {
    const img = new Image();
    img.src = `${path}/${i}.png`;
    imagesArray.push(img);
  }
  return imagesArray;
}

export function adjustCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

export function checkPlayerHealthAndLanternLuminosity() {
  if (
    stateVariables.player.health <= 0 ||
    stateVariables.lantern.maxRadiusInnerCircle <= 0
  )
    stateVariables.gameState = GameState.retryScreen;
}
export function startJourney() {
  resetStateVariables();
  stateVariables.gameState = GameState.running;
  generateEnemy(100);
  generateRandomPickupItems(100);

  stateVariables.player.initialiseImages(
    `assets/character/images/characters/${gameOptions.character}`,
    4
  );
  console.log(gameOptions.character);
  stateVariables.player.direction = "r";
  stateVariables.player.startPoint.x = stateVariables.windowWidth / 2;
  stateVariables.player.startPoint.y = stateVariables.windowHeight / 2;

  stateVariables.enemiesArray.forEach((enemy) => {
    enemy.MAX_HEALTH =
      difficultySetting[gameOptions.difficultyLevel].enemyMaxHealth;
    enemy.MIN_HEALTH =
      difficultySetting[gameOptions.difficultyLevel].enemyMinHealth;
    enemy.default_damage =
      difficultySetting[gameOptions.difficultyLevel].enemyAttackDamage;
    enemy.default_movement_speed =
      difficultySetting[gameOptions.difficultyLevel].enemySpeed;
  });
}

export function displayCursorImage(
  ctx: CanvasRenderingContext2D = stateVariables.ctx
) {
  ctx.save();
  if (stateVariables.player.abilityMode) {
    stateVariables.cursorImage.src = "./assets/direction.png";
    ctx.translate(stateVariables.mouseCoords.x, stateVariables.mouseCoords.y ); 
    ctx.rotate(
      Math.atan2(
        stateVariables.mouseCoords.y - stateVariables.player.startPoint.y + 50,
        stateVariables.mouseCoords.x - stateVariables.player.startPoint.x + 30 
      )
    );
    ctx.drawImage(
      stateVariables.cursorImage,
      0,
      0,
      50,
      50
    );
    ctx.restore();
  } else if (stateVariables.player.currWeapon == "gun") {
    stateVariables.cursorImage.src = "./assets/crosshair.png";
    ctx.drawImage(
      stateVariables.cursorImage,
      stateVariables.mouseCoords.x,
      stateVariables.mouseCoords.y,
      30,
      30
    );
  } else {
    stateVariables.cursorImage.src = "./assets/attack.png";
    ctx.drawImage(
      stateVariables.cursorImage,
      stateVariables.mouseCoords.x,
      stateVariables.mouseCoords.y,
      30,
      30
    );
  }


}

export function generateRandomPickupItems(num: number) {
  while (num != 0) {
    const itemType =
      Math.random() < 0.3
        ? Math.random() < 0.5
          ? pickupItemsTypes.ammo
          : pickupItemsTypes.health_pack
        : pickupItemsTypes.fuel;
    let posX = Math.random() * stateVariables.bgImage.w;
    let posY = Math.random() * stateVariables.bgImage.h;
    if (!stateVariables.bgImage.checkCollision(posX, posY)) {
      const pickupItem = new PickupItems(posX, posY, itemType);
      pickupItem.initialiseImages();

      stateVariables.pickupItemsArray.push(pickupItem);
      const animatePickupItem = new AnimateEntity(pickupItem.images, 12);
      stateVariables.animatePickupItemsArray.push(animatePickupItem);
      num--;
    }
  }
}

export function handlePickupItems() {
  for (let i = 0; i < stateVariables.pickupItemsArray.length; i++) {
    stateVariables.pickupItemsArray[i].show(
      stateVariables.pickupItemsArray[i].images[
        stateVariables.animatePickupItemsArray[i].frame()
      ],
      stateVariables.animatePickupItemsArray[i].frame()
    );
    stateVariables.animatePickupItemsArray[i].change_frames();
    stateVariables.pickupItemsArray[i].collect();
    if (stateVariables.pickupItemsArray[i].isUsed) {
      stateVariables.pickupItemsArray.splice(i, 1);
      stateVariables.animatePickupItemsArray.splice(i, 1);
    }
  }
}

export function resetStateVariables() {
  stateVariables.player.health = 10000;
  stateVariables.player.score = 0;
  stateVariables.lantern.maxRadiusInnerCircle = 250;
  stateVariables.bgImage.startPoint = new Point(
    -2220 + stateVariables.adjustDeviceColliderX,
    -2220 + stateVariables.adjustDeviceColliderY
  );
  stateVariables.bloodParticleArray = [];
  stateVariables.bulletProjectileArray = [];
  stateVariables.enemiesArray = [];
  stateVariables.pickupItemsArray = [];
  stateVariables.keyState = {};
  stateVariables.animateEnemyArray = [];
  stateVariables.animatePickupItemsArray = [];
  inventory.medKit = 0;
  inventory.fuel = 0;
  inventory.ammo = 20;
}

export function renderInventory() {
  stateVariables.inventory.show();
}

export function renderUi() {
  stateVariables.ui.renderHealth();
  stateVariables.ui.renderStamina();
  stateVariables.ui.renderScore();
}

export function renderMainMenu() {
  stateVariables.mainMenu.show();
}

export function handleEnemies() {
  stateVariables.enemiesArray.forEach((enemy) => {
    enemy.show();
    enemy.move();
    enemy.determineDirection();
    enemy.updateAttributes();
    enemy.separate();
  });
}

export function handleBoss() {
  stateVariables.boss.show();
  stateVariables.boss.move();
  stateVariables.boss.determineDirection();
  stateVariables.boss.updateAttributes();
  stateVariables.boss.spawnEnemy();
}

export function getMouseCoords(event: MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x, y };
}

export function handleProjectiles() {
  stateVariables.bulletProjectileArray.forEach((projectile) => {
    projectile.show();
    projectile.move();
  });
  stateVariables.bulletProjectileArray =
    stateVariables.bulletProjectileArray.filter(
      (projectile) => !projectile.toDelete
    );
  stateVariables.fireProjectileArray.forEach((projectile) => {
    projectile.show();
    projectile.move();
  });
  stateVariables.fireProjectileArray =
    stateVariables.fireProjectileArray.filter(
      (projectile) => !projectile.toDelete
    );
}

export function drawChannelledAnimation() {
  let holdDuration = 0;
  let text = "";
  if (stateVariables.isHoldingRefuelKey) {
    holdDuration = stateVariables.refuelDuration;
    text = " Refueling Lantern";
  } else if (stateVariables.isHoldingHealKey) {
    holdDuration = stateVariables.healDuration;
    text = " Using Med Kit";
  }
  const currentTime = new Date().getTime();
  let elapsedTime = 0;
  if (stateVariables.isHoldingHealKey)
    elapsedTime = currentTime - stateVariables.healStart!;
  if (stateVariables.isHoldingRefuelKey)
    elapsedTime = currentTime - stateVariables.refuelStart!;

  const remainingTime = holdDuration - elapsedTime;
  if (remainingTime < 0) {
    stateVariables.isHoldingHealKey = false;
    stateVariables.isHoldingRefuelKey = false;
  }
  const progress = 1 - Math.min(elapsedTime / holdDuration, 1);

  const barWidth = 400;
  const barHeight = 20;
  const barX = (stateVariables.windowWidth - barWidth) / 2;
  const barY = stateVariables.windowHeight - 50;

  stateVariables.ctx.fillStyle = "#ccc";
  stateVariables.ctx.fillRect(barX, barY, barWidth, barHeight);

  stateVariables.ctx.fillStyle = "#76c7c0";
  stateVariables.ctx.fillRect(barX, barY, barWidth * progress, barHeight);

  stateVariables.ctx.font = "16px Outfit";
  stateVariables.ctx.fillStyle = "#fff";
  stateVariables.ctx.textAlign = "center";
  stateVariables.ctx.fillText(
    `${text} ${(remainingTime / 1000).toFixed(1)}s`,
    stateVariables.windowWidth / 2,
    barY - 10
  );
}

export function generateEnemy(num: number) {
  while (num != 0) {
    let posX = getRandomInt(
      stateVariables.bgImage.startPoint.x,
      stateVariables.bgImage.startPoint.x + stateVariables.bgImage.w
    );
    let posY = getRandomInt(
      stateVariables.bgImage.startPoint.y,
      stateVariables.bgImage.startPoint.y + stateVariables.bgImage.h
    );
    if (!stateVariables.bgImage.checkCollision(posX, posY)) {
      let enemy = new Enemy(posX, posY);
      enemy.initialiseGolblinImages("assets/enemy/goblin", 6);
      let animateEnemy = new AnimateEntity(enemy.images_front, 2);
      stateVariables.enemiesArray.push(enemy);
      stateVariables.animateEnemyArray.push(animateEnemy);
      num--;
    }
  }
}

export function drawEllipse(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  ctx.beginPath();
  ctx.ellipse(x, y, width / 2, height / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

export function checkHitToEnemy() {
  if (stateVariables.player.currWeapon == "gun") {
    stateVariables.bulletProjectileArray.forEach((bulletProjectile) => {
      for (let i = 0; i < stateVariables.enemiesArray.length; i++) {
        if (bulletProjectile.hits(stateVariables.enemiesArray[i])) {
          stateVariables.enemiesArray[i].health -= 1;
          bulletProjectile.evaporate();

          const bloodParticle = new BloodParticle(
            stateVariables.enemiesArray[i].startPoint.x -
              stateVariables.bgImage.startPoint.x,
            stateVariables.enemiesArray[i].startPoint.y -
              stateVariables.bgImage.startPoint.y
          );
          bloodParticle.initialiseImages("assets/blood", 7);
          stateVariables.bloodParticleArray.push(bloodParticle);
          if (!stateVariables.enemiesArray[i].isAlive) {
            stateVariables.player.score++;
            stateVariables.enemiesArray.splice(i, 1);
            stateVariables.animateEnemyArray.splice(i, 1);
          }
        }
      }
    });
  } else if (
    stateVariables.player.currWeapon == "axe" &&
    stateVariables.player.isAttacking
  ) {
    for (let i = 0; i < stateVariables.enemiesArray.length; i++) {
      if (stateVariables.axe.hits(stateVariables.enemiesArray[i])) {
        stateVariables.enemiesArray[i].health -= 0.1;
        const bloodParticle = new BloodParticle(
          stateVariables.enemiesArray[i].startPoint.x -
            stateVariables.bgImage.startPoint.x,
          stateVariables.enemiesArray[i].startPoint.y -
            stateVariables.bgImage.startPoint.y
        );
        bloodParticle.initialiseImages("assets/blood", 7);
        stateVariables.bloodParticleArray.push(bloodParticle);
        if (!stateVariables.enemiesArray[i].isAlive) {
          stateVariables.player.score++;
          stateVariables.enemiesArray.splice(i, 1);
          stateVariables.animateEnemyArray.splice(i, 1);
        }
      }
    }
  }
  stateVariables.fireProjectileArray.forEach((fireProjectile) => {
    for (let i = 0; i < stateVariables.enemiesArray.length; i++) {
      if (fireProjectile.hits(stateVariables.enemiesArray[i])) {
        stateVariables.enemiesArray[i].health -= 5;

        const bloodParticle = new BloodParticle(
          stateVariables.enemiesArray[i].startPoint.x -
            stateVariables.bgImage.startPoint.x,
          stateVariables.enemiesArray[i].startPoint.y -
            stateVariables.bgImage.startPoint.y
        );
        bloodParticle.initialiseImages("assets/blood", 7);
        stateVariables.bloodParticleArray.push(bloodParticle);
        if (!stateVariables.enemiesArray[i].isAlive) {
          stateVariables.player.score++;
          stateVariables.enemiesArray.splice(i, 1);
          stateVariables.animateEnemyArray.splice(i, 1);
        }
      }
    }
  });
  for (let i = stateVariables.bloodParticleArray.length - 1; i >= 0; i--) {
    stateVariables.bloodParticleArray[i].showAnimation();
    if (!stateVariables.bloodParticleArray[i].show) {
      stateVariables.bloodParticleArray.splice(i, 1);
    }
  }
}

export function checkHitToBoss() {
  if (stateVariables.boss.hasWakeUp) {
    if (stateVariables.player.currWeapon == "gun") {
      stateVariables.bulletProjectileArray.forEach((bulletProjectile) => {
        if (bulletProjectile.hits(stateVariables.boss)) {
          stateVariables.boss.health -= 1;
          bulletProjectile.evaporate();

          const bloodParticle = new BloodParticle(
            stateVariables.boss.startPoint.x -
              stateVariables.bgImage.startPoint.x,
            stateVariables.boss.startPoint.y -
              stateVariables.bgImage.startPoint.y
          );
          bloodParticle.initialiseImages("assets/blood", 7);
          stateVariables.bloodParticleArray.push(bloodParticle);
        }
      });
    } else if (
      stateVariables.player.currWeapon == "axe" &&
      stateVariables.player.isAttacking
    ) {
      if (stateVariables.axe.hits(stateVariables.boss)) {
        stateVariables.boss.health -= 0.1;
        const bloodParticle = new BloodParticle(
          stateVariables.boss.startPoint.x -
            stateVariables.bgImage.startPoint.x,
          stateVariables.boss.startPoint.y - stateVariables.bgImage.startPoint.y
        );
        bloodParticle.initialiseImages("assets/blood", 7);
        stateVariables.bloodParticleArray.push(bloodParticle);
      }
    }
    stateVariables.fireProjectileArray.forEach((fireProjectile) => {
      if (fireProjectile.hits(stateVariables.boss)) {
        stateVariables.boss.health -= 5;

        const bloodParticle = new BloodParticle(
          stateVariables.boss.startPoint.x -
            stateVariables.bgImage.startPoint.x,
          stateVariables.boss.startPoint.y - stateVariables.bgImage.startPoint.y
        );
        bloodParticle.initialiseImages("assets/blood", 7);
        stateVariables.bloodParticleArray.push(bloodParticle);
      }
    });
  }
}
