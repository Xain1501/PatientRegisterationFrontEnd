import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FormsModule } from '@angular/forms';

// Bootstrap (for modal)
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
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './registered-patients.html',
  styleUrls: ['./registered-patients.scss']
})
export class RegisteredPatients implements OnInit {
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'contactNumber', 'dateOfBirth', 'gender', 'address', 'actions'];
  dataSource = new MatTableDataSource<Patient>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  updateForm!: FormGroup;
  searchId = '';
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
    this.http.get<Patient[]>(this.api).subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
    });
  }

  search(): void {
    const id = this.searchId.trim();
    if (!id) {
      this.loadAll();
    } else {
      this.http.get<Patient>(`${this.api}/${id}`).subscribe(res => {
        this.dataSource = new MatTableDataSource([res]);
        this.dataSource.paginator = this.paginator;
      });
    }
  }

  openEdit(p?: Patient): void {
    this.updateForm.reset();
    const patch = p
      ? { ...p, dateOfBirth: this.formatDate(p.dateOfBirth) }
      : {};
    this.updateForm.patchValue(patch);
    this.showModal();
  }

  save(): void {
    let dto = { ...this.updateForm.value };
    if (!dto.id) delete dto.id;
    if (dto.dateOfBirth instanceof Date) {
      dto.dateOfBirth = this.formatDate(dto.dateOfBirth);
    }

    const req = dto.id
      ? this.http.put(`${this.api}/${dto.id}`, dto)
      : this.http.post(this.api, dto);

    req.subscribe({
      next: () => {
        this.loadAll();
        this.closeModal();
      },
      error: err => console.error('❌ Save failed:', err)
    });
  }

  remove(id: number): void {
    if (!confirm('Delete this patient?')) return;
    this.http.delete(`${this.api}/${id}`).subscribe(() => this.loadAll());
  }

  private formatDate(dt: string | Date): string {
    const d = new Date(dt);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

  private showModal(): void {
    const el = document.getElementById('editModal');
    if (!el) return console.error('Modal element not found');
    this.modalInstance = new bootstrap.Modal(el);
    this.modalInstance.show();
  }

  closeModal(): void {
    if (this.modalInstance) this.modalInstance.hide();
  }
}
