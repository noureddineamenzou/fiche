import {
  ChangeDetectionStrategy, Component, inject, OnInit,
  ViewChild, ViewEncapsulation
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import {
  Firestore, collection, collectionData, deleteDoc, doc, setDoc,
  query, where
} from '@angular/fire/firestore';
import { getAuth } from '@angular/fire/auth';
import { DialogComponentComponent } from '../dialog-component/dialog-component.component';
import { Router } from '@angular/router';

@Component({
  selector: 'ngs-crud',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule,
    MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule,
    MatInputModule, MatFormFieldModule, MatMenuModule, MatSlideToggleModule,
    MatDialogModule, MatCheckboxModule, FormsModule
  ],
  templateUrl: './crud.component.html',
  styles: [`.custom-backdrop { background-color: rgba(0, 0, 0, 0.5) !important; }`],
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

  uid: string | null = null;

  constructor(private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      this.uid = user.uid;
      this.getFiches();
      this.searchControl.valueChanges.subscribe(searchText => {
        this.dataSource.filter = searchText?.trim().toLowerCase() || '';
      });
    } else {
      console.warn("User not logged in.");
    }
  }

  getFiches() {
    if (!this.uid) return;

    const fichesCollection = collection(this.firestore, 'fiches');
    const fichesQuery = query(fichesCollection, where('createdBy', '==', this.uid));

    collectionData(fichesQuery, { idField: 'id' }).subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  addNew() {
    const dialogRef = this.dialog.open(DialogComponentComponent, {
      width: '600px',
      backdropClass: 'custom-backdrop',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.uid) {
        const ficheRef = doc(collection(this.firestore, 'fiches'));

        const newFiche = {
          ...result,
          status: 'draft',
          createdBy: this.uid // ✅ تحديد صاحب الـ fiche
        };

        setDoc(ficheRef, newFiche).then(() => {
          this.router.navigate([`/form/${ficheRef.id}`]);
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
            this.router.navigate([`/form/${fiche.id}`]);
          })
          .catch(err => console.error('erorr Fiche:', err));
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
