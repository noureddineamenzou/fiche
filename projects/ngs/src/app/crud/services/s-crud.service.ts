import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc, CollectionReference, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IForm } from '../interfaces/i-form';

@Injectable({
  providedIn: 'root'
})
export class SCrudService {

  private ficheCollection!: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.ficheCollection = collection(this.firestore, 'fiches');
  }

  getAll(): Observable<IForm[]> {
    return collectionData(this.ficheCollection, { idField: 'id' }) as Observable<IForm[]>;
  }

  add(fiche: IForm) {
    return addDoc(this.ficheCollection, fiche);
  }

  update(id: string, fiche: IForm) {
    const ficheDoc = doc(this.firestore, `fiches/${id}`);
    return updateDoc(ficheDoc, { ...fiche });
  }

  delete(id: string) {
    const ficheDoc = doc(this.firestore, `fiches/${id}`);
    return deleteDoc(ficheDoc);
  }
}
