export interface Testimonial {
  id: number
  name: string
  position: string
  company: string
  text: string
  rating: number
  image?: string
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'أحمد محمد',
    position: 'مدير المشروع',
    company: 'شركة البناء الذهبية',
    text: 'تعاملت مع الفرسان في مشروع كبير والنتيجة فاقت التوقعات. احترافية عالية وجودة ممتازة.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  },
  {
    id: 2,
    name: 'فاطمة علي',
    position: 'المديرة التنفيذية',
    company: 'مجموعة العقارات الحديثة',
    text: 'فريق محترف وملتزم بالجودة. يتعاملون مع التحديات بكفاءة واحترافية عالية.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  },
  {
    id: 3,
    name: 'محمود حسن',
    position: 'مهندس المشروع',
    company: 'شركة الإنشاءات المتقدمة',
    text: 'أفضل خدمة للواجهات الزجاجية والكلادينج. استجابة سريعة وحل مشاكل فعال.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  },
  {
    id: 4,
    name: 'سارة إبراهيم',
    position: 'مالكة المشروع',
    company: 'مول الفرسان التجاري',
    text: 'التركيب كان احترافياً والالتزام بالمواعيد كان ممتازاً. شكراً للفرسان!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  },
]
