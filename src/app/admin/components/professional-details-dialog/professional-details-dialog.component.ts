import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Professional } from '../../../shared/models/professional.model';

export interface ProfessionalDetailsDialogData {
  professional: Professional;
}

@Component({
  selector: 'app-professional-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe
  ],
  template: `
    <div class="modal fade" tabindex="-1" [id]="'proDetailsModal' + uniqueId" aria-labelledby="proDetailsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="proDetailsModalLabel">
              Détails du professionnel: Dr. {{ professional.firstName }} {{ professional.lastName }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs" id="proDetailsTabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="personal-tab" data-bs-toggle="tab" data-bs-target="#personal" type="button" role="tab" aria-controls="personal" aria-selected="true">Informations personnelles</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="professional-tab" data-bs-toggle="tab" data-bs-target="#professional" type="button" role="tab" aria-controls="professional" aria-selected="false">Informations professionnelles</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="documents-tab" data-bs-toggle="tab" data-bs-target="#documents" type="button" role="tab" aria-controls="documents" aria-selected="false">Documents</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="account-tab" data-bs-toggle="tab" data-bs-target="#account" type="button" role="tab" aria-controls="account" aria-selected="false">Statut du compte</button>
              </li>
            </ul>
            
            <div class="tab-content pt-3" id="proDetailsContent">
              <!-- Informations personnelles -->
              <div class="tab-pane fade show active" id="personal" role="tabpanel" aria-labelledby="personal-tab">
                <div class="details-section">
                  <div class="detail-item">
                    <strong>Nom complet:</strong> {{ professional.firstName }} {{ professional.lastName }}
                  </div>
                  <div class="detail-item">
                    <strong>Spécialité:</strong> {{ professional.speciality }}
                  </div>
                  <div class="detail-item">
                    <strong>Email:</strong> {{ professional.email }}
                  </div>
                  <div class="detail-item">
                    <strong>Téléphone:</strong> {{ professional.phone }}
                  </div>
                </div>
              </div>
              
              <!-- Informations professionnelles -->
              <div class="tab-pane fade" id="professional" role="tabpanel" aria-labelledby="professional-tab">
                <div class="details-section">
                  <div class="detail-item">
                    <strong>Adresse:</strong> {{ professional.address }}
                  </div>
                  <div class="detail-item">
                    <strong>Ville:</strong> {{ professional.city }}
                  </div>
                  <div class="detail-item">
                    <strong>Numéro d'enregistrement:</strong> {{ professional.registrationNumber }}
                  </div>
                </div>
              </div>
              
              <!-- Documents -->
              <div class="tab-pane fade" id="documents" role="tabpanel" aria-labelledby="documents-tab">
                <div class="details-section">
                  <div class="documents-list">
                    <div class="document" *ngIf="professional.identityDocumentPath">
                      <div class="document-name">
                        <i class="bi bi-person-badge"></i> Pièce d'identité
                      </div>
                      <button class="btn btn-outline-primary" (click)="viewDocument(professional.identityDocumentPath)">
                        <i class="bi bi-eye"></i> Voir
                      </button>
                    </div>
                    
                    <div class="document" *ngIf="professional.diplomaPath">
                      <div class="document-name">
                        <i class="bi bi-award"></i> Diplôme
                      </div>
                      <button class="btn btn-outline-primary" (click)="viewDocument(professional.diplomaPath)">
                        <i class="bi bi-eye"></i> Voir
                      </button>
                    </div>
                    
                    <div class="document" *ngIf="professional.licensePath">
                      <div class="document-name">
                        <i class="bi bi-file-earmark-check"></i> Licence
                      </div>
                      <button class="btn btn-outline-primary" (click)="viewDocument(professional.licensePath)">
                        <i class="bi bi-eye"></i> Voir
                      </button>
                    </div>
                    
                    <div class="document" *ngIf="professional.professionalInsurancePath">
                      <div class="document-name">
                        <i class="bi bi-shield-check"></i> Assurance professionnelle
                      </div>
                      <button class="btn btn-outline-primary" (click)="viewDocument(professional.professionalInsurancePath)">
                        <i class="bi bi-eye"></i> Voir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Statut du compte -->
              <div class="tab-pane fade" id="account" role="tabpanel" aria-labelledby="account-tab">
                <div class="details-section">
                  <div class="detail-item">
                    <strong>Statut du compte:</strong> 
                    <span [ngClass]="{
                      'status-pending': professional.accountStatus === 'PENDING_VERIFICATION',
                      'status-verified': professional.accountStatus === 'ACTIVE',
                      'status-rejected': professional.accountStatus === 'REJECTED',
                      'status-suspended': professional.accountStatus === 'SUSPENDED'
                    }">
                      {{ professional.accountStatus === 'PENDING_VERIFICATION' ? 'En attente' :
                         professional.accountStatus === 'ACTIVE' ? 'Vérifié' :
                         professional.accountStatus === 'REJECTED' ? 'Rejeté' :
                         professional.accountStatus === 'SUSPENDED' ? 'Suspendu' : 'Inconnu' }}
                    </span>
                  </div>
                  <div class="detail-item" *ngIf="professional.statusChangeDate">
                    <strong>Dernière modification du statut:</strong> {{ professional.statusChangeDate | date:'dd/MM/yyyy HH:mm' }}
                  </div>
                  <div class="detail-item" *ngIf="professional.statusChangeReason">
                    <strong>Raison du changement:</strong> {{ professional.statusChangeReason }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .details-section {
      margin: 16px 0;
    }
    
    .detail-item {
      margin-bottom: 8px;
      line-height: 1.5;
    }
    
    .documents-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .document {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }
    
    .document-name {
      display: flex;
      align-items: center;
      gap: 8px;
    }
        
    .status-pending { color: #ff9800; }
    .status-verified { color: #4caf50; }
    .status-rejected { color: #f44336; }
    .status-suspended { color: #9c27b0; }
  `]
})
export class ProfessionalDetailsDialogComponent {
  @Input() professional!: Professional;
  @Output() closed = new EventEmitter<void>();
  
  uniqueId = Math.random().toString(36).substring(2, 9);

  viewDocument(documentPath: string): void {
    window.open(`/api/documents/${documentPath}`, '_blank');
  }
  
  close(): void {
    this.closed.emit();
  }
}
