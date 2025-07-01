// src/app/components/registered-patients.component.ts
import { Component, OnInit }        from '@angular/core';
import { CommonModule }             from '@angular/common';
import { HttpClient }               from '@angular/common/http';
import { FormsModule }              from '@angular/forms';
import {
  ReactiveFormsModule, FormBuilder, FormGroup, Validators
} from '@angular/forms';

interface Patient {
  id:            number;
  firstName:     string;
  lastName?:     string;
  dateOfBirth:   string;
  gender?:       string;
  contactNumber: string;
  address?:      string;
}

@Component({
  selector   : 'app-registered-patients',
  standalone : true,
  imports    : [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registered-patients.html',
  styleUrls  : ['./registered-patients.scss']
})
export class RegisteredPatients implements OnInit {

  /* ---------- state ---------- */
  patients:   Patient[] = [];
  searchId   = '';
  updateForm!: FormGroup;
  api        = 'https://localhost:7010/api/patients';

  constructor(private fb: FormBuilder,
              private http: HttpClient) {}

  /* ---------- life‑cycle ---------- */
  ngOnInit(): void {
    this.loadAll();
    this.updateForm = this.fb.group({
      id:            [''],
      firstName:     ['', Validators.required],
      lastName:      [''],
      dateOfBirth:   ['', Validators.required],
      gender:        [''],
      contactNumber: ['', Validators.required],
      address:       ['']
    });
  }

  /* ---------- CRUD helpers ---------- */
  loadAll(): void {                                    // ← used by template
    this.http.get<Patient[]>(this.api)
             .subscribe(res => this.patients = res);
  }

  search(): void {                                     // ← used by template
    const id = this.searchId.trim();
    if (!id) { this.loadAll(); return; }

    this.http.get<Patient>(`${this.api}/${id}`)
             .subscribe(res => this.patients = [res]);
  }

  openEdit(p?: Patient): void {                        // ← used by template
    /* if p exists it’s Edit, otherwise Add */
    this.updateForm.reset();          // clear old state
    this.updateForm.patchValue(p ?? {});
    (window as any).bootstrap
      .Modal.getOrCreateInstance('#editModal')
      .show();
  }

  save(): void {                                       // ← used by template (ngSubmit)
    const dto = this.updateForm.value;
    const req = dto.id
      ? this.http.put(`${this.api}/${dto.id}`, dto)    // UPDATE (PUT)
      : this.http.post(this.api, dto);                 // CREATE (POST)

    req.subscribe(() => {
      this.loadAll();
      this.closeModal();
    });
  }

  remove(id: number): void {                           // ← used by template
    if (!confirm('Delete this patient?')) { return; }
    this.http.delete(`${this.api}/${id}`)
             .subscribe(() => this.loadAll());
  }

  /* ---------- utilities ---------- */
  private closeModal(): void {
    (window as any).bootstrap
      .Modal.getInstance('#editModal')
      ?.hide();
  }
}
