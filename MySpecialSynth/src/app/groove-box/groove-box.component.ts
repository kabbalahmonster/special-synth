import { Component, OnInit } from '@angular/core';
import * as Tone from 'tone';

@Component({
  selector: 'app-groove-box',
  templateUrl: './groove-box.component.html',
  styleUrls: ['./groove-box.component.scss'],
})
export class GrooveBoxComponent implements OnInit {
  constructor() { }
  // declare variables
  polySynth: any;
  tone: any;
  filter: any;
  filterFrequency: number;
  firstTone: boolean;
  pattern: any;
  patternPlaying: boolean;
  patternNotes: string[];

  ngOnInit() {
    // initialize variables
    this.patternNotes = ['c3','e3','g3','c4'];
    this.filterFrequency=400;
    this.firstTone=true;
    this.tone = new Tone();
    this.filter = new Tone.Filter(this.filterFrequency).toMaster();
    this.polySynth = new Tone.PolySynth().connect(this.filter);    
    this.pattern = new Tone.Pattern((note)=>{this.playPolyNote(note)},this.patternNotes,"random");
    this.patternPlaying = false;

  }

  playPolyNote(note:string){
    if(this.firstTone){
      this.tone.context.resume();
    }

    this.polySynth.triggerAttackRelease(note,'4n');

  }

  // update filter frequency
  updateFilter(){
    this.filter.frequency.value = this.filterFrequency;
  }

  togglePattern(){
    // start tone
    Tone.Transport.start();
  
    console.log("clicked");
    if(this.patternPlaying){
      this.pattern.stop();
      this.patternPlaying=false;
    } else{
      this.pattern.start();
      this.patternPlaying=true;
    }
  }


}
