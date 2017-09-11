import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'state-button',
  templateUrl: './state-button.component.html',
  styleUrls: ['./state-button.component.scss']
})
export class StateButtonComponent implements OnInit {

  renderValue = '';

  @Input() value: string | number = '';

  states = {
    RUNNING: false,
    AWAITING: false,
    BUSY: false,
    STOPPED: false,
    MAINTENANCE: false,
    PENDING: false,
    FINISHED_FAIL: false,
    FINISHED_OK: false,
  };

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();    
    this.states[this.renderValue] = true;
  }
}
