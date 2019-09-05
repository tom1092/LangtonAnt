import {Ant} from './ant';
export class Scenario {

  //La classe rappresenta l'intero scenario. E' costituita da un insieme di formiche e
  //una matrice di celle.
  private ants: Ant [] = [];
  private cells: string [][];
  private width: number;
  private height: number;

  constructor(public w: number, public h: number) {
    this.cells = [];

        for(var i: number = 0; i < w; i++) {
            this.cells[i] = [];
            for(var j: number = 0; j< h; j++) {
                this.cells[i][j] = "white";
            }
        }
        this.width = w;
        this.height = h;
  }

  //Cambia il colore nella cella
  changeColorAt(x: number, y: number): void{

    if (this.cells[x][y] == "white"){
      this.cells[x][y] = "black";
    }
    else{
      this.cells[x][y] = "white";
    }
  }

  //Ottine il colore attuale di una cella
  getColorAt(x: number, y: number): string{

    return this.cells[x][y];
  }

  //Aggiunge una formica allo scenario
  addAnt(ant: Ant): void{
    this.ants.push(ant);
  }

  //Restituisce la lista di formiche
  getAnts(): Ant[]{
    return this.ants;
  }

  //Ottiene la larghezza dello scenario
  getWidth(): number{
    return this.width;
  }

  //Ottiene l'altezza dello scenario
  getHeight(): number{
    return this.height;
  }

  //Muove ciascuna formica nello scenario
  moveAnts(): void{
    for (var ant of this.ants){
      ant.move();
    }
  }
}
