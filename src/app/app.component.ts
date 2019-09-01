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
  ant: Ant;
  scenario: Scenario;
  iteration: number = 0;
  pause = false;

  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  constructor(private modelService: ModelServiceService){}

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.initCanvas();
    this.modelService.createScenario(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    //this.scenario = new Scenario(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  initCanvas(){
    this.ctx.fillStyle = "grey";
    this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }
  animate(): void {
    this.pause = false;
    const movement = setInterval(() => {
      if(!this.pause){
        this.iteration += 1;
        this.modelService.moveAnts();
        for (var ant of this.modelService.getAnts()){
          this.ctx.fillStyle = ant.currentColor;
          this.ctx.fillRect(ant.currentPosX, ant.currentPosY, 1, 1);
        }
      }
      else{
        clearInterval(movement);
      }
    }, 5);
  }

  pauseScenario(): void{
    this.pause = true;
  }

  clearScenario(): void{
    this.modelService.createScenario(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.pause = true;
    this.iteration = 0;
    this.initCanvas();
  }

  onCanvasClick($event){

    var x = event.pageX - this.canvas.nativeElement.offsetLeft;
    var y = event.pageY - this.canvas.nativeElement.offsetTop;
    console.log(x, y);
    this.modelService.addAnt(x, y, 1);
  }
}
