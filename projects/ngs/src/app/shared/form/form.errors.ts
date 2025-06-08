import { AbstractControl } from '@angular/forms';

export class Ai1FormValidatorError {
    static getFormControlErrorText(
        ctrl: AbstractControl,
        name: string
    ): string {
        if (ctrl.hasError('required')) {
            return `${camelCaseToText(name).toUpperCase()} est requis`;
        } else if (ctrl.hasError('pattern')) {
            return `${camelCaseToText(
                name
            ).toUpperCase()} value is not permitted`;
        } else if (ctrl.hasError('minlength')) {
            return `${camelCaseToText(name).toUpperCase()} est plus court que ${
                ctrl.errors?.['minlength'].requiredLength
            }`;
        } else if (ctrl.hasError('maxlength')) {
            return `${camelCaseToText(name).toUpperCase()} est plus long que ${
                ctrl.errors?.['maxlength'].requiredLength
            }`;
        } else if (ctrl.hasError('email')) {
            return `${camelCaseToText(name).toUpperCase()} n'est pas une adresse e-mail valide`;
        } else if (ctrl.hasError('min')) {
            return `${camelCaseToText(
                name
            ).toUpperCase()} doit être supérieur à ${
                ctrl.errors?.['min'].min
            }`;
        } else if (ctrl.hasError('max')) {
            return `${camelCaseToText(
                name
            ).toUpperCase()} doit être inférieur à ${
                ctrl.errors?.['max'].max
            }`;
        } else {
            return `${camelCaseToText(name).toUpperCase()} contient une erreur`;
        }
    }
}

function camelCaseToText(camelCalse: string): string {
    return camelCalse
        .replace(/([A-Z]+)/g, ' $1')
        .replace(/([A-Z][a-z])/g, ' $1');
}
