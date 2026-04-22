import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-closeable',
  imports: [CommonModule],
  templateUrl: './alert-closeable.html',
  styleUrl: './alert-closeable.scss',
})
export class AlertCloseable {

  @Input() errorMessage!: string;
  protected isVisible = true;

  close(): void {
    this.isVisible = false;
  }
}