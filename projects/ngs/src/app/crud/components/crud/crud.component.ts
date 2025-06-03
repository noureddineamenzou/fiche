import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { IForm } from '../../interfaces/i-form';
import { SCrudService } from '../../services/s-crud.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Firestore, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { DialogComponentComponent } from '../dialog-component/dialog-component.component';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'ngs-crud',
  imports: [ReactiveFormsModule, CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatCheckboxModule,FormsModule],
  templateUrl: './crud.component.html',
  styles: ''
,

  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrudComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['select', 'id', 'name', 'level', 'status', 'actions'];
  searchControl = new FormControl('');
  firestore: Firestore = inject(Firestore);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog,private router:Router) {}

  ngOnInit(): void {
    this.getFiches();
    this.searchControl.valueChanges.subscribe(searchText => {
      this.dataSource.filter = searchText?.trim().toLowerCase() || '';
    });
  }

  getFiches() {
    const fichesCollection = collection(this.firestore, 'fiches');
    collectionData(fichesCollection, { idField: 'id' }).subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
addNew() {
  const dialogRef = this.dialog.open(DialogComponentComponent, {
    width: '600px',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // أنشئ المرجع فقط بعد الحصول على البيانات
      const ficheRef = doc(collection(this.firestore, 'fiches'));

      const newFiche = {
        ...result,
        status: 'Draft', // الحالة مبدئيًا
      };

      setDoc(ficheRef, newFiche).then(() => {
        this.router.navigate([`/form/${ficheRef.id}`]); // انتقل للنموذج
      }).catch(err => {
        console.error("فشل في إنشاء Fiche:", err);
      });
    }
  });
}



 editFiche(fiche: any) {
  const dialogRef = this.dialog.open(DialogComponentComponent, {
    width: '600px',
    data: fiche
  });

  dialogRef.afterClosed().subscribe(updatedValues => {
    if (updatedValues) {
      const updatedFiche = {
        ...fiche,
        ...updatedValues
      };

      const ficheRef = doc(this.firestore, 'fiches', fiche.id);

      setDoc(ficheRef, updatedFiche)
        .then(() => {
          // ✅ بعد التعديل روح على الفورم بتاع الـ ID دا
          this.router.navigate([`/form/${fiche.id}`]);
        })
        .catch(err => console.error('فشل في تحديث Fiche:', err));
    }
  });
}




  deleteFiche(id: string) {
    const ficheDoc = doc(this.firestore, 'fiches', id);
    deleteDoc(ficheDoc).then(() => this.getFiches());
  }

  toggleSelectAll(event: any) {
    const checked = event.checked;
    this.dataSource.data.forEach(fiche => fiche.selected = checked);
  }
}