import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']  
})
export class Home {
  patientForm: FormGroup;
  submitted = false;
  success = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.patientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      dateOfBirth: ['', Validators.required],
      gender: [''],
      contactNumber: ['', Validators.required],
      address: ['']
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.patientForm.valid) {
      this.http.post('https://localhost:7010/api/patients', this.patientForm.value).subscribe({
        next: () => {
          this.success = true;
          this.patientForm.reset();
        },
        error: () => {
          this.success = false;
        }
      });
    }
  }
}
