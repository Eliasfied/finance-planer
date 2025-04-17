import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonText, IonInput, IonSelect, IonSelectOption, IonButton, ModalController, IonButtons, IonItem } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, trash } from 'ionicons/icons';
import { Expense } from '../../../../models/expense.model';
import { ExpenseService } from '../../../../services/expense.service';

@Component({
  selector: 'app-edit-expense-modal',
  templateUrl: './edit-expense-modal.component.html',
  styleUrls: ['./edit-expense-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonIcon,
    IonText,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
  ]
})
export class EditExpenseModalComponent implements OnInit {
  @Input() expense!: Expense;
  expenseForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private expenseService: ExpenseService
  ) {
    addIcons({ close, trash });
  }

  ngOnInit() {
    this.expenseForm = this.formBuilder.group({
      name: [this.expense.name, Validators.required],
      category: [this.expense.category, Validators.required],
      amount: [this.expense.amount, [Validators.required, Validators.min(0)]],
      billingTime: [this.expense.billingTime, Validators.required],
      billingDate: [this.expense.billingDate, [Validators.required, Validators.min(1), Validators.max(31)]]
    });
  }

  async dismiss() {
    await this.modalCtrl.dismiss();
  }

  async save() {
    if (this.expenseForm.valid) {
      const updatedExpense = {
        ...this.expense,
        ...this.expenseForm.value
      };
      await this.modalCtrl.dismiss({
        expense: updatedExpense
      });
    }
  }

  async deleteExpense() {
    await this.expenseService.deleteExpense(this.expense.id);
    await this.modalCtrl.dismiss({ deleted: true });
  }
} 