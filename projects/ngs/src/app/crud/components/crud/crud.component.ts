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
import { Firestore, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { DialogComponentComponent } from '../dialog-component/dialog-component.component';
import { MatSort } from '@angular/material/sort';

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
  styles: [`
   .mat-paginator {
    background-color: #ffffff;
    border-top: 1px solid #e5e7eb;
    padding: 8px 16px;
    font-size: 14px;
    color: #111827; /* أسود غامق */
  }
.container-text-color{
  color:#111827;
}
  .mat-paginator-icon {
    color: #111827 !important; /* أسود غامق للأسهم */
  }

  ::ng-deep .mat-paginator-range-label,
  ::ng-deep .mat-paginator-page-size-label,
   .mat-select-value {
    color: #111827;
    font-weight: 500;
  }

  ::ng-deep .mat-option {
    font-size: 14px;
  }
`],

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

  constructor(private dialog: MatDialog) {}

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
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.getFiches();
    });
  }

  editFiche(fiche: any) {
    const dialogRef = this.dialog.open(DialogComponentComponent, {
      width: '600px',
      data: fiche
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.getFiches();
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
