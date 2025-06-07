import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { SCrudService } from '../../services/s-crud.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgFor, NgIf],
  templateUrl: './form.component.html',
styles: [`
  label::after,h4::after,h3::after {
    content: " *";
    color: red;
  }

  .error-message {
    color: #ef4444;
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
`]

})
export class FormComponent implements OnInit {
  currentStep = 0;

  steps = [
    { label: 'étape 1' },
    { label: 'étape 2' },
    { label: 'étape 3' },
    { label: 'étape 4' },
    { label: 'étape 5' },
    { label: 'étape 6' },
    { label: 'étape 7' },
    { label: 'étape 8' },
    { label: 'étape 9' },
    { label: 'étape 10' },
    { label: 'étape 11' },
    { label: 'étape 12' },
    { label: 'étape 13' },
    { label: 'étape 14' },
  ];

  stepOneForm: FormGroup;
  stepTwoForm: FormGroup;
  stepThreeForm: FormGroup;
  stepFourForm: FormGroup;
  stepFiveForm: FormGroup;
  stepSixForm: FormGroup;
  stepSevenForm: FormGroup;
  stepEightForm: FormGroup;
  stepNineForm: FormGroup;
  stepTenForm: FormGroup;
  stepElevenForm: FormGroup;
  stepTwelveForm: FormGroup;
  stepThirteenForm: FormGroup;
  isSubmitting: boolean = false;
  evaluationFileName: string = '';
  formBase: any = {};
  ficheId!: string;

  constructor(
    private fb: FormBuilder,
    private ficheService: SCrudService,
    private route: ActivatedRoute,
    private firestore: Firestore
  ) {
    this.stepOneForm = this.fb.group({
      niveauScolaire: ['', Validators.required],
      classe: ['', Validators.required],
      matiere: ['', Validators.required],
      filiere: ['', Validators.required],
      realisePar: ['', Validators.required]
    });

    this.stepTwoForm = this.fb.group({
      unite: ['', Validators.required],
      chapitre: ['', Validators.required],
      dureeUnite: ['', Validators.required],
      uniteTimeType: ['min', Validators.required],
      dureeChapitre: ['', Validators.required],
      chapitreTimeType: ['min', Validators.required],
      references: this.fb.array([this.fb.control('', Validators.required)])
    });

    this.stepThreeForm = this.fb.group({
      transversales: this.fb.group({
        communicationnelles: this.fb.array([this.fb.control('', Validators.required)]),
        methodologiques: this.fb.array([this.fb.control('', Validators.required)]),
        strategiques: this.fb.array([this.fb.control('', Validators.required)]),
        culturelles: this.fb.array([this.fb.control('', Validators.required)]),
        technologiques: this.fb.array([this.fb.control('', Validators.required)])
      }),
      specifiques: this.fb.array([this.fb.control('', Validators.required)])
    });

    this.stepFourForm = this.fb.group({
      prerequis: this.fb.array([this.fb.control('', Validators.required)])
    });

    this.stepFiveForm = this.fb.group({
      prolongements: this.fb.array([this.fb.control('', Validators.required)])
    });

    this.stepSixForm = this.fb.group({
      planChapitre: this.fb.group({
        titre: ['', Validators.required],
        duree: ['', Validators.required],
        unite: ['min', Validators.required]
      }),
      Introduction: this.fb.group({
        titre: ['Introduction', Validators.required],
        duree: ['', Validators.required],
        unite: ['min', Validators.required]
      }),
      titre2: this.fb.array([
        this.createTitreSection(true)
      ]),
      conclusion: this.fb.group({
        titre: ['Conclusion', Validators.required],
        duree: ['', Validators.required],
        unite: ['min', Validators.required]
      }),
      evaluation: this.fb.group({
        titre: ['Évaluation formative', Validators.required],
        duree: ['', Validators.required],
        unite: ['min', Validators.required]
      }),
      soutien: this.fb.group({
        titre: ['Soutien', Validators.required],
        duree: ['', Validators.required],
        unite: ['min', Validators.required]
      })
    });

    this.stepSevenForm = this.fb.group({
      situationProbleme: ['', Validators.required]
    });

    this.stepEightForm = this.fb.group({
      introduction: ['', Validators.required],
      objectifs: this.fb.array([this.fb.control('', Validators.required)]),
      supports: this.fb.array([this.fb.control('', Validators.required)]),
      Bilan: ['', Validators.required],
    });

    this.stepNineForm = this.fb.group({
      activiteBlocks: this.fb.array([
        this.createActiviteBlock(true)
      ])
    });

    this.stepTenForm = this.fb.group({
      activiteBlocks: this.fb.array([
        this.createActiviteBlockimg(true)
      ])
    });

    this.stepElevenForm = this.fb.group({
      BilanGénéral: ['', Validators.required]
    });

    this.stepTwelveForm = this.fb.group({
      evaluationImage: [null, Validators.required]
    });

    this.stepThirteenForm = this.fb.group({
      description: ['', Validators.required],
      duree: ['', Validators.required],
      unite: ['min', Validators.required]
    });
  }

