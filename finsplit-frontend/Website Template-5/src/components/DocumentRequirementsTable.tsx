import { useState } from 'react';
import { Check, X, FileText, CreditCard, Receipt, Plane, Truck, MapPin, Building2, Clock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

interface CountryRequirement {
  country: string;
  countryEn: string;
  flag: string;
  documents: string[];
  documentsEn: string[];
  where: string;
  whereEn: string;
  deadline: string;
  deadlineEn: string;
  specifics: string;
  specificsEn: string;
}

interface Requirement {
  businessType: string;
  businessTypeEn: string;
  icon: any;
  color: string;
  description: string;
  descriptionEn: string;
  countryRequirements: CountryRequirement[];
}

const requirements: Requirement[] = [
  {
    businessType: 'B2B (внутренние переводы)',
    businessTypeEn: 'B2B (Domestic)',
    icon: FileText,
    color: 'blue',
    description: 'Коммерческие сделки между юрлицами внутри одной страны',
    descriptionEn: 'Commercial transactions between legal entities within one country',
    countryRequirements: [
      {
        country: 'Казахстан 🇰🇿',
        countryEn: 'Kazakhstan 🇰🇿',
        flag: '🇰🇿',
        documents: [
          'Договор или счёт на оплату',
          'Платёжное поручение или выписка с ИИК',
          'Акт выполненных работ / оказанных услуг',
          'Счёт-фактура (ЭСФ) — обязательна в ИС ЭСФ',
        ],
        documentsEn: [
          'Contract or Invoice',
          'Payment order or bank statement',
          'Act of completed works / services rendered',
          'Invoice (ESF) — mandatory in ESF IS system',
        ],
        where: 'Налоговая: ИС ЭСФ (esf.gov.kz) для НДС',
        whereEn: 'Tax Office: ESF IS system (esf.gov.kz) for VAT',
        deadline: 'ЭСФ выставляется в течение 15 календарных дней с момента отгрузки',
        deadlineEn: 'ESF issued within 15 calendar days from shipment date',
        specifics: 'С 2024 года обязательна интеграция с ИС ЭСФ для всех плательщиков НДС. Хранение 5 лет.',
        specificsEn: 'ESF IS integration mandatory for all VAT payers since 2024. Storage: 5 years.',
      },
      {
        country: 'Россия 🇷🇺',
        countryEn: 'Russia 🇷🇺',
        flag: '🇷🇺',
        documents: [
          'Договор поставки/оказания услуг',
          'Счёт на оплату',
          'Платёжное поручение',
          'Товарная накладная ТОРГ-12 (для товаров)',
          'Акт выполненных работ',
          'Счёт-фактура с подписью ЭЦП (для НДС)',
        ],
        documentsEn: [
          'Supply/Service Agreement',
          'Invoice',
          'Payment order',
          'Goods waybill TORG-12 (for goods)',
          'Act of completed works',
          'Invoice with digital signature (for VAT)',
        ],
        where: 'Налоговая: личный кабинет налогоплательщика на nalog.gov.ru, система ЭДО (СБИС, Контур)',
        whereEn: 'Tax Office: taxpayer account at nalog.gov.ru, EDI system (SBIS, Kontur)',
        deadline: 'Счёт-фактура — в течение 5 дней после отгрузки. УПД можно сразу.',
        deadlineEn: 'Invoice — within 5 days after shipment. UPD can be immediate.',
        specifics: 'Обязателен ЭДО для крупных компаний. УПД (универсальный передаточный документ) заменяет счёт-фактуру + акт.',
        specificsEn: 'EDI mandatory for large companies. UPD replaces invoice + act.',
      },
      {
        country: 'Грузия 🇬🇪',
        countryEn: 'Georgia 🇬🇪',
        flag: '🇬🇪',
        documents: [
          'Контракт (хеклшекрулеба)',
          'Инвойс (инвоиси)',
          'Акт приёма-передачи',
        ],
        documentsEn: [
          'Contract (khelshek\'ruleba)',
          'Invoice (invoisi)',
          'Acceptance act',
        ],
        where: 'RS.ge — электронная система налоговой',
        whereEn: 'RS.ge — electronic tax system',
        deadline: 'Инвойс в день транзакции',
        deadlineEn: 'Invoice on transaction day',
        specifics: 'НДС 18%. Упрощённый учёт для оборота до 500K GEL в год. E-invoicing обязателен с 2024.',
        specificsEn: 'VAT 18%. Simplified accounting for turnover up to 500K GEL/year. E-invoicing mandatory since 2024.',
      },
      {
        country: 'Армения 🇦🇲',
        countryEn: 'Armenia 🇦🇲',
        flag: '🇦🇲',
        documents: [
          'Договор',
          'Счёт-фактура (хашив-апранкагир)',
          'Платёжное поручение',
          'Акт выполненных работ',
        ],
        documentsEn: [
          'Contract',
          'Invoice (hashiv-apranqagir)',
          'Payment order',
          'Act of completed works',
        ],
        where: 'Электронная система tax.am',
        whereEn: 'Electronic system tax.am',
        deadline: 'Счёт-фактура — в течение 5 дней',
        deadlineEn: 'Invoice — within 5 days',
        specifics: 'НДС 20%. Обязательна регистрация в E-invoice для оборота > 115M AMD.',
        specificsEn: 'VAT 20%. E-invoice registration mandatory for turnover > 115M AMD.',
      },
      {
        country: 'ЕС 🇪🇺',
        countryEn: 'EU 🇪🇺',
        flag: '🇪🇺',
        documents: [
          'Commercial Agreement',
          'Invoice (включая VAT если applicable)',
          'Delivery Note',
          'Proof of Payment',
        ],
        documentsEn: [
          'Commercial Agreement',
          'Invoice (including VAT if applicable)',
          'Delivery Note',
          'Proof of Payment',
        ],
        where: 'Зависит от страны (напр. ELSTER в Германии, Belastingdienst в Нидерландах)',
        whereEn: 'Depends on country (e.g., ELSTER in Germany, Belastingdienst in Netherlands)',
        deadline: 'Invoice — обычно в течение 30 дней от отгрузки',
        deadlineEn: 'Invoice — typically within 30 days of shipment',
        specifics: 'Директива 2010/45/EU об электронном инвойсинге. PEPPOL для B2G обязателен.',
        specificsEn: 'Directive 2010/45/EU on e-invoicing. PEPPOL mandatory for B2G.',
      },
    ],
  },
  {
    businessType: 'B2C (онлайн-оплаты)',
    businessTypeEn: 'B2C (Online Payments)',
    icon: CreditCard,
    color: 'purple',
    description: 'Продажи физлицам через интернет с эквайрингом',
    descriptionEn: 'Sales to individuals online with acquiring',
    countryRequirements: [
      {
        country: 'Казахстан 🇰🇿',
        countryEn: 'Kazakhstan 🇰🇿',
        flag: '🇰🇿',
        documents: [
          'Чек ККМ (онлайн-касса)',
          'Отчёт эквайринга от банка',
          'Выписка с ИИК',
        ],
        documentsEn: [
          'Cash register receipt (online)',
          'Acquiring report from bank',
          'Bank statement',
        ],
        where: 'Чеки передаются в ОФД (Казахтелеком, Choconet и др.), затем в КГД',
        whereEn: 'Receipts sent to OFD (Kazakhtelecom, Choconet, etc.), then to Tax Committee',
        deadline: 'Чек — мгновенно при оплате',
        deadlineEn: 'Receipt — instantly upon payment',
        specifics: 'Онлайн-касса обязательна для всех. API интеграция с ОФД. Штрафы до 25 МРП за отсутствие чека.',
        specificsEn: 'Online cash register mandatory for all. API integration with OFD. Fines up to 25 MCI for missing receipt.',
      },
      {
        country: 'Россия 🇷🇺',
        countryEn: 'Russia 🇷🇺',
        flag: '🇷🇺',
        documents: [
          'Чек ККТ (54-ФЗ)',
          'Отчёт эквайринга',
          'Договор оферты',
        ],
        documentsEn: [
          'Cash register receipt (54-FZ)',
          'Acquiring report',
          'Offer agreement',
        ],
        where: 'ОФД (Платформа ОФД, Первый ОФД, Эвотор ОФД) → ФНС',
        whereEn: 'OFD (Platforma OFD, Perviy OFD, Evotor OFD) → FTS',
        deadline: 'Чек — мгновенно, отправка в ОФД в течение 30 секунд',
        deadlineEn: 'Receipt — instant, sent to OFD within 30 seconds',
        specifics: 'Обязательна маркировка товаров (Честный ЗНАК). Штраф до 30K руб. за отсутствие чека.',
        specificsEn: 'Goods marking mandatory (Honest SIGN). Fine up to 30K RUB for missing receipt.',
      },
      {
        country: 'Грузия 🇬🇪',
        countryEn: 'Georgia 🇬🇪',
        flag: '🇬🇪',
        documents: [
          'E-invoice через RS.ge',
          'Подтверждение платежа от платёжной системы',
        ],
        documentsEn: [
          'E-invoice via RS.ge',
          'Payment confirmation from payment system',
        ],
        where: 'RS.ge (Revenue Service)',
        whereEn: 'RS.ge (Revenue Service)',
        deadline: 'Инвойс в день продажи',
        deadlineEn: 'Invoice on sale day',
        specifics: 'Нет обязательной онлайн-кассы для IT-услуг. Для физических товаров — регистрация в RS.',
        specificsEn: 'No mandatory online cash register for IT services. Physical goods — RS registration required.',
      },
      {
        country: 'Армения 🇦🇲',
        countryEn: 'Armenia 🇦🇲',
        flag: '🇦🇲',
        documents: [
          'Чек ККМ (регистрированная касса)',
          'Отчёт эквайринга',
        ],
        documentsEn: [
          'Cash register receipt (registered)',
          'Acquiring report',
        ],
        where: 'tax.am — Электронные чеки передаются автоматически',
        whereEn: 'tax.am — Electronic receipts transmitted automatically',
        deadline: 'Чек — мгновенно',
        deadlineEn: 'Receipt — instant',
        specifics: 'С 2022 обязательны электронные чеки для всех. Штраф 100K AMD за отсутствие.',
        specificsEn: 'Electronic receipts mandatory for all since 2022. Fine 100K AMD for missing.',
      },
      {
        country: 'ЕС 🇪🇺',
        countryEn: 'EU 🇪🇺',
        flag: '🇪🇺',
        documents: [
          'Invoice / Receipt',
          'Payment Gateway Report',
          'MOSS/OSS VAT return (для цифровых услуг)',
        ],
        documentsEn: [
          'Invoice / Receipt',
          'Payment Gateway Report',
          'MOSS/OSS VAT return (for digital services)',
        ],
        where: 'Зависит от страны регистрации VAT (OSS — one-stop-shop для всего ЕС)',
        whereEn: 'Depends on VAT registration country (OSS — one-stop-shop for all EU)',
        deadline: 'Invoice — обычно в течение 14 дней',
        deadlineEn: 'Invoice — typically within 14 days',
        specifics: 'OSS упрощает декларирование VAT по всему ЕС. Ставки VAT от 17% до 27% в зависимости от страны.',
        specificsEn: 'OSS simplifies VAT declaration across EU. VAT rates 17%-27% depending on country.',
      },
    ],
  },
  {
    businessType: 'Самозанятые / фриланс',
    businessTypeEn: 'Self-employed / Freelance',
    icon: Receipt,
    color: 'green',
    description: 'Работа с физлицами на НПД или фрилансерами',
    descriptionEn: 'Working with individuals on professional income tax or freelancers',
    countryRequirements: [
      {
        country: 'Казахстан 🇰🇿',
        countryEn: 'Kazakhstan 🇰🇿',
        flag: '🇰🇿',
        documents: [
          'Договор-оферта или договор ГПХ',
          'Акт выполненных работ',
          'Чек ИП или подтверждение перевода',
        ],
        documentsEn: [
          'Offer agreement or GPC contract',
          'Act of completed works',
          'IE receipt or transfer confirmation',
        ],
        where: 'ИП подаёт ОПВ через Кабинет налогоплательщика',
        whereEn: 'IE submits pension contributions via Taxpayer Cabinet',
        deadline: 'Декларация ИП — до 31 марта следующего года',
        deadlineEn: 'IE declaration — by March 31 of following year',
        specifics: 'Упрощённая декларация для ИП. ОПВ 10% обязательны. Можно работать без ИП через сервисы типа Paidwork.',
        specificsEn: 'Simplified declaration for IE. 10% pension contributions mandatory. Can work without IE via services like Paidwork.',
      },
      {
        country: 'Россия 🇷🇺',
        countryEn: 'Russia 🇷🇺',
        flag: '🇷🇺',
        documents: [
          'Договор ГПХ или оферта',
          'Акт выполненных работ',
          'Чек из приложения "Мой налог" (НПД)',
        ],
        documentsEn: [
          'GPC contract or offer',
          'Act of completed works',
          'Receipt from "My Tax" app (NPD)',
        ],
        where: 'Приложение "Мой налог" — автоматическая передача в ФНС',
        whereEn: '"My Tax" app — automatic submission to FTS',
        deadline: 'Чек — сразу после получения оплаты (до 9 числа следующего месяца)',
        deadlineEn: 'Receipt — immediately after payment (by 9th of next month)',
        specifics: 'НПД (налог на профессиональный доход) 4-6%. Лимит 2.4M руб/год. Нет отчётности — всё автоматически.',
        specificsEn: 'NPD (professional income tax) 4-6%. Limit 2.4M RUB/year. No reporting — all automatic.',
      },
      {
        country: 'Грузия 🇬🇪',
        countryEn: 'Georgia 🇬🇪',
        flag: '🇬🇪',
        documents: [
          'Контракт',
          'Инвойс через RS.ge',
          'Подтверждение банковского перевода',
        ],
        documentsEn: [
          'Contract',
          'Invoice via RS.ge',
          'Bank transfer confirmation',
        ],
        where: 'RS.ge для индивидуальных предпринимателей',
        whereEn: 'RS.ge for individual entrepreneurs',
        deadline: 'Декларация — до 1 апреля',
        deadlineEn: 'Declaration — by April 1',
        specifics: 'Статус "Микробизнес" при обороте до 30K GEL — налог 1%. Свыше — 3% + 20% НДС.',
        specificsEn: 'Microbusiness status for turnover up to 30K GEL — 1% tax. Above — 3% + 20% VAT.',
      },
      {
        country: 'Армения 🇦🇲',
        countryEn: 'Armenia 🇦🇲',
        flag: '🇦🇲',
        documents: [
          'Договор',
          'Акт / счёт-фактура',
          'Подтверждение перевода',
        ],
        documentsEn: [
          'Contract',
          'Act / invoice',
          'Transfer confirmation',
        ],
        where: 'tax.am для ИП',
        whereEn: 'tax.am for IE',
        deadline: 'Квартальная декларация',
        deadlineEn: 'Quarterly declaration',
        specifics: 'ИП платят 23% подоходный + 5% с оборота. Есть микробизнес с фиксированным налогом 5K AMD/месяц.',
        specificsEn: 'IE pays 23% income tax + 5% turnover tax. Microbusiness with fixed tax 5K AMD/month available.',
      },
      {
        country: 'ЕС 🇪🇺',
        countryEn: 'EU 🇪🇺',
        flag: '🇪🇺',
        documents: [
          'Service Agreement / Freelance Contract',
          'Invoice',
          'Timesheet (если почасовая работа)',
        ],
        documentsEn: [
          'Service Agreement / Freelance Contract',
          'Invoice',
          'Timesheet (if hourly work)',
        ],
        where: 'Местная налоговая в стране резидентства',
        whereEn: 'Local tax office in country of residence',
        deadline: 'Varies (обычно ежеквартально или ежегодно)',
        deadlineEn: 'Varies (typically quarterly or annually)',
        specifics: 'Нужна регистрация как самозанятый (Freiberufler в DE, Auto-entrepreneur во FR). VAT reverse charge для B2B.',
        specificsEn: 'Registration as self-employed required (Freiberufler in DE, Auto-entrepreneur in FR). VAT reverse charge for B2B.',
      },
    ],
  },
  {
    businessType: 'ВЭД (международные сделки)',
    businessTypeEn: 'Foreign Trade (International)',
    icon: Plane,
    color: 'orange',
    description: 'Экспорт/импорт товаров и услуг между странами',
    descriptionEn: 'Export/import of goods and services between countries',
    countryRequirements: [
      {
        country: 'Казахстан 🇰🇿',
        countryEn: 'Kazakhstan 🇰🇿',
        flag: '🇰🇿',
        documents: [
          'Внешнеторговый контракт (обязателен)',
          'Инвойс (Invoice)',
          'SWIFT MT103 или аналог',
          'Паспорт сделки (для сумм > $50K)',
          'Грузовая таможенная декларация (ГТД)',
          'Сертификаты соответствия (если требуется)',
        ],
        documentsEn: [
          'Foreign trade contract (mandatory)',
          'Invoice',
          'SWIFT MT103 or equivalent',
          'Transaction passport (for amounts > $50K)',
          'Cargo customs declaration (CTD)',
          'Certificates of conformity (if required)',
        ],
        where: 'Банк для валютного контроля, Таможня КР (customs.gov.kz), КГД для ЭСФ',
        whereEn: 'Bank for currency control, Customs of Kazakhstan (customs.gov.kz), Tax Committee for ESF',
        deadline: 'Паспорт сделки — до первого платежа. ГТД — при пересечении границы.',
        deadlineEn: 'Transaction passport — before first payment. CTD — at border crossing.',
        specifics: 'Обязательна репатриация валютной выручки. Экспорт в ЕАЭС без ГТД, но с декларацией на товары.',
        specificsEn: 'Mandatory currency revenue repatriation. EAEU exports without CTD but with goods declaration.',
      },
      {
        country: 'Россия 🇷🇺',
        countryEn: 'Russia 🇷🇺',
        flag: '🇷🇺',
        documents: [
          'Контракт (обязательно с номером)',
          'Invoice',
          'SWIFT MT103 + Credit Advice',
          'Паспорт сделки (для суммы > $50K)',
          'ГТД / ДТ (декларация на товары)',
          'Транспортные документы (коносамент/CMR)',
        ],
        documentsEn: [
          'Contract (with mandatory number)',
          'Invoice',
          'SWIFT MT103 + Credit Advice',
          'Transaction passport (for amount > $50K)',
          'CTD / DT (goods declaration)',
          'Transport documents (bill of lading/CMR)',
        ],
        where: 'Банк (валютный контроль через ЦБ), ФТС (customs.gov.ru), ФНС',
        whereEn: 'Bank (currency control via CB), FCS (customs.gov.ru), FTS',
        deadline: 'Паспорт сделки — в течение 15 дней после контракта. Репатриация — обычно 90-180 дней.',
        deadlineEn: 'Transaction passport — within 15 days after contract. Repatriation — typically 90-180 days.',
        specifics: 'Жёсткий валютный контроль. Экспорт услуг тоже требует подтверждений. С 2022 — санкционные ограничения для некоторых стран.',
        specificsEn: 'Strict currency control. Service exports also require confirmations. Since 2022 — sanctions restrictions for some countries.',
      },
      {
        country: 'Грузия 🇬🇪',
        countryEn: 'Georgia 🇬🇪',
        flag: '🇬🇪',
        documents: [
          'Контракт',
          'Invoice',
          'Подтверждение платежа (SWIFT/SEPA)',
          'Customs Declaration (при импорте товаров)',
        ],
        documentsEn: [
          'Contract',
          'Invoice',
          'Payment confirmation (SWIFT/SEPA)',
          'Customs Declaration (for goods import)',
        ],
        where: 'RS.ge, Customs.gov.ge (для импорта)',
        whereEn: 'RS.ge, Customs.gov.ge (for imports)',
        deadline: 'Декларация — до 1 апреля',
        deadlineEn: 'Declaration — by April 1',
        specifics: 'Нет валютного контроля. Свободное движение капитала. Таможенные пошлины низкие (0-12%). FTA с ЕС, Китаем.',
        specificsEn: 'No currency control. Free capital movement. Low customs duties (0-12%). FTA with EU, China.',
      },
      {
        country: 'Армения 🇦🇲',
        countryEn: 'Armenia 🇦🇲',
        flag: '🇦🇲',
        documents: [
          'Контракт',
          'Invoice',
          'SWIFT-подтверждение',
          'Customs Declaration',
          'Certificate of Origin (при необходимости)',
        ],
        documentsEn: [
          'Contract',
          'Invoice',
          'SWIFT confirmation',
          'Customs Declaration',
          'Certificate of Origin (if required)',
        ],
        where: 'tax.am, Customs Service of Armenia',
        whereEn: 'tax.am, Customs Service of Armenia',
        deadline: 'Таможенная декларация — при пересечении границы',
        deadlineEn: 'Customs declaration — at border crossing',
        specifics: 'Член ЕАЭС — свободная торговля с РФ, KZ, BY, KG. Для ЕС — FTA. Минимальный валютный контроль.',
        specificsEn: 'EAEU member — free trade with RU, KZ, BY, KG. FTA with EU. Minimal currency control.',
      },
      {
        country: 'ЕС 🇪🇺',
        countryEn: 'EU 🇪🇺',
        flag: '🇪🇺',
        documents: [
          'Commercial Invoice',
          'Intrastat Declaration (для внутри-ЕС торговли)',
          'Export/Import Declaration',
          'Certificate of Origin',
          'Transport Documents (Bill of Lading, CMR)',
          'EUR.1 / Form A (для преференций)',
        ],
        documentsEn: [
          'Commercial Invoice',
          'Intrastat Declaration (for intra-EU trade)',
          'Export/Import Declaration',
          'Certificate of Origin',
          'Transport Documents (Bill of Lading, CMR)',
          'EUR.1 / Form A (for preferences)',
        ],
        where: 'Customs authorities (varies by country), EORI registration required',
        whereEn: 'Customs authorities (varies by country), EORI registration required',
        deadline: 'Intrastat — monthly. Export declaration — at shipment.',
        deadlineEn: 'Intrastat — monthly. Export declaration — at shipment.',
        specifics: 'Нужен EORI номер для таможни. Внутри ЕС — свободное движение товаров. Brexit усложнил торговлю с UK.',
        specificsEn: 'EORI number required for customs. Within EU — free movement of goods. Brexit complicated UK trade.',
      },
    ],
  },
  {
    businessType: 'Агентские / логистические услуги',
    businessTypeEn: 'Agency / Logistics Services',
    icon: Truck,
    color: 'indigo',
    description: 'Транспортные, экспедиторские и агентские услуги',
    descriptionEn: 'Transport, freight forwarding and agency services',
    countryRequirements: [
      {
        country: 'Казахстан 🇰🇿',
        countryEn: 'Kazakhstan 🇰🇿',
        flag: '🇰🇿',
        documents: [
          'Договор на оказание услуг',
          'Транспортная накладная (ТТН)',
          'Акт выполненных работ',
          'Счёт-фактура (ЭСФ)',
        ],
        documentsEn: [
          'Service agreement',
          'Transport waybill (TTN)',
          'Act of completed works',
          'Invoice (ESF)',
        ],
        where: 'ИС ЭСФ для счетов-фактур',
        whereEn: 'ESF IS system for invoices',
        deadline: 'ЭСФ — в течение 15 дней',
        deadlineEn: 'ESF — within 15 days',
        specifics: 'Для международных перевозок — CMR. Специальные правила для транспортных компаний.',
        specificsEn: 'CMR for international transportation. Special rules for transport companies.',
      },
      {
        country: 'Россия 🇷🇺',
        countryEn: 'Russia 🇷🇺',
        flag: '🇷🇺',
        documents: [
          'Договор перевозки/экспедирования',
          'Товарно-транспортная накладная (ТТН)',
          'Путевой лист (для автотранспорта)',
          'Акт выполненных работ',
          'Счёт-фактура',
        ],
        documentsEn: [
          'Transportation/forwarding agreement',
          'Transport waybill (TTN)',
          'Waybill (for road transport)',
          'Act of completed works',
          'Invoice',
        ],
        where: 'ФНС через ЭДО',
        whereEn: 'FTS via EDI',
        deadline: 'ТТН — при отправке груза',
        deadlineEn: 'TTN — at cargo dispatch',
        specifics: 'Обязателен путевой лист для всех коммерческих перевозок. Контроль через систему "Платон" для грузовиков >12т.',
        specificsEn: 'Waybill mandatory for all commercial transportation. Control via "Platon" system for trucks >12t.',
      },
      {
        country: 'Грузия 🇬🇪',
        countryEn: 'Georgia 🇬🇪',
        flag: '🇬🇪',
        documents: [
          'Договор',
          'CMR / Waybill',
          'Invoice через RS.ge',
        ],
        documentsEn: [
          'Contract',
          'CMR / Waybill',
          'Invoice via RS.ge',
        ],
        where: 'RS.ge',
        whereEn: 'RS.ge',
        deadline: 'Invoice — в день оказания услуги',
        deadlineEn: 'Invoice — on service day',
        specifics: 'Упрощённая процедура для транзита. Грузия — транспортный хаб между Европой и Азией.',
        specificsEn: 'Simplified transit procedure. Georgia — transport hub between Europe and Asia.',
      },
      {
        country: 'Армения 🇦🇲',
        countryEn: 'Armenia 🇦🇲',
        flag: '🇦🇲',
        documents: [
          'Договор',
          'Транспортная накладн��я',
          'Акт',
          'Счёт-фактура',
        ],
        documentsEn: [
          'Contract',
          'Transport waybill',
          'Act',
          'Invoice',
        ],
        where: 'tax.am',
        whereEn: 'tax.am',
        deadline: 'Квартальная декларация',
        deadlineEn: 'Quarterly declaration',
        specifics: 'Для международных перевозок — CMR. Льготы для логистических центров.',
        specificsEn: 'CMR for international transportation. Benefits for logistics centers.',
      },
      {
        country: 'ЕС 🇪🇺',
        countryEn: 'EU 🇪🇺',
        flag: '🇪🇺',
        documents: [
          'Service Agreement',
          'CMR (Convention Merchandises Routières)',
          'Invoice',
          'Proof of Delivery (POD)',
        ],
        documentsEn: [
          'Service Agreement',
          'CMR (Convention Merchandises Routières)',
          'Invoice',
          'Proof of Delivery (POD)',
        ],
        where: 'VAT registration in service country, e-CMR system',
        whereEn: 'VAT registration in service country, e-CMR system',
        deadline: 'CMR — at shipment',
        deadlineEn: 'CMR — at shipment',
        specifics: 'E-CMR цифровая замена бумажному CMR. Reverse charge VAT для международных услуг.',
        specificsEn: 'E-CMR digital replacement for paper CMR. Reverse charge VAT for international services.',
      },
    ],
  },
];

export function DocumentRequirementsTable({ language: propLanguage }: { language?: 'en' | 'ru' }) {
  const { language: contextLanguage } = useLanguage();
  const language = propLanguage || contextLanguage;
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (index: number) => {
    setExpandedRows(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string; badge: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-600', badge: 'bg-blue-100 border-blue-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-600', badge: 'bg-purple-100 border-purple-200' },
      green: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-600', badge: 'bg-green-100 border-green-200' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-600', badge: 'bg-orange-100 border-orange-200' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: 'text-indigo-600', badge: 'bg-indigo-100 border-indigo-200' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-blue-50">
        <h3 className="text-black mb-2">
          {language === 'ru' ? '🌍 Справочник: Требования к документам по странам' : '🌍 Reference: Document Requirements by Country'}
        </h3>
        <p className="text-sm text-gray-600">
          {language === 'ru' 
            ? 'Детальное описание документооборота для каждого типа сделки в разных юрисдикциях'
            : 'Detailed description of document flow for each transaction type across jurisdictions'}
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {requirements.map((req, index) => {
          const Icon = req.icon;
          const colors = getColorClasses(req.color);
          const isExpanded = expandedRows.includes(index);
          
          return (
            <div key={index}>
              {/* Main Row */}
              <div
                onClick={() => toggleRow(index)}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${colors.icon}`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-base text-gray-900 mb-1">
                        {language === 'ru' ? req.businessType : req.businessTypeEn}
                      </div>
                      <div className="text-sm text-gray-600">
                        {language === 'ru' ? req.description : req.descriptionEn}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1.5 rounded-lg border ${colors.badge} text-xs`}>
                      {req.countryRequirements.length} {language === 'ru' ? 'стран' : 'countries'}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {req.countryRequirements.map((country, cIndex) => (
                      <div
                        key={cIndex}
                        className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                      >
                        {/* Country Header */}
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                          <span className="text-2xl">{country.flag}</span>
                          <div className="flex-1">
                            <div className="text-sm text-gray-900">
                              {language === 'ru' ? country.country : country.countryEn}
                            </div>
                          </div>
                        </div>

                        {/* Documents */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <div className="text-xs text-gray-600 uppercase tracking-wide">
                              {language === 'ru' ? 'Документы' : 'Documents'}
                            </div>
                          </div>
                          <ul className="space-y-1.5">
                            {(language === 'ru' ? country.documents : country.documentsEn).map((doc, dIndex) => (
                              <li key={dIndex} className="flex items-start gap-2 text-sm text-gray-700">
                                <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Where to Submit */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="w-4 h-4 text-purple-600" />
                            <div className="text-xs text-gray-600 uppercase tracking-wide">
                              {language === 'ru' ? 'Куда подавать' : 'Where to Submit'}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 bg-purple-50 rounded-lg p-2">
                            {language === 'ru' ? country.where : country.whereEn}
                          </p>
                        </div>

                        {/* Deadline */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <div className="text-xs text-gray-600 uppercase tracking-wide">
                              {language === 'ru' ? 'Сроки' : 'Deadline'}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 bg-orange-50 rounded-lg p-2">
                            {language === 'ru' ? country.deadline : country.deadlineEn}
                          </p>
                        </div>

                        {/* Specifics */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <div className="text-xs text-gray-600 uppercase tracking-wide">
                              {language === 'ru' ? 'Особенности' : 'Specifics'}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 bg-amber-50 rounded-lg p-2 leading-relaxed">
                            {language === 'ru' ? country.specifics : country.specificsEn}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Footer */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs">ℹ</span>
          </div>
          <div className="text-xs text-gray-700 space-y-2">
            <p>
              {language === 'ru' 
                ? '💡 FinOrbit автоматически определяет страну, тип сделки и проверяет наличие всех документов в цепочке.'
                : '💡 FinOrbit automatically determines country, transaction type and verifies all documents in the chain.'}
            </p>
            <p>
              {language === 'ru' 
                ? '⚠️ Информация актуальна на ноябрь 2025. Требования могут меняться — уточняйте в местных налоговых органах.'
                : '⚠️ Information is current as of November 2025. Requirements may change — verify with local tax authorities.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}