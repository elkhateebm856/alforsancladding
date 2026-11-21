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
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const reasons = [
  {
    title: 'تدريب إماراتي متخصص',
    description:
      'تلقى مؤسس الفرسان تدريبًا وتأهيلًا مهنيًا داخل إحدى الشركات الإماراتية المتخصصة في تنفيذ الواجهات الزجاجية والكلادينج.',
    icon: Award,
    iconColor: 'text-amber-700',
    iconBackground: 'bg-amber-100',
  },
  {
    title: 'خبرة عملية تزيد عن 20 عامًا',
    description:
      'خبرة واسعة في تصميم وتنفيذ وتركيب الواجهات الزجاجية والكلادينج للمشاريع السكنية والتجارية.',
    icon: CheckCircle,
    iconColor: 'text-primary',
    iconBackground: 'bg-primary/10',
  },
  {
    title: 'معايير تنفيذ عالمية',
    description:
      'نعتمد أحدث أساليب وتقنيات التنفيذ وفق أفضل الممارسات الهندسية لضمان الجودة والدقة.',
    icon: Shield,
    iconColor: 'text-primary',
    iconBackground: 'bg-primary/10',
  },
  {
    title: 'فريق هندسي محترف',
    description:
      'فريق من المهندسين والفنيين المدربين على تنفيذ المشاريع بأعلى مستويات الاحترافية.',
    icon: Users,
    iconColor: 'text-primary',
    iconBackground: 'bg-primary/10',
  },
  {
    title: 'الالتزام بالمواعيد',
    description:
      'نحرص على تسليم جميع المشاريع في الوقت المحدد مع الحفاظ على أعلى جودة في التنفيذ.',
    icon: Clock,
    iconColor: 'text-primary',
    iconBackground: 'bg-primary/10',
  },
  {
    title: 'أسعار تنافسية',
    description:
      'حلول متكاملة بأسعار مناسبة دون التأثير على جودة المواد أو التنفيذ.',
    icon: DollarSign,
    iconColor: 'text-primary',
    iconBackground: 'bg-primary/10',
  },
  {
    title: 'خدمة ما بعد التنفيذ',
    description:
      'متابعة مستمرة ودعم فني وصيانة لضمان رضا العملاء واستدامة جودة المشروع.',
    icon: Headphones,
    iconColor: 'text-primary',
    iconBackground: 'bg-primary/10',
  },
  {
    title: 'مشاريع متنوعة',
    description:
      'خبرة في تنفيذ مشاريع الفلل والعمائر والمجمعات التجارية والإدارية والمنشآت الحكومية.',
    icon: Building,
    iconColor: 'text-primary',
    iconBackground: 'bg-primary/10',
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
    <section className="section-soft py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="section-eyebrow">لماذا الفرسان</p>
          <h2 className="section-title mb-4">لماذا تختار الفرسان؟</h2>
          <p className="section-lead">
            نجمع بين الخبرة الهندسية الطويلة والتدريب الاحترافي وأحدث تقنيات
            التنفيذ لنقدم واجهات زجاجية وكلادينج بمعايير جودة عالية تناسب مختلف
            أنواع المشاريع.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4"
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
                className="surface-card rounded-2xl p-6 text-center transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_-24px_rgba(15,23,42,0.3)]"
              >
                <div
                  className={`mb-5 inline-flex size-14 items-center justify-center rounded-2xl ${reason.iconBackground}`}
                >
                  <Icon className={reason.iconColor} size={26} />
                </div>

                <h3 className="mb-3 text-lg font-bold text-slate-900">{reason.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{reason.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="mt-10 text-center">
          <Link href="/contact" className="btn-primary">
            اطلب استشارة لمشروعك
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}