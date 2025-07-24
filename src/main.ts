import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { EdiCenterComponent } from './components/edi-center/edi-center.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EdiCenterComponent],
  template: `
    <app-edi-center></app-edi-center>
  `,
})
export class App {
  name = 'EDI Center';
}

bootstrapApplication(App);