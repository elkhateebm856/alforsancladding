export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  date: string
  image: string
  category: string
  readingTime: number
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'أحدث اتجاهات الواجهات الزجاجية في 2026',
    slug: 'latest-glass-trends-2026',
    excerpt: 'تعرف على أحدث التقنيات والاتجاهات في عالم الواجهات الزجاجية الحديثة.',
    content: `الواجهات الزجاجية شهدت تطوراً كبيراً في السنوات الأخيرة. 
    
في 2026، نرى اتجاهات جديدة تركز على الاستدامة والكفاءة الطاقية. الزجاج الذكي الذي يتحكم بدرجة الإضاءة والحرارة أصبح متاحاً تجارياً.

كما أن التصاميم البسيطة والنظيفة تتصدر السوق، مع التركيز على الخطوط الأفقية والعمودية الجريئة.`,
    author: 'محمد الفرسان',
    date: '2026-07-20',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e3e4e0bc?w=800',
    category: 'trends',
    readingTime: 5,
  },
  
  
  
]
