import {Footprint} from './footprint';
import {Scenario} from './scenario';

//Questa classe rappresenta l'entità formica.
//E' composta dalle coordinate attuali sullo scenario,
//una direzione corrente, un colore attuale e un insieme di orme che lascia spostandosi
//Ha inoltre un riferimento allo scenario e la lunghezza del passo
export class Ant {

  currentPosX: number;
  currentPosY: number;
  path: Footprint [] = [];
  currentColor: string;
  currentDirection: string;
  scenario: Scenario;
  footStep: number;

  //Semplicemente costruisce la formica, di default la direzione di partenza è verso l'alto
  constructor(currentPosX: number, currentPosY: number, scenario: Scenario, footStep: number) {
    this.currentPosX = currentPosX;
    this.currentPosY = currentPosY;
    this.currentColor = "white";
    this.currentDirection = "up";
    this.scenario = scenario;
    this.footStep = +footStep;
  }

  //Aggiunge un'orma nel percorso della formica
  addFootprint(fp: Footprint): void{
    this.path.push(fp);
  }

  //Implementa il movimento se la formica è attualmente in una posizione "legale"
  move(): void{


    if(!this.isOnBoard()){
      //Ottiene il colore della cella corrente
      this.currentColor = this.scenario.getColorAt(this.currentPosX, this.currentPosY);

      //Se è bianco, cambia il colore si gira a sinistra di 90° e va avanti
      if (this.currentColor == "white"){
        this.scenario.changeColorAt(this.currentPosX, this.currentPosY);
        this.path.push(new Footprint(this.currentPosX, this.currentPosY, this.currentColor));
        this.moveLeft();
      }
      //Viceversa, cambia il colore si gira a destra di 90° e va avanti
      else{
        this.scenario.changeColorAt(this.currentPosX, this.currentPosY);
        this.path.push(new Footprint(this.currentPosX, this.currentPosY, this.currentColor));
        this.moveRight();
      }
    }


  }

  //Implementa il movimento a sinistra dipendentemente dalla direzione attuale
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

  //Implementa il movimento a destra dipendentemente dalla direzione attuale
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

  //Verifica se la prossima posizione può essere illegale
  isOnBoard(): boolean{
    if(this.currentPosX-this.footStep<0 || this.currentPosX+this.footStep>=this.scenario.getWidth() || this.currentPosY-this.footStep<0 || this.currentPosY+this.footStep>=this.scenario.getHeight()){
      return true;
    }
    return false;
  }
}
