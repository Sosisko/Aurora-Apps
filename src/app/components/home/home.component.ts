import { Component, OnInit, Output } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
interface Language {
  lang: string;
  code: string;
}

interface Slides {
  title: string;
  image: string;
  description: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  languages: Language[] | undefined;
  selectedLanguage: Language | undefined;

  responsiveSliderOptions: any[] | undefined;

  slides!: any[];

  @Output() visibleModalBriefing: boolean = false;

  constructor(private primengConfig: PrimeNGConfig) {}
  ngOnInit() {
    this.primengConfig.ripple = true;

    this.languages = [
      { lang: 'Русский', code: 'RU' },
      { lang: 'Английский', code: 'EN' },
    ];
    this.selectedLanguage = this.languages.find((lang) => lang.code === 'RU');

    this.responsiveSliderOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
    ];

    this.slides = [
      {
        title: 'MOBILE-РАЗРАБОТКА',
        image: 'slide1.png',
        description:
          'Мы делаем нативные и кроссплатформенные приложения для iOS, Android, Huawei, Roku, Apple TV. UI/UX дизайн, технологии AR/VR и интеграция с любыми существующими решениями',
      },
      {
        title: 'ДИЗАЙН ИНТЕРФЕЙСА И БРЕНДИНГ',
        image: 'slide2.png',
        description:
          'Мы разрабатываем адаптивный и удобный дизайн мобильных приложений для iOS и Android, веб-сайтов. Создаем тот продукт, который решает ваши бизнес-задачи и удовлетворяет потребности пользователей.',
      },
      {
        title: 'WEB-РАЗРАБОТКА',
        image: 'slide3.png',
        description:
          'Проектируем структуру и создаем интерфейс, занимаемся frontend и backend разработкой. Разработка панелей управления и администрирования.',
      },
    ];
  }
  showDialog() {
    this.visibleModalBriefing = true;
  }

}
