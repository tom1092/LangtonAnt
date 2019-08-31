import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import {Ant} from '../ant';
import {Scenario} from '../scenario';

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

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.fillStyle = "grey";

    this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.scenario = new Scenario(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.ant = new Ant(500, 300, this.scenario, 5);

  }

  animate(): void {
    const i = setInterval(() => {
      this.iteration += 1;
      this.ant.move();
      this.ctx.fillStyle = this.ant.currentColor;
      this.ctx.fillRect(this.ant.currentPosX, this.ant.currentPosY, 5, 5);
      console.log(this.ant.currentPosX, this.ant.currentPosY);
    }, 5);
  }
}
