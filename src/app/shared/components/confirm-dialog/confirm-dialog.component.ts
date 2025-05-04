import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <div class="modal fade" tabindex="-1" [id]="'confirmModal' + uniqueId" aria-labelledby="confirmModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmModalLabel">{{ data.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p [innerHTML]="data.message"></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              {{ data.cancelButtonText || 'Annuler' }}
            </button>
            <button type="button" class="btn btn-primary" (click)="onConfirmClick()">
              {{ data.confirmButtonText || 'Confirmer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ConfirmDialogComponent implements OnInit {
  @Input() data: ConfirmDialogData = { title: '', message: '' };
  @Output() confirmed = new EventEmitter<boolean>();
  @Output() cancelled = new EventEmitter<void>();
  
  uniqueId = Math.random().toString(36).substring(2, 9);

  ngOnInit(): void {
    // La modal sera initialisée par le composant parent avec Bootstrap
  }

  show(): void {
    // Le composant parent doit afficher la modal avec Bootstrap
  }

  hide(): void {
    // Le composant parent doit masquer la modal avec Bootstrap
  }

  onNoClick(): void {
    this.cancelled.emit();
    this.hide();
  }

  onConfirmClick(): void {
    this.confirmed.emit(true);
    this.hide();
  }
}
