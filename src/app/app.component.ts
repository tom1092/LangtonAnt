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

  initCanvas(){
    this.ctx.fillStyle = "grey";
    this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  animate(): void {
    const movement = setInterval(() => {
        this.initCanvas();
        if(!this.pause){
          this.iteration += 1;
          this.modelService.moveAnts();
        }
        for (var ant of this.modelService.getAnts()){
          for (var footPrint of ant.path){
            this.ctx.fillStyle = footPrint.color;
            this.ctx.fillRect(footPrint.posX, footPrint.posY, 1, 1);
          }
          this.ctx.fillStyle = "red";
          this.ctx.fillRect(ant.currentPosX-1, ant.currentPosY-1, 3, 3);
          this.ctx.fillStyle = "blue";
          this.ctx.fillRect(ant.currentPosX, ant.currentPosY, 1, 1);
        }
        if(this.updateFPS){
          clearInterval(movement);
          this.updateFPS = false;
          this.animate();
        }
    }, 1000/this.fps);
  }

  playScenario(): void{
    this.pause = false;
  }
  pauseScenario(): void{
    this.pause = true;
  }

  clearScenario(): void{

    // Use the identity matrix while clearing the canvas
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

  onCanvasClick(event: MouseEvent){

    var rect = this.canvas.nativeElement.getBoundingClientRect();
    //var x = event.clientX - this.canvas.nativeElement.offsetLeft;
    //var y = event.clientY - this.canvas.nativeElement.offsetTop;
    var x = Math.round(event.clientX - rect.left);
    var y = Math.round(event.clientY - rect.top);

    console.log("Mouse click coordinates: ", x, y);
    console.log("view width and height: ", this.visibleWidth, this.visibleHeight);
    console.log("origin--> ", this.originx, this.originy);
    console.log("scale--> ", this.scale);

    var factX = x/this.canvas.nativeElement.width;
    var factY = y/this.canvas.nativeElement.height;

    var relativeX = Math.round(factX*this.visibleWidth+this.originx);
    var relativeY = Math.round(factY*this.visibleHeight+this.originy);

    if(relativeX<this.canvas.nativeElement.width && relativeY<this.canvas.nativeElement.height){
      this.modelService.addAnt(relativeX, relativeY, 1);
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(relativeX-1, relativeY-1, 3, 3);
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(relativeX, relativeY, 1, 1);
      window.alert('Hai aggiunto una nuova formica!');
    }
    else{
      window.alert('Lo zoom attuale non consente di inserire una formica in questa posizione.\nLa corrispondente posizione sarebbe fuori dallo scenario');
    }
    console.log("relative--> ", relativeX, relativeY);

  }



onwheel(event){

    var zoomIntensity = 0.01;
    event.preventDefault();
    // Get mouse offset.
    var mousex = event.clientX - this.canvas.nativeElement.offsetLeft;
    var mousey = event.clientY - this.canvas.nativeElement.offsetTop;
    // Normalize wheel to +1 or -1.
    var wheel = event.deltaY < 0 ? 1 : -1;

    // Compute zoom factor.
    var zoom = Math.exp(wheel*zoomIntensity);

    // Translate so the visible origin is at the context's origin.
    this.ctx.translate(this.originx, this.originy);

    // Compute the new visible origin. Originally the mouse is at a
    // distance mouse/scale from the corner, we want the point under
    // the mouse to remain in the same place after the zoom, but this
    // is at mouse/new_scale away from the corner. Therefore we need to
    // shift the origin (coordinates of the corner) to account for this.
    this.originx -= mousex/(this.scale*zoom) - mousex/this.scale;
    this.originy -= mousey/(this.scale*zoom) - mousey/this.scale;

    // Scale it (centered around the origin due to the trasnslate above).
    this.ctx.scale(zoom, zoom);

    // Offset the visible origin to it's proper position.
    this.ctx.translate(-this.originx, -this.originy);

    // Update scale and others.
    this.scale *= zoom;
    this.visibleWidth = this.canvas.nativeElement.width / this.scale;
    this.visibleHeight = this.canvas.nativeElement.height / this.scale;
  }

  updateFrameRate(): void{
    if(this.fps > 250){
      this.fps = 250;
    }
    this.updateFPS = true;
  }

}
