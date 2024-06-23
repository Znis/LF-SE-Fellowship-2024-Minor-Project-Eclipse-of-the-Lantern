import { GameState, stateVariables } from "./stateVariables";
import "./style.css";
import "./controls";
import {
  adjustCanvasSize,
  checkHitToEnemy,
  checkPlayerHealthAndLanternLuminosity,
  displayCursorImage,
  drawChannelledAnimation,
  handleEnemies,
  handlePickupItems,
  handleProjectiles,
  preload,
  renderInventory,
  renderMainMenu,
  renderUi,
} from "./functions";
import { mapData } from "./mapData";
import { handleControls } from "./controls";

export const canvas = document.querySelector(
  "#gameCanvas"
) as HTMLCanvasElement;
stateVariables.ctx = canvas.getContext("2d")!;

canvas.width = stateVariables.windowWidth;
canvas.height = stateVariables.windowHeight;

preload();

function draw() {
  adjustCanvasSize();
  stateVariables.bgImage.show();

  if (stateVariables.gameState == GameState.running) {
    if (stateVariables.rain) stateVariables.ui.renderRainParticles();
    handlePickupItems();
    checkHitToEnemy();
    stateVariables.player.show();
    // handleEnemies();
    stateVariables.lantern.showLuminosity();
    stateVariables.lantern.changeLuminosity();
    handleProjectiles();
    renderUi();
    renderInventory();
    handleControls();

    stateVariables.bgImage.showDepth();



stateVariables.axe.calculateShockPoint();


    if (
      stateVariables.isHoldingRefuelKey && stateVariables.refuelStart != null) {
      drawChannelledAnimation();
    }
    if (stateVariables.isHoldingHealKey && stateVariables.healStart != null) {
      drawChannelledAnimation();
    }
    checkPlayerHealthAndLanternLuminosity();
  }
  if (
    stateVariables.gameState == GameState.menuScreen ||
    stateVariables.gameState == GameState.retryScreen
  ) {
    stateVariables.lantern.showLuminosity();
    stateVariables.ui.renderBloodOverlay();
    stateVariables.lantern.maxRadiusInnerCircle = 10;
    renderMainMenu();
  }
displayCursorImage();
  


  if (stateVariables.debugCollider) {
    mapData[
      stateVariables.bgImage.name as keyof typeof mapData
    ].colliders.forEach((collider: any) => {
      stateVariables.ctx.fillStyle = collider.color || "#ffffff";
      stateVariables.ctx.beginPath();
      stateVariables.ctx.fillRect(
        20 +
          (stateVariables.windowWidth / 2 +
            stateVariables.bgImage.startPoint.x -
            (collider.x + stateVariables.adjustDeviceColliderX)),
        50 +
          (stateVariables.windowHeight / 2 +
            stateVariables.bgImage.startPoint.y -
            (collider.y + stateVariables.adjustDeviceColliderY)),
        Math.abs(collider.x - collider.w),
        Math.abs(collider.y - collider.h)
      );
    });
  }
  stateVariables.reqAnimFrame = requestAnimationFrame(draw);
}
stateVariables.reqAnimFrame = requestAnimationFrame(draw);
