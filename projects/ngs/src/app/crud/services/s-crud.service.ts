import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  CollectionReference,
  DocumentData,
  setDoc,
  query,
  where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IForm } from '../interfaces/i-form';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class SCrudService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  private ficheCollection: CollectionReference<DocumentData>;

  constructor() {
    this.ficheCollection = collection(this.firestore, 'fiches');
  }

  async getAll(): Promise<Observable<IForm[]>> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const q = query(this.ficheCollection, where('createdBy', '==', user.uid));
    return collectionData(q, { idField: 'id' }) as Observable<IForm[]>;
  }

  async add(fiche: IForm) {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    return addDoc(this.ficheCollection, {
      ...fiche,
      createdBy: user.uid,
      createdAt: new Date()
    });
  }

  update(id: string, fiche: IForm) {
    const ficheDoc = doc(this.firestore, `fiches/${id}`);
    return updateDoc(ficheDoc, { ...fiche });
  }

  delete(id: string) {
    const ficheDoc = doc(this.firestore, `fiches/${id}`);
    return deleteDoc(ficheDoc);
  }

  updateFicheData(id: string, data: any) {
    const ficheRef = doc(this.firestore, 'fiches', id);
    return setDoc(ficheRef, data, { merge: true });  // لا يمسح البيانات القديمة
  }
}
