'use client'

import {
  Award,
  CheckCircle,
  Users,
  Clock,
  DollarSign,
  Shield,
  Headphones,
  Building,
} from 'lucide-react'
import { motion } from 'framer-motion'

const reasons = [
  {
    title: 'تدريب إماراتي متخصص',
    description:
      'تلقى مؤسس الفرسان تدريبًا وتأهيلًا مهنيًا داخل إحدى الشركات الإماراتية المتخصصة في تنفيذ الواجهات الزجاجية والكلادينج.',
    icon: Award,
  },
  {
    title: 'خبرة عملية تزيد عن 15 عامًا',
    description:
      'خبرة واسعة في تصميم وتنفيذ وتركيب الواجهات الزجاجية والكلادينج للمشاريع السكنية والتجارية.',
    icon: CheckCircle,
  },
  {
    title: 'معايير تنفيذ عالمية',
    description:
      'نعتمد أحدث أساليب وتقنيات التنفيذ وفق أفضل الممارسات الهندسية لضمان الجودة والدقة.',
    icon: Shield,
  },
  {
    title: 'فريق هندسي محترف',
    description:
      'فريق من المهندسين والفنيين المدربين على تنفيذ المشاريع بأعلى مستويات الاحترافية.',
    icon: Users,
  },
  {
    title: 'الالتزام بالمواعيد',
    description:
      'نحرص على تسليم جميع المشاريع في الوقت المحدد مع الحفاظ على أعلى جودة في التنفيذ.',
    icon: Clock,
  },
  {
    title: 'أسعار تنافسية',
    description:
      'حلول متكاملة بأسعار مناسبة دون التأثير على جودة المواد أو التنفيذ.',
    icon: DollarSign,
  },
  {
    title: 'خدمة ما بعد التنفيذ',
    description:
      'متابعة مستمرة ودعم فني وصيانة لضمان رضا العملاء واستدامة جودة المشروع.',
    icon: Headphones,
  },
  {
    title: 'مشاريع متنوعة',
    description:
      'خبرة في تنفيذ مشاريع الفلل والعمائر والمجمعات التجارية والإدارية والمنشآت الحكومية.',
    icon: Building,
  },
]

export function WhyChooseUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            لماذا تختار الفرسان؟
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            نجمع بين الخبرة الهندسية الطويلة والتدريب الاحترافي وأحدث تقنيات
            التنفيذ لنقدم واجهات زجاجية وكلادينج بمعايير جودة عالية تناسب مختلف
            أنواع المشاريع.
          </p>
        </div>

        {/* Reasons Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {reasons.map((reason, index) => {
            const Icon = reason.icon

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="mb-5 inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                  <Icon className="text-primary" size={30} />
                </div>

                <h3 className="text-lg font-bold text-foreground mb-3">
                  {reason.title}
                </h3>

                <p className="text-sm leading-7 text-muted-foreground">
                  {reason.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}