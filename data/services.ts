export interface Service {
  id: number
  name: string
  slug: string
  category: string
  shortDescription: string
  fullDescription: string
  features: string[]
  steps: string[]
  image: string
  gallery: string[]
  relatedServices: number[]
  faqs: Array<{ q: string; a: string }>
}

export const services: Service[] = [
  {
    id: 1,
    name: 'تركيب واجهات كلادينج ',
    slug: 'cladding-acp',
    category: 'cladding',
    shortDescription: 'تركيب احترافي للواجهات الكلادينج  بأعلى معايير الجودة',
    fullDescription: 'توفر واجهات الكلادينج ACP حلاً عملياً وفعالاً للمباني الحديثة. نحن متخصصون في التركيب المحترف والتصميم الجمالي.',
    features: ['متانة عالية', 'عازل حراري ممتاز', 'سهل الصيانة', 'تصاميم متنوعة'],
    steps: ['الفحص الأولي', 'التصميم والتخطيط', 'التركيب', 'الفحص النهائي'],
    image: '/تركيب2.png',
    gallery: [
      '/تركيب1.png',
      '/تركيب2.png',
    ],
    relatedServices: [2, 3],
    faqs: [
      {
        q: 'ما هي مدة تركيب الواجهة؟',
        a: 'تعتمد المدة على حجم المشروع، عادة من أسبوعين إلى شهر',
      },
    ],
  },
  {
    id: 2,
    name: 'واجهات كلادينج للمحلات',
    slug: 'cladding-shops',
    category: 'cladding',
    shortDescription: 'تصاميم حديثة لواجهات المحلات التجارية',
    fullDescription: 'نقدم حلولاً مبتكرة لواجهات المحلات التي تجذب العملاء وتعكس هويتك التجارية.',
    features: ['جذابة بصرياً', 'تحسن المبيعات', 'حماية من الأجواء', 'سهلة التنظيف'],
    steps: ['استشارة', 'اختيار التصميم', 'التركيب', 'الانتهاء'],
    image: '/واجهات كلادينج للمحلات1.png',
    gallery: [
      '/واجهات كلادينج للمحلات1.png',
      '/واجهات كلادينج للمحلات2.png',
    ],
    relatedServices: [1, 3],
    faqs: [
      {
        q: 'هل تؤثر الواجهة على العزل الحراري؟',
        a: 'نعم، تحسن كثيراً من العزل الحراري للمحل',
      },
    ],
  },
  {
    id: 3,
    name: 'واجهات كلادينج للمولات التجارية',
    slug: 'cladding-malls',
    category: 'cladding',
    shortDescription: 'واجهات فاخرة للمشاريع التجارية الكبرى',
    fullDescription: 'نحن متخصصون في تنفيذ مشاريع المولات والمراكز التجارية الضخمة.',
    features: ['مشاريع كبرى', 'جودة عالية', 'احترافية', 'ضمان'],
    steps: ['دراسة الموقع', 'التخطيط', 'التنفيذ', 'الجودة'],
    image: '/واجهات كلادينج للمولات التجارية.png',
    gallery: [
      '/واجهات كلادينج للمولات التجارية.png',
      '/واجهات كلادينج للمولات التجارية1.png',
    ],
    relatedServices: [1, 2],
    faqs: [
      {
        q: 'كم تكلفة المشروع؟',
        a: 'التكلفة تختلف حسب حجم المشروع والتصميم',
      },
    ],
  },
  {
    id: 4,
    name: 'واجهات كلادينج للمباني الإدارية',
    slug: 'cladding-admin',
    category: 'cladding',
    shortDescription: 'واجهات احترافية للمباني الإدارية والحكومية',
    fullDescription: 'تصاميم رسمية واحترافية تتناسب مع المباني الإدارية.',
    features: ['احترافية', 'رسمية', 'متينة', 'جمالية'],
    steps: ['البدء', 'المراحل', 'الانتهاء', 'الصيانة'],
    image: '/واجهات كلادينج للمباني الإدارية.png',
    gallery: [
      '/واجهات كلادينج للمباني الإدارية.png',
      '/واجهات كلادينج للمباني الإدارية1.png',
    ],
    relatedServices: [1],
    faqs: [],
  },
  {
    id: 5,
    name: 'واجهات كلادينج للفيلات',
    slug: 'cladding-villas',
    category: 'cladding',
    shortDescription: 'تصاميم فاخرة لواجهات الفيلات السكنية',
    fullDescription: 'نوفر حلولاً فاخرة وحديثة لتجميل فيلتك.',
    features: ['فاخرة', 'حديثة', 'آمنة', 'جميلة'],
    steps: ['التصميم', 'الموافقة', 'التنفيذ', 'الانتهاء'],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop',
      '/واجهات كلادينج للفيلات.png',
    ],
    relatedServices: [1, 6],
    faqs: [],
  },
  {
    id: 6,
    name: 'واجهات كلادينج للمستشفيات',
    slug: 'cladding-hospitals',
    category: 'cladding',
    shortDescription: 'واجهات متخصصة للمنشآت الصحية',
    fullDescription: 'تصاميم آمنة وصحية تتوافق مع معايير المستشفيات.',
    features: ['آمنة', 'معقمة', 'سهلة التنظيف', 'دائمة'],
    steps: [],
    image: '/واجهات كلادينج للمستشفيات.png',
    gallery: [
      '/واجهات كلادينج للمستشفيات.png',
      '/واجهات كلادينج للمستشفيات1.png',
    ],
    relatedServices: [1],
    faqs: [],
  },
 
]
