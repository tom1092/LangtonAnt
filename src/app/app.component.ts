import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import {Ant} from '../ant';
import {Scenario} from '../scenario';
import {ModelServiceService} from './model-service.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'langtonAnt';
  scenario: Scenario;
  iteration: number = 0;
  pause = true;
  originx = 0;
  originy = 0;
  scale = 1;
  visibleWidth: number;
  visibleHeight: number;
  updateFPS = false;
  fps = 60;
  fStep: number = 1;


  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  constructor(private modelService: ModelServiceService){}

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.initCanvas();
    this.modelService.createScenario(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.visibleWidth = this.canvas.nativeElement.width;
    this.visibleHeight = this.canvas.nativeElement.height;
    this.animate();
  }

  //Inizializza il canvas rimpiendolo di grigio
  initCanvas(){
    this.ctx.fillStyle = 'grey';
    this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  //Questa funzione effettua il rendering dello scenario sul canvas
  animate(): void {
    const movement = setInterval(() => {
        this.initCanvas();
        if(!this.pause){
          this.iteration += 1;
          this.modelService.moveAnts();
        }
        //Renderizza ogni orma di ogni formica
        for (var ant of this.modelService.getAnts()){
          for (var footPrint of ant.path){
            this.ctx.fillStyle = footPrint.color;
            this.ctx.fillRect(footPrint.posX, footPrint.posY, 1, 1);
          }
          this.ctx.fillStyle = "red";
          this.ctx.fillRect(ant.currentPosX, ant.currentPosY, 1, 1);

        }

        //Nel caso in cui vengano cambiati gli fps, viene interrotto il loop di
        //animazione e fatto ripartire con i nuovi fps
        if(this.updateFPS){
          clearInterval(movement);
          this.updateFPS = false;
          this.animate();
        }
    }, 1000/this.fps);
  }

  //Fa evolvere lo scenario modificando la variabile booleana
  playScenario(): void{
    this.pause = false;
  }

  //Mette in pausa lo scenario modificando la variabile booleana
  pauseScenario(): void{
    this.pause = true;
  }

  //Pulisce lo scenario. Ripristina i valori di scaling, pulisce tutto il canvas
  //e crea un nuovo scenario
  clearScenario(): void{

    // Usa la matrice identità per pulire lo scenario per essere certo di riempire
    // L'intera dimensione inziale del canvasDiv
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.initCanvas();
    this.modelService.createScenario(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.iteration = 0;
    this.originx = 0;
    this.originy = 0;
    this.pause = true;
    this.scale = 1;
    this.visibleWidth = this.canvas.nativeElement.width;
    this.visibleHeight = this.canvas.nativeElement.height;

  }

  //Questa funzione aggiunge un nuova formica sul click
  //Effettua delle trasformazioni di coordinate dovute alla porzione dello Scenario
  //che viene visto nel canvas (nel caso di zoom e panning)
  //occorre quindi calcolare le coordinate "assolute" rispetto alle condizioni iniziali
  onCanvasClick(event: MouseEvent){

    var rect = this.canvas.nativeElement.getBoundingClientRect();
    //var x = event.clientX - this.canvas.nativeElement.offsetLeft;
    //var y = event.clientY - this.canvas.nativeElement.offsetTop;
    var x = Math.round(event.clientX - rect.left);
    var y = Math.round(event.clientY - rect.top);

    /* Per il debug e il controllo della correttezza delle coordinate
    console.log("Mouse click coordinates: ", x, y);
    console.log("view width and height: ", this.visibleWidth, this.visibleHeight);
    console.log("origin--> ", this.originx, this.originy);
    console.log("scale--> ", this.scale);
    */

    //Calcola il fattore di scala nelle coordinate relative
    var factX = x/this.canvas.nativeElement.width;
    var factY = y/this.canvas.nativeElement.height;

    //Riporta le coordinate nel sistema di riferimento iniziale
    var relativeX = Math.round(factX*this.visibleWidth+this.originx);
    var relativeY = Math.round(factY*this.visibleHeight+this.originy);

    if(relativeX<this.canvas.nativeElement.width && relativeY<this.canvas.nativeElement.height){
      this.modelService.addAnt(relativeX, relativeY, this.fStep);

      //Mette un puntino rosso per far capire all'utente dove ha inserito la formica
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(relativeX, relativeY, 1, 1);
      window.alert('Hai aggiunto una nuova formica!');
    }
    else{
      window.alert('Lo zoom attuale non consente di inserire una formica in questa posizione.\nLa corrispondente posizione sarebbe fuori dallo scenario');
    }
    // console.log("relative--> ", relativeX, relativeY);

  }



//Questa funzione effettua lo zoom e il pan scrollando su un punto del canvas
onwheel(event){

    //Definisce l'intensità dello zoom relativamente allo scrool
    var zoomIntensity = 0.01;
    event.preventDefault();

    // Ottiene l'offset del mouse
    var mousex = event.clientX - this.canvas.nativeElement.offsetLeft;
    var mousey = event.clientY - this.canvas.nativeElement.offsetTop;

    // Normalizza il wheel e calcola il fattore di zoom
    var wheel = event.deltaY < 0 ? 1 : -1;
    var zoom = Math.exp(wheel*zoomIntensity);

    //Calcola la coordinate del centro dello zoom e effettua lo scaling
    //attorno al centro
    this.ctx.translate(this.originx, this.originy);
    this.originx -= mousex/(this.scale*zoom) - mousex/this.scale;
    this.originy -= mousey/(this.scale*zoom) - mousey/this.scale;
    this.ctx.scale(zoom, zoom);
    this.ctx.translate(-this.originx, -this.originy);

    //Aggiorna lo scale e la dimensione visibile del canvas
    this.scale *= zoom;
    this.visibleWidth = this.canvas.nativeElement.width / this.scale;
    this.visibleHeight = this.canvas.nativeElement.height / this.scale;
  }

  //Aggiorna il frame rate, al massimo 250 fps
  updateFrameRate(): void{
    if(this.fps > 250){
      this.fps = 250;
    }
    this.updateFPS = true;
  }

}
