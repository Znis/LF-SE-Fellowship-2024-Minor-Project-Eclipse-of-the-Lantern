import {startJourney} from "./functions";
import { Point } from "./shapes/point";
import {GameState, gameOptions, stateVariables } from "./stateVariables";
import "./controls.ts";
export class MenuScreen {
  startPoint: Point;
  hoveredOption: number;
  hoveredChar: number;
  difficultyLevel: number;
  selectedChar: number;
  difficulties: string[];
  menuItems: any;
  charItems: any;
  charInfo: any;
  characterImages: any;

  constructor() {
    this.startPoint = new Point(stateVariables.windowWidth / 15, 150);
    this.hoveredOption = -1;
    this.hoveredChar = -1;
    this.difficultyLevel = 0;
    this.selectedChar = 0;
    this.difficulties = ["GENOCIDE", "HOMICIDE", "SUICIDE"];

    this.menuItems = [
      {
        text: "Eclipse of the Lantern",
        fontSize: stateVariables.windowWidth / 25,
        x: this.startPoint.x,
        y: this.startPoint.y + (stateVariables.windowWidth / 15) * 0,
        type: 1,
      },
      {
        text: stateVariables.gameState == GameState.retryScreen ? "RETRY" : "START JOURNEY",
        fontSize: stateVariables.windowWidth / 25,
        x: this.startPoint.x,
        y: this.startPoint.y + (stateVariables.windowWidth / 20) * 2,
        type: 0,
      },
      {
        text: "DIFFICULTY: ",
        fontSize: stateVariables.windowWidth / 20,
        x: this.startPoint.x,
        y: this.startPoint.y + (stateVariables.windowWidth / 20) * 3,
        type: 0,
      },
    ];
    this.charItems = [
      {
        text: "SELECT CHARACTER",
        x: stateVariables.windowWidth / 1.5 + 100,
        y: 300,
      },
      {
        text: "<",
        x: stateVariables.windowWidth / 1.5,
        y: 500,
      },
      {
        text: ">",
        x: stateVariables.windowWidth / 1.5 + 400,
        y: 500,
      },
    ];
    this.characterImages = [];
    this.charInfo = [
      {
        name: "Ophelia",
        desc: "Detective",
      },
      {
        name: "Noah",
        desc: "Detective",
      },
    ];
    if (
      stateVariables.windowWidth < 1330 &&
      stateVariables.windowHeight > 600
    ) {
      this.charItems[0].x = this.startPoint.x;
      this.charItems[0].y = 350;
      this.charItems[1].x = this.startPoint.x;
      this.charItems[1].y = 400;
      this.charItems[2].x = this.startPoint.x + 100;
      this.charItems[2].y = 400;
    } else if (
      stateVariables.windowWidth < 1550 &&
      stateVariables.windowHeight < 600
    ) {
      this.charItems[0].x = 500;
      this.charItems[0].y = 200;
      this.charItems[1].x = 500 + 50;
      this.charItems[1].y = 250;
      this.charItems[2].x = 500 + 180;
      this.charItems[2].y = 250;
    }
  }

  initialiseImages() {
    this.charInfo.forEach((character: any) => {
      const img = new Image();
      img.src = `assets/character/images/characters/profile/${character.name}.png`;
      this.characterImages.push(img);
    });
  }

  show(ctx: CanvasRenderingContext2D = stateVariables.ctx) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.74)";
    ctx.fillRect(0, 0, stateVariables.windowWidth, stateVariables.windowHeight);

    ctx.textAlign = "left";
    ctx.font = "30px Nos";

    let index = 0;
    let noHover = true;

    let mouseX = stateVariables.mouseCoords.x;
    let mouseY = stateVariables.mouseCoords.y;

    this.menuItems.forEach((menuItem: any) => {
      ctx.font = `${menuItem.fontSize}px Nos`;

      ctx.fillStyle = "rgb(255, 255, 255)";

      let isHovered = false;

      if (
        mouseX >= menuItem.x &&
        mouseX <
          menuItem.x + (menuItem.text.length / 1.5) * menuItem.fontSize &&
        mouseY <= menuItem.y &&
        mouseY > menuItem.y - menuItem.fontSize
      ) {
        isHovered = true;

        this.hoveredOption = index;
        noHover = false;
      }

      if (menuItem.type == 1 || isHovered) {
        if (index > 0) {
          ctx.font = "30px stat";
          ctx.fillStyle = "red";
        }
      } else {
        ctx.font = "30px stat";

        ctx.fillStyle = "rgb(255, 255, 255)";
      }
      if (index == 2) {
        ctx.fillText(
          menuItem.text + this.difficulties[this.difficultyLevel],
          menuItem.x,
          menuItem.y
        );
      } else {
        ctx.fillText(menuItem.text, menuItem.x, menuItem.y);
      }

      index++;
    });
    if (noHover) {
      this.hoveredOption = -1;
    }
    noHover = true;
    index = 0;
    this.charItems.forEach((charItem: any) => {
      ctx.fillStyle = "rgb(255, 255, 255)";
      if (
        mouseX >= charItem.x &&
        mouseX < charItem.x + 50 &&
        mouseY <= charItem.y &&
        mouseY > charItem.y - 50
      ) {
        ctx.fillStyle = "red";

        noHover = false;
        this.hoveredChar = index;
      }
      ctx.fillText(charItem.text, charItem.x, charItem.y);

      index++;
    });
    if (noHover) {
      this.hoveredChar = -1;
    }

    if (
      stateVariables.windowWidth < 1330 &&
      stateVariables.windowHeight > 600
    ) {
      ctx.drawImage(
        this.characterImages[this.selectedChar],
        this.startPoint.x + 30,
        370,
        50,
        50
      );
      ctx.font = "20px stat";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgb(255, 255, 255)";

      ctx.fillText(
        this.charInfo[this.selectedChar].name,
        this.startPoint.x,
        450,
        100
      );
    } else if (
      stateVariables.windowWidth < 1550 &&
      stateVariables.windowHeight < 600
    ) {
      ctx.drawImage(this.characterImages[this.selectedChar], 600, 210, 50, 50);

      ctx.font = "20px stat";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText(this.charInfo[this.selectedChar].name, 575, 280, 100);
    } else {
      ctx.drawImage(
        this.characterImages[this.selectedChar],
        stateVariables.windowWidth / 1.5 + 140,
        500,
        100,
        100
      );

      ctx.font = "40px stat";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText(this.charInfo[this.selectedChar].name, stateVariables.windowWidth / 1.5 + 200, 450, 500);

      ctx.font = "20px stat";
    }
  }

  handleSelect() {
    if (this.hoveredChar == 1 || this.hoveredChar == 2)
      this.selectedChar = this.selectedChar == 0 ? 1 : 0;

    if (this.hoveredOption == 2) {
      if (this.difficultyLevel < this.difficulties.length - 1) {
        this.difficultyLevel++;
      } else {
        this.difficultyLevel = 0;
      }
    }
    if (this.hoveredOption == 1) {
      gameOptions.difficultyLevel = this.difficultyLevel;
      gameOptions.character = this.charInfo[this.selectedChar].name;
      startJourney();

    }
    

  }
}
