import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Declare bootstrap to avoid TypeScript errors
declare var bootstrap: any;

interface Patient {
  id: number;
  firstName: string;
  lastName?: string;
  dateOfBirth: string;
  gender?: string;
  contactNumber: string;
  address?: string;
}

@Component({
  selector: 'app-registered-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registered-patients.html',
  styleUrls: ['./registered-patients.scss']
})
export class RegisteredPatients implements OnInit {
  patients: Patient[] = [];
  searchId = '';
  updateForm!: FormGroup;
  api = 'https://localhost:7010/api/patients';
  private modalInstance: any;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAll();
    this.updateForm = this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: [''],
      dateOfBirth: ['', Validators.required],
      gender: [''],
      contactNumber: ['', Validators.required],
      address: ['']
    });
  }

  loadAll(): void {
    this.http.get<Patient[]>(this.api).subscribe(res => (this.patients = res));
  }

  search(): void {
    const id = this.searchId.trim();
    if (!id) { 
      this.loadAll(); 
    } else { 
      this.http.get<Patient>(`${this.api}/${id}`).subscribe(res => (this.patients = [res])); 
    }
  }

  openEdit(p?: Patient): void {
    this.updateForm.reset();
    const patient = p
      ? { ...p, dateOfBirth: this.formatDate(p.dateOfBirth) }
      : {};
    this.updateForm.patchValue(patient);
    this.showModal();
  }

  save(): void {
    const dto = this.updateForm.value;
    const req = dto.id
      ? this.http.put(`${this.api}/${dto.id}`, dto)
      : this.http.post(this.api, dto);
    req.subscribe(() => {
      this.loadAll();
      this.closeModal();
    });
  }

  remove(id: number): void {
    if (!confirm('Delete this patient?')) return;
    this.http.delete(`${this.api}/${id}`).subscribe(() => this.loadAll());
  }

  private formatDate(dt: string): string {
    const d = new Date(dt);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

  private showModal(): void {
    const modalElement = document.getElementById('editModal');
    if (!modalElement) {
      console.error('Modal element not found');
      return;
    }
    
    // Create Bootstrap modal instance
    this.modalInstance = new bootstrap.Modal(modalElement);
    this.modalInstance.show();
  }

  closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }
}