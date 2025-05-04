import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Professional, AccountStatus } from '../../../shared/models/professional.model';

import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-professional-details-modal',
  templateUrl: './professional-details-modal.component.html',
  styleUrls: ['./professional-details-modal.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe]
})
export class ProfessionalDetailsModalComponent {
  @Input() professional: Professional | null = null;
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() approve = new EventEmitter<Professional>();
  @Output() reject = new EventEmitter<Professional>();
  @Output() suspend = new EventEmitter<Professional>();
  @Output() reactivate = new EventEmitter<Professional>();
  @Output() delete = new EventEmitter<Professional>();
  @Output() viewDocument = new EventEmitter<string>();

  AccountStatus = AccountStatus;

  getStatusClass(status: AccountStatus): string {
    switch (status) {
      case AccountStatus.PENDING_VERIFICATION: return 'badge bg-warning';
      case AccountStatus.ACTIVE: return 'badge bg-success';
      case AccountStatus.REJECTED: return 'badge bg-danger';
      case AccountStatus.SUSPENDED: return 'badge bg-secondary';
      case AccountStatus.INACTIVE: return 'badge bg-dark';
      default: return 'badge bg-light';
    }
  }

  getStatusIcon(status: AccountStatus): string {
    switch (status) {
      case AccountStatus.PENDING_VERIFICATION: return 'bi-hourglass-split';
      case AccountStatus.ACTIVE: return 'bi-check-circle';
      case AccountStatus.REJECTED: return 'bi-x-circle';
      case AccountStatus.SUSPENDED: return 'bi-pause-circle';
      case AccountStatus.INACTIVE: return 'bi-slash-circle';
      default: return 'bi-question-circle';
    }
  }

  getStatusLabel(status: AccountStatus): string {
    switch (status) {
      case AccountStatus.PENDING_VERIFICATION: return 'En attente';
      case AccountStatus.ACTIVE: return 'Actif';
      case AccountStatus.REJECTED: return 'Rejeté';
      case AccountStatus.SUSPENDED: return 'Suspendu';
      case AccountStatus.INACTIVE: return 'Inactif';
      default: return 'Inconnu';
    }
  }

  onClose() {
    this.close.emit();
  }

  onApprove() {
    if (this.professional) this.approve.emit(this.professional);
  }
  onReject() {
    if (this.professional) this.reject.emit(this.professional);
  }
  onSuspend() {
    if (this.professional) this.suspend.emit(this.professional);
  }
  onReactivate() {
    if (this.professional) this.reactivate.emit(this.professional);
  }
  onDelete() {
    if (this.professional) this.delete.emit(this.professional);
  }
  onViewDocument(path: string | undefined) {
    if (path) {
      this.viewDocument.emit(path);
    }
  }
}
