import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline, addOutline } from 'ionicons/icons';

// Register the icons
addIcons({ trashOutline, addOutline });

interface IncomeEntry {
  source: string;
  amount: number;
}

@Component({
  selector: 'app-income-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  templateUrl: './income-form.component.html',
  styleUrls: ['./income-form.component.scss']
})
export class IncomeFormComponent {
  incomeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.incomeForm = this.fb.group({
      incomes: this.fb.array([])
    });
    this.addIncome(); // Add one empty income entry by default
  }

  get incomes() {
    return this.incomeForm.get('incomes') as FormArray;
  }

  addIncome() {
    const incomeGroup = this.fb.group({
      source: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]]
    });
    this.incomes.push(incomeGroup);
  }

  removeIncome(index: number) {
    if (this.incomes.length > 1) {
      this.incomes.removeAt(index);
    }
  }

  onSubmit() {
    if (this.incomeForm.valid) {
      console.log(this.incomeForm.value);
      // Here you would typically send the data to a service
    }
  }
} 