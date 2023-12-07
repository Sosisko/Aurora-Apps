import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import * as intlTelInput from 'intl-tel-input';
import { Dialog } from 'primeng/dialog';
import { Subscription } from 'rxjs';
import { FormService } from 'src/app/services/form-service';

@Component({
  selector: 'app-modal-brief',
  templateUrl: './modal-brief.component.html',
  styleUrls: ['./modal-brief.component.scss'],
})
export class ModalBriefComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modal') modal!: Dialog;
  @Input() visibleModalBriefing!: boolean;
  @Output() visibleModalBriefingChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  form!: FormGroup;
  private modalSubscription!: Subscription;
  formSendSuccess = false;
  phoneMask: string = '';
  dialCode: string = '';
  quantityPhoneNumbers!: number;
  loading: boolean = false;

  themeList: any[] = [];
  serviceList: any[] = [];
  otherOptions: any[] = [];
  selectedThemeItem: string | undefined = '';
  selectedOS: string[] = [];
  selectedLang: string[] = [];
  selectedBudget: string[] = [];
  selectedOtherOptions: string[] = [];

  selectedCountryData: any;

  iti: any;

  constructor(private fService: FormService) {}

  closeModal() {
    this.visibleModalBriefing = false;
    this.visibleModalBriefingChange.emit(this.visibleModalBriefing);
    this.form.reset();
    this.formSendSuccess = false;
    this.iti.destroy();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email, Validators.required]),
      social: new FormControl(''),
      site: new FormControl(''),
      theme: new FormControl(''),
      os: new FormControl(''),
      lang: new FormControl(''),
      service: new FormControl(''),
      budget: new FormControl(''),
      otherOptions: new FormControl(''),
      textArea: new FormControl(''),
    });

    this.themeList = this.fService.themeList;
    this.serviceList = this.fService.serviceList;
    this.otherOptions = this.fService.otherOptions;
  }

  ngAfterViewInit() {
    this.modalSubscription = this.modal.onShow.subscribe(() => {
      let inputPhone = document.querySelector('#phone');
      if (inputPhone) {
        this.iti = intlTelInput(inputPhone, {
          allowDropdown: true,

          //autoInsertDialCode: true,
          autoPlaceholder: 'aggressive',
          //dropdownContainer: document.body,
          // excludeCountries: ["us"],
          //formatOnDisplay: true,
          geoIpLookup: function (callback) {
            fetch('https://ipapi.co/json')
              .then(function (res) {
                return res.json();
              })
              .then(function (data) {
                callback(data.country_code);
              })
              .catch(function () {
                callback('ru');
              });
          },
          //hiddenInput: "full_number",
          initialCountry: 'auto',
          // localizedCountries: { 'de': 'Deutschland' },
          //nationalMode: true,
          //onlyCountries: ['ru', 'gb', 'ch', 'ca', 'do'],
          //placeholderNumberType: "MOBILE",
          // preferredCountries: ['cn', 'jp'],
          separateDialCode: true,
          utilsScript:
            'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.2.1/js/utils.js',
        });

        inputPhone.addEventListener('countrychange', () => {
          let selectedCountryData = this.iti.getSelectedCountryData();
          //console.log(selectedCountryData);
          this.iti.promise.then(() => {
            // Get an example number for the selected country to use as placeholder.
            var newPlaceholder = intlTelInputUtils.getExampleNumber(
              selectedCountryData.iso2,
              true,
              //@ts-ignore
              intlTelInputUtils.numberFormat.INTERNATIONAL
            );
            this.dialCode = selectedCountryData.dialCode;

            //console.log(newPlaceholder);

            this.iti.setNumber('');

            let newPlaceholder2;

            if (newPlaceholder.charAt(0) !== '(') {
              newPlaceholder2 = newPlaceholder.substring(1);
            } else {
              newPlaceholder2 = newPlaceholder;
            }

            let onlyNumbers = newPlaceholder2.replace(/[^0-9]/g, '');
            //console.log(onlyNumbers);
            let quantityPhoneNumbers = onlyNumbers.length;
            // console.log(quantityPhoneNumbers);
            this.quantityPhoneNumbers = quantityPhoneNumbers;
            //console.log(this.quantityPhoneNumbers);

            let mask = newPlaceholder2.replace(/[1-9]/g, '0');

            this.phoneMask = mask;
          });
        });
      }
    });
  }

  submit() {
    console.log({
      ...this.form.value,
      phone: '+' + this.dialCode + this.form.value.phone,
    });

    if (this.form.valid) {
      let formData = {
        ...this.form.value,
        phone: '+' + this.dialCode + this.form.value.phone,
      };
      this.loading = true;
      emailjs
        .send(
          'service_rpvx3ih',
          'template_wov24fo',
          formData,
          '40NDy3hPxsnea-Fcd'
        )
        .then(
          (result: EmailJSResponseStatus) => {
            console.log(result.text);
            this.loading = false;
            this.formSendSuccess = true;
          },
          (error) => {
            console.log(error.text);
          }
        );

      this.form.reset();
      console.log(formData);
    } else {
      this.form.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }
}
