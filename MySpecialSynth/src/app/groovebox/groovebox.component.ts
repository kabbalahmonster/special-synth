import { Component, OnInit } from '@angular/core';
import * as Tone from 'tone';

@Component({
  selector: 'app-groovebox',
  templateUrl: './groovebox.component.html',
  styleUrls: ['./groovebox.component.scss'],
})
export class GrooveboxComponent implements OnInit {
  constructor() {}
  // --- declare variables
  polySynth: any;
  tone: any;
  firstTone: boolean;
  filter: any;
  filterFrequency: number;
  pattern: any;
  patternPlaying: boolean;
  patternNotes: any;
  drumSynth: any;
  loop: any;
  looping: boolean;

  ngOnInit() {
    // --- initialize variables
    this.tone = new Tone();
    this.patternNotes = [
      'c5',
      'e5',
      'g5',
      'c6',
      ['c5', 'e5', 'g5', 'c6'],
      ['d5', 'a5', ' d6'],
    ];
    this.patternPlaying = false;
    this.looping = false;
    this.firstTone = true;
    this.filterFrequency = 400;

    // --- define / construct components
    // construct filter
    this.filter = new Tone.Filter(this.filterFrequency).toMaster();

    // construct polySynth
    this.polySynth = new Tone.PolySynth().connect(this.filter);

    // construct the drumSynth with explicit parameters
    this.drumSynth = new Tone.MembraneSynth({
      pitchDecay: 0.1,
      octaves: 3,
      oscillator: {
        type: 'sine',
      },
      envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0.01,
        release: 2.4,
        attackCurve: 'exponential',
      },
    }).toMaster();

    // construct the polySynth arpeggio pattern
    this.pattern = new Tone.Pattern(
      (time, note) => {
        this.playPolyNote(note);
      },
      this.patternNotes,
      'random'
    );
    // construct the drum loop
    this.loop = new Tone.Loop((time) => {
      this.drumSynth.triggerAttackRelease('c3', time);
    }, '2n');
  }

  // play note with polySynth
  playPolyNote(note: string) {
    if (this.firstTone) {
      this.tone.context.resume();
    }
    this.polySynth.triggerAttackRelease(note, '2n');
  }

  // update filter frequency with input value
  updateFilter() {
    this.filter.frequency.value = this.filterFrequency;
  }

  // start / stop arpeggio (pattern)
  togglePattern() {
    Tone.Transport.start();

    if (this.patternPlaying) {
      this.pattern.stop();
      this.patternPlaying = false;
    } else {
      this.pattern.start();
      this.patternPlaying = true;
    }
  }

  // start / stop drum loop
  toggleLoop() {
    Tone.Transport.start();

    if (this.looping) {
      this.loop.stop();
      this.looping = false;
    } else {
      this.loop.start();
      this.looping = true;
    }
  }
}
