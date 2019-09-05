import { Injectable } from '@angular/core';
import { Scenario } from '../scenario';
import { Ant } from '../ant';

@Injectable({
  providedIn: 'root'
})
export class ModelServiceService {

  private scenario: Scenario;

  constructor() { }

  createScenario(width: number, height: number): void{
    this.scenario = new Scenario(width, height);
  }

  addAnt(posX: number, posY: number, footstep: number): void{
    var a = new Ant(posX, posY, this.scenario, footstep);
    this.scenario.addAnt(a);
  }

  getAnts(): Ant[]{
    return this.scenario.getAnts();
  }

  moveAnts(): void{
    this.scenario.moveAnts();
  }
}
