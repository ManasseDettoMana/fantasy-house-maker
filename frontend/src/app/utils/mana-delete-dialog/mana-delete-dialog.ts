import { Component, inject, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'mana-delete-button',
  template: `
    <p-toast />
    <p-confirmdialog />
    <p-button (click)="confirmDelete($event)" severity="danger" [outlined]="true">
      <i class="bi bi-trash"></i>
    </p-button>
  `,
  standalone: true,
  imports: [ButtonModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService]
})
export class CustomDeleteButton {
  //readonly id = input.required<number>();
  readonly confermato = output<boolean>();

  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  confirmDelete(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Confermi di voler eliminare questo elemento?',
      header: 'Attenzione',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Annulla',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Elimina',
        severity: 'danger'
      },
      accept: () => {
        this.confermato.emit(true);
        this.messageService.add({ severity: 'info', summary: 'Confermato', detail: 'Record eliminato' });
      },
      reject: () => {
        this.messageService.add({ severity: 'warn', summary: 'Annullato', detail: 'Operazione annullata' });
      }
    });
  }
}