  ngOnInit(): void {
    this.ficheId = this.route.snapshot.paramMap.get('id')!;
    if (this.ficheId) {
      this.loadFicheData(this.ficheId);
    }

    // اربط كل نموذج بـ valueChanges علشان يتحفظ تلقائيًا
    const forms = [
      { name: 'stepOneForm', form: this.stepOneForm },
      { name: 'stepTwoForm', form: this.stepTwoForm },
      { name: 'stepThreeForm', form: this.stepThreeForm },
      { name: 'stepFourForm', form: this.stepFourForm },
      { name: 'stepFiveForm', form: this.stepFiveForm },
      { name: 'stepSixForm', form: this.stepSixForm },
      { name: 'stepSevenForm', form: this.stepSevenForm },
      { name: 'stepEightForm', form: this.stepEightForm },
      { name: 'stepNineForm', form: this.stepNineForm },
      { name: 'stepTenForm', form: this.stepTenForm },
      { name: 'stepElevenForm', form: this.stepElevenForm },
      { name: 'stepTwelveForm', form: this.stepTwelveForm },
      { name: 'stepThirteenForm', form: this.stepThirteenForm }
    ];

    forms.forEach(({ name, form }) => {
      form.valueChanges.subscribe(value => {
        this.onStepFormChanged(name, value);
      });
    });
  }

  onStepFormChanged(stepName: string, formValue: any) {
    this.formBase[stepName] = formValue;

    this.ficheService.updateFicheData(this.ficheId, this.formBase)

  }

