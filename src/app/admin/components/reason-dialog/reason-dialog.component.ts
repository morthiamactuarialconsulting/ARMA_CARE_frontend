import { Component, ElementRef, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ReasonDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-reason-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="modal fade" tabindex="-1" [id]="'reasonModal' + uniqueId" aria-labelledby="reasonModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="reasonModalLabel">{{ data.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>{{ data.message }}</p>
            <div class="form-group">
              <label for="reasonText" class="form-label">Raison</label>
              <textarea class="form-control" id="reasonText" [(ngModel)]="reason" rows="4" required></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-primary" [disabled]="!reason" (click)="onConfirmClick()">Confirmer</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-group {
      margin-bottom: 1rem;
    }
  `]
})
export class ReasonDialogComponent implements OnInit {
  @ViewChild('modal') modalElement!: ElementRef;
  @Input() data: ReasonDialogData = { title: '', message: '' };
  @Output() confirmed = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();
  
  reason = '';
  uniqueId = Math.random().toString(36).substring(2, 9);
  private modalInstance: any;

  ngOnInit(): void {
    // La modal sera initialisée par le composant parent avec Bootstrap
  }

  show(): void {
    // Le composant parent doit afficher la modal avec Bootstrap
  }

  hide(): void {
    // Le composant parent doit masquer la modal avec Bootstrap
  }

  onConfirmClick(): void {
    this.confirmed.emit(this.reason);
    this.hide();
  }

  onCancelClick(): void {
    this.cancelled.emit();
    this.hide();
  }
}
