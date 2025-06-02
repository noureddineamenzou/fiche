import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { doc, setDoc, Firestore } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Component({
  selector: 'ngs-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule
  ],
  templateUrl: './dialog-component.component.html',
})
export class DialogComponentComponent {
  form: FormGroup;
  firestore: Firestore = inject(Firestore);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      level: [data?.level || '', Validators.required],
      status: [data?.status || 'draft']
    });
  }

  async save() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const ficheId = this.data?.id || Date.now().toString();

    await setDoc(doc(this.firestore, 'fiches', ficheId), {
      id: ficheId,
      ...formValue
    });

    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