  loadFicheData(id: string) {
    const ficheDoc = doc(this.firestore, 'fiches', id);
    getDoc(ficheDoc).then(docSnapshot => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        this.formBase = data || {};

        this.stepOneForm.patchValue(data['stepOneForm'] || {});
        this.stepTwoForm.patchValue(data['stepTwoForm'] || {});
        this.stepThreeForm.patchValue(data['stepThreeForm'] || {});
        this.stepFourForm.patchValue(data['stepFourForm'] || {});
        this.stepFiveForm.patchValue(data['stepFiveForm'] || {});
        this.stepSixForm.patchValue(data['stepSixForm'] || {});
        this.stepSevenForm.patchValue(data['stepSevenForm'] || {});
        this.stepEightForm.patchValue(data['stepEightForm'] || {});
        this.stepNineForm.patchValue(data['stepNineForm'] || {});
        this.stepTenForm.patchValue(data['stepTenForm'] || {});
        this.stepElevenForm.patchValue(data['stepElevenForm'] || {});
        this.stepTwelveForm.patchValue(data['stepTwelveForm'] || {});
        this.stepThirteenForm.patchValue(data['stepThirteenForm'] || {});
      }
    });
  }

  goToStep(index: number) {
    this.currentStep = index;
  }

  nextStep() {
  const currentForm = this.getCurrentForm();


  if (currentForm.invalid) {
      console.log(currentForm.errors, currentForm);
  alert('Veuillez remplir tous les champs requis à cette étape');

    currentForm.markAllAsTouched(); // علشان يظهر الأخطاء للمستخدم
    return; // متتنقلش للخطوة التالية
  }

  if (this.currentStep < this.steps.length - 1) {
    this.currentStep++;
  } else {
    console.log('done', {
      stepOne: this.stepOneForm.value,
      stepTwo: this.stepTwoForm.value,
      stepThree: this.stepThreeForm.value,
      stepFour: this.stepFourForm.value,
      stepFive: this.stepFiveForm.value,
      stepSix: this.stepSixForm.value,
      stepSeven: this.stepSevenForm.value,
      stepEight: this.stepEightForm.value,
      stepNine: this.stepNineForm.value,
      stepTen: this.stepTenForm.value,
      stepEleven: this.stepElevenForm.value,
      stepThirteen: this.stepThirteenForm.value,
      stepTwelve: this.stepTwelveForm.value,
    });
  }
}
getCurrentForm(): FormGroup {
  switch (this.currentStep) {
    case 0: return this.stepOneForm;
    case 1: return this.stepTwoForm;
    case 2: return this.stepThreeForm;
    case 3: return this.stepFourForm;
    case 4: return this.stepFiveForm;
    case 5: return this.stepSixForm;
    case 6: return this.stepSevenForm;
    case 7: return this.stepEightForm;
    case 8: return this.stepNineForm;
    case 9: return this.stepTenForm;
    case 10: return this.stepElevenForm;
    case 11: return this.stepTwelveForm;
    case 12: return this.stepThirteenForm;
    default: return this.stepOneForm;
  }
}


  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  // Step Two
  get references(): FormArray {
    return this.stepTwoForm.get('references') as FormArray;
  }

  addReference() {
    this.references.push(this.fb.control(''));
  }

  removeReference(index: number) {
    this.references.removeAt(index);
  }

  // Step Three
  get transversales() {
    return this.stepThreeForm.get('transversales') as FormGroup;
  }

  getArray(name: string): FormArray {
    return this.transversales.get(name) as FormArray;
  }

  get specifiques(): FormArray {
    return this.stepThreeForm.get('specifiques') as FormArray;
  }

  addTransversale(type: string) {
    this.getArray(type).push(this.fb.control(''));
  }

  removeTransversale(type: string, index: number) {
    this.getArray(type).removeAt(index);
  }

  addSpecifique() {
    this.specifiques.push(this.fb.control(''));
  }

  removeSpecifique(index: number) {
    this.specifiques.removeAt(index);
  }
  //step four
  get prerequis(): FormArray {
    return this.stepFourForm.get('prerequis') as FormArray;
  }

  addPrerequis() {
    this.prerequis.push(this.fb.control(''));
  }

  removePrerequis(index: number) {
    this.prerequis.removeAt(index);
  }
  //step five
  get prolongements(): FormArray {
    return this.stepFiveForm.get('prolongements') as FormArray;
  }

  addprolongement() {
    this.prolongements.push(this.fb.control(''));
  }

  removeprolongement(index: number) {
    this.prolongements.removeAt(index);
  }
  //step six
  createTitreSection(required = false): FormGroup {
  return this.fb.group({
    lignes: this.fb.group({
      titre: ['', required ? Validators.required : []],
      duree: ['', required ? Validators.required : []],
      unite: ['min', required ? Validators.required : []]
    }),
    activites: this.fb.array([])
  });
}



  get titre2(): FormArray {
    return this.stepSixForm.get('titre2') as FormArray;
  }
  addTitreSection() {
    this.titre2.push(this.createTitreSection());
  }

  removeTitreSection(index: number) {
    if (this.titre2.length > 1) {
      this.titre2.removeAt(index);
    }
  }

  getActivites(index: number): FormArray {
    return (this.titre2.at(index).get('activites') as FormArray);
  }

  addActivite(index: number) {
    this.getActivites(index).push(this.fb.group({
      titre: [''],
      duree: [''],
      unite: ['min']
    }));
  }

  removeActivite(titreIndex: number, activiteIndex: number) {
    this.getActivites(titreIndex).removeAt(activiteIndex);
  }

  getRomanNumeral(num: number): string {
    const romanNumerals: string[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return romanNumerals[num] || (num + 1).toString();
  }
  //step8
  get objectifs(): FormArray {
    return this.stepEightForm.get('objectifs') as FormArray;
  }
  addObjectif() {
    this.objectifs.push(this.fb.control(''));
  }
  removeObjectif(i: number) {
    this.objectifs.removeAt(i);
  }

  get supports(): FormArray {
    return this.stepEightForm.get('supports') as FormArray;
  }
  addSupport() {
    this.supports.push(this.fb.control(''));
  }
  removeSupport(i: number) {
    this.supports.removeAt(i);
  }

  //step9
  createActiviteBlock(required = false): FormGroup {
    const validator = required ? Validators.required : null;
    return this.fb.group({
      activiteDescription: this.fb.array([this.fb.control('', validator)]),
      Planificationdeactivite: this.fb.array([this.fb.control('', validator)]),
      Objectifsapprentissage: this.fb.array([this.fb.control('', validator)])
    });
  }


  get activiteBlocks(): FormArray {
    return this.stepNineForm.get('activiteBlocks') as FormArray;
  }

  addActiviteBlock() {
    this.activiteBlocks.push(this.createActiviteBlock());
  }
 
  removeActiviteBlock(i: number) {
    if (this.activiteBlocks.length > 1) {
      this.activiteBlocks.removeAt(i);
    }
  }
    duplicateActiviteBlock(i: number) {
    const original = this.activiteBlocks.at(i).value;
    this.activiteBlocks.push(this.fb.group({
      activiteDescription: this.fb.array(original.activiteDescription.map((o: string) => this.fb.control(o))),
      Planificationdeactivite: this.fb.array(original.Planificationdeactivite.map((s: string) => this.fb.control(s))),
      Objectifsapprentissage: this.fb.array(original.Objectifsapprentissage.map((p: string) => this.fb.control(p)))
    }));
  }

  getFormArray(blockIndex: number, fieldName: string): FormArray {
    return this.activiteBlocks.at(blockIndex).get(fieldName) as FormArray;
  }

  addItem(blockIndex: number, fieldName: string) {
    this.getFormArray(blockIndex, fieldName).push(this.fb.control(''));
  }

  removeItem(blockIndex: number, fieldName: string, itemIndex: number) {
    this.getFormArray(blockIndex, fieldName).removeAt(itemIndex);
  }
  //step10
  createActiviteBlockimg(required: boolean = false): FormGroup {
    const validator = required ? Validators.required : null;

    return this.fb.group({
      description: ['', validator],
      image: [''],
      questions: this.fb.array([this.fb.control('', validator)]),
      bilan: ['', validator],
      conclusion: ['', validator]
    });
  }


  get activiteBlocksImg(): FormArray {
    return this.stepTenForm.get('activiteBlocks') as FormArray;
  }

  addActiviteBlockimg() {
    this.activiteBlocksImg.push(this.createActiviteBlockimg());
  }

  removeActiviteBlockimg(i: number) {
    if (this.activiteBlocksImg.length > 1) {
      this.activiteBlocksImg.removeAt(i);
    }
  }

  getQuestions(blockIndex: number): FormArray {
    return this.activiteBlocksImg.at(blockIndex).get('questions') as FormArray;
  }

  addQuestion(blockIndex: number) {
    this.getQuestions(blockIndex).push(this.fb.control(''));
  }

  removeQuestion(blockIndex: number, questionIndex: number) {
    this.getQuestions(blockIndex).removeAt(questionIndex);
  }

  uploadImage(blockIndex: number, event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || !input.files.length) return;

  const file = input.files[0];
  const allowedTypes = ['image/jpeg', 'image/png'];

  if (!allowedTypes.includes(file.type)) {
    alert('يرجى رفع صورة بصيغة JPEG أو PNG.');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const control = this.activiteBlocksImg.at(blockIndex).get('image');
    control?.setValue(reader.result as string);
    control?.markAsDirty();
    control?.markAsTouched();
    control?.updateValueAndValidity();

    // جرب تنتقل لو النموذج صالح
    if (this.stepTenForm.valid) {
      this.nextStep();
    }
  };
  reader.readAsDataURL(file);
}



  duplicateActiviteBlockimg(index: number): void {
    const originalBlock = this.activiteBlocksImg.at(index).value;
    const newBlock = this.fb.group({
      activiteTitle: ['Activité ' + (this.activiteBlocksImg.length + 1)],
      description: [originalBlock.description],
      image: [originalBlock.image],
      questions: this.fb.array(originalBlock.questions.map((q: string) => this.fb.control(q))),
      bilan: [originalBlock.bilan],
      conclusion: [originalBlock.conclusion]
    });
    this.activiteBlocksImg.push(newBlock);
  }

  //step11
  evaluationImagePreview: string | ArrayBuffer | null = null;
