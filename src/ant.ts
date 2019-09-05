import {Footprint} from './footprint';
import {Scenario} from './scenario';
export class Ant {

  currentPosX: number;
  currentPosY: number;
  path: Footprint [] = [];
  currentColor: string;
  currentDirection: string;
  scenario: Scenario;
  footStep: number;

  constructor(currentPosX: number, currentPosY: number, scenario: Scenario, footStep: number) {
    this.currentPosX = currentPosX;
    this.currentPosY = currentPosY;
    this.currentColor = "white";
    this.currentDirection = "up";
    this.scenario = scenario;
    this.footStep = footStep;
  }

  addFootprint(fp: Footprint): void{
    this.path.push(fp);
  }

  move(): void{

    if(!this.isOnBoard()){
      this.currentColor = this.scenario.getColorAt(this.currentPosX, this.currentPosY);
      if (this.currentColor == "white"){
        this.scenario.changeColorAt(this.currentPosX, this.currentPosY);
        this.path.push(new Footprint(this.currentPosX, this.currentPosY, this.currentColor));
        this.moveLeft();
      }
      else{
        this.scenario.changeColorAt(this.currentPosX, this.currentPosY);
        this.path.push(new Footprint(this.currentPosX, this.currentPosY, this.currentColor));
        this.moveRight();
      }
    }


  }

  moveLeft(): void{
    if (this.currentDirection == "up"){
      this.currentPosX -= this.footStep;
      this.currentDirection = "left";
    }
    else if (this.currentDirection == "left"){
      this.currentPosY += this.footStep;
      this.currentDirection = "down";
    }
    else if (this.currentDirection == "down"){
      this.currentPosX += this.footStep;
      this.currentDirection = "right";
    }
    else if (this.currentDirection == "right"){
      this.currentPosY -= this.footStep;
      this.currentDirection = "up";
    }

  }

  moveRight(): void{
    if (this.currentDirection == "up"){
      this.currentPosX += this.footStep;
      this.currentDirection = "right";
    }
    else if (this.currentDirection == "left"){
      this.currentPosY -= this.footStep;
      this.currentDirection = "up";
    }
    else if (this.currentDirection == "down"){
      this.currentPosX -= this.footStep;
      this.currentDirection = "left";
    }
    else if (this.currentDirection = "right"){
      this.currentPosY += this.footStep;
      this.currentDirection = "down";
    }
  }

  isOnBoard(): boolean{
    if(this.currentPosX==0 || this.currentPosX>=this.scenario.getWidth() || this.currentPosY==0 || this.currentPosY>=this.scenario.getHeight()){
      return true;
    }
    return false;
  }
}
