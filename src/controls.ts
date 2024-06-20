import { GameState, inventory, stateVariables } from "./stateVariables";
import { Point } from "./shapes/point";
import { BulletProjectile } from "./particles/bulletProjectile";
import { cameraShake, getMouseCoords } from "./functions";
import { calculateAngle } from "./utils/util";

window.addEventListener(
  "keydown",
  function (e) {
    stateVariables.keyState[e.keyCode || e.which] = true;
  },
  true
);
window.addEventListener(
  "keyup",
  function (e) {
    stateVariables.keyState[e.keyCode || e.which] = false;
  },
  true
);

window.addEventListener(
  "mousemove",
  function (e) {
    stateVariables.mouseCoords = getMouseCoords(e);
  },
  true
);

window.addEventListener(
  "click",
  function () {
    if(stateVariables.gameState != GameState.running)
    stateVariables.mainMenu.handleSelect();
  },
  true
);


export const mousepress = window.addEventListener("click", () => {
  if (
    stateVariables.gameState == GameState.running &&
    !stateVariables.player.isBlowingLantern &&
    stateVariables.player.health > 0 &&
    inventory.ammo > 0
  ) {
    const mouseCoords = getMouseCoords(event as MouseEvent);
    const angle =
      calculateAngle(
        new Point(mouseCoords.x, mouseCoords.y),
        stateVariables.player.startPoint
      ) *
      (180 / Math.PI);
    if (angle >= -45 && angle < 45) {
      stateVariables.player.direction = "r";
    } else if (angle >= 45 && angle < 135) {
      stateVariables.player.direction = "d";
    } else if (angle >= -135 && angle < -45) {
      stateVariables.player.direction = "u";
    } else {
      stateVariables.player.direction = "l";
    }
    const projectile = new BulletProjectile(
      new Point(
        stateVariables.player.startPoint.x + 60,
        stateVariables.player.startPoint.y + 20
      ),
      stateVariables.player.direction,
      new Point(mouseCoords.x, mouseCoords.y),
      true
    );
    cameraShake(4, 10);
    stateVariables.bulletProjectileArray.push(projectile);
    inventory.ammo--;
  }
});

let refuelTimeout: number | null = null;
let healTimeout: number | null = null;
export function handleControls() {
  if (stateVariables.keyState[87] && stateVariables.keyState[68]) {
    stateVariables.player.direction = "u";
    stateVariables.player.dirX = -0.72;
    stateVariables.player.dirY = 0.72;
    stateVariables.player.move();
  }else if (stateVariables.keyState[87] && stateVariables.keyState[65]) {
    stateVariables.player.direction = "u";
    stateVariables.player.dirX = 0.72;
    stateVariables.player.dirY = 0.72;
    stateVariables.player.move();
  }else if (stateVariables.keyState[83] && stateVariables.keyState[65]) {
    stateVariables.player.direction = "d";
    stateVariables.player.dirX = 0.72;
    stateVariables.player.dirY = -0.72;
    stateVariables.player.move();
  }else if (stateVariables.keyState[83] && stateVariables.keyState[68]) {
    stateVariables.player.direction = "d";
    stateVariables.player.dirX = -0.72;
    stateVariables.player.dirY = -0.72;
    stateVariables.player.move();
  } else if (stateVariables.keyState[65]) {
    stateVariables.player.direction = "l";
    stateVariables.player.dirX = 1;
    stateVariables.player.dirY = 0;
    stateVariables.player.move();
  } else if (stateVariables.keyState[68]) {
    stateVariables.player.direction = "r";
    stateVariables.player.dirX = -1;
    stateVariables.player.dirY = 0;
    stateVariables.player.move();
  } else if (stateVariables.keyState[83]) {
    stateVariables.player.direction = "d";
    stateVariables.player.dirX = 0;
    stateVariables.player.dirY = -1;
    stateVariables.player.move();
  } else if (stateVariables.keyState[87]) {
    stateVariables.player.direction = "u";
    stateVariables.player.dirX = 0;
    stateVariables.player.dirY = 1;
    stateVariables.player.move();
  } else {
    stateVariables.player.frameToShow = 0;
    stateVariables.player.dirX = 0;
    stateVariables.player.dirY = 0;
  }

  if (stateVariables.keyState[76]) {
    stateVariables.debugCollider = stateVariables.debugCollider ? false : true;
  }

  if (stateVariables.keyState[16]) {
    stateVariables.player.frameTime = 2;
    stateVariables.player.increaseSpeed();
  }
   else {
    stateVariables.player.movement_speed = stateVariables.player.default_speed;
    stateVariables.player.frameTime = 4;
  }

  if (stateVariables.keyState[32]) {
    if (!healTimeout && stateVariables.player.health > 0 && inventory.medKit > 0) {
      stateVariables.healStart = new Date().getTime();
      stateVariables.isHoldingHealKey = true;
      stateVariables.player.isUsingMedkit = true;
      healTimeout = setTimeout(() => {
        stateVariables.player.increaseHealth();
        healTimeout = null;
        stateVariables.player.isUsingMedkit = false;
        stateVariables.isHoldingHealKey = false;
        stateVariables.healStart = null;
      }, stateVariables.healDuration);
    }
  } else {
    if (healTimeout && stateVariables.player.health > 0) {
      clearTimeout(healTimeout);
      healTimeout = null;
      stateVariables.isHoldingHealKey = false;
      stateVariables.player.isUsingMedkit = false;
      stateVariables.healStart = null;
    }
  }

  if (stateVariables.keyState[70]) {
    if (!refuelTimeout && stateVariables.player.health > 0 && inventory.fuel > 0) {
      stateVariables.refuelStart = new Date().getTime();
      stateVariables.isHoldingRefuelKey = true;
      stateVariables.player.isBlowingLantern = true;
      refuelTimeout = setTimeout(() => {
        stateVariables.lantern.resetLuminosity();
        inventory.fuel--;
        refuelTimeout = null;
        stateVariables.player.isBlowingLantern = false;
        stateVariables.isHoldingRefuelKey = false;
        stateVariables.refuelStart = null;
      }, stateVariables.refuelDuration);
    }
  } else {
    if (refuelTimeout && stateVariables.player.health > 0) {
      clearTimeout(refuelTimeout);
      refuelTimeout = null;
      stateVariables.isHoldingRefuelKey = false;
      stateVariables.player.isBlowingLantern = false;
      stateVariables.refuelStart = null;
    }
  }
}
