import {Ant} from './ant';
export class Scenario {

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

  changeColorAt(x: number, y: number): void{

    if (this.cells[x][y] == "white"){
      this.cells[x][y] = "black";
    }
    else{
      this.cells[x][y] = "white";
    }
  }

  getColorAt(x: number, y: number): string{

    return this.cells[x][y];
  }

  addAnt(ant: Ant): void{
    this.ants.push(ant);
  }

  getAnts(): Ant[]{
    return this.ants;
  }

  getWidth(): number{
    return this.width;
  }

  getHeight(): number{
    return this.height;
  }

  moveAnts(): void{
    for (var ant of this.ants){
      ant.move();
    }
  }
}