evaluationImageName: string = ''; // ← بدل evaluationFileName

onEvaluationImageUpload(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.evaluationImageName = file.name; // ← حفظ اسم الصورة

    const reader = new FileReader();
    reader.onload = (e) => {
      this.evaluationImagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    this.stepTwelveForm.patchValue({
      evaluationImage: file
    });

    // ← في حالة تحب تحديث الـ validity مباشرة بعد التغيير:
    this.stepTwelveForm.get('evaluationImage')?.updateValueAndValidity();
  }
}

removeEvaluationImage() {
  this.evaluationImagePreview = null;
  this.evaluationImageName = '';

  this.stepTwelveForm.patchValue({
    evaluationImage: null
  });

  // تحديث صلاحية الفورم
  this.stepTwelveForm.get('evaluationImage')?.updateValueAndValidity();

  const input = document.getElementById('evaluation-image') as HTMLInputElement;
  if (input) {
    input.value = '';
  }
}

  //revison

  submitAllForms() {
    this.isSubmitting = true;

    const allFormData = {
      stepOne: this.stepOneForm.value,
      stepTwo: this.stepTwoForm.value,
      stepThree: this.stepThreeForm.value,
      stepFour: this.stepFourForm.value,
      stepFive: this.stepFiveForm.value,
      stepSix: this.stepSixForm.value,
      stepSeven: this.stepSevenForm.value,
      stepEight: this.stepEightForm.value,
      stepNine: this.stepNineForm.value,
      stepTen: this.stepTenForm.value,
      stepEleven: this.stepElevenForm?.value,
      stepTwelve: this.stepTwelveForm?.value,
      stepThirteen: this.stepThirteenForm?.value
    };

    console.log('All Form Data:', allFormData);

    setTimeout(() => {
      this.isSubmitting = false;
      alert('تم إرسال البيانات بنجاح!');
    }, 1500);
  }
  markFicheAsCompleted() {
    this.ficheService.updateFicheData(this.ficheId, { status: 'Completed' })

  }

  print() {
    window.print();
    this.markFicheAsCompleted(); // تحديث الحالة بعد الطباعة
  }
}
