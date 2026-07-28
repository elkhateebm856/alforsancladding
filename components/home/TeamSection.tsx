'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const team = [
  {
    name: 'م. محروس الصياد',
    role: 'مؤسس الشركة',
    image:
      '/محروس الصياد.png',
    bio: 'خبرة أكثر من 15 عامًا في تنفيذ الواجهات الزجاجية والكلادينج وإدارة المشاريع.',
  },
  {
    name: 'م. السيد نفعي',
    role: 'مهندس رئيسي',
    image:
      '/السيد نفعي.png',
    bio: 'متخصص في تصميم وتنفيذ الواجهات الزجاجية والكلادينج بأعلى معايير الجودة.',
  },
]

export function TeamSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            فريقنا المحترف
          </h2>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            فريق هندسي متخصص يمتلك الخبرة والكفاءة لتنفيذ جميع مشاريع الواجهات الزجاجية والكلادينج بأعلى مستويات الجودة.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              viewport={{ once: true }}
              className="group text-center"
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={500}
                  height={500}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                  <p className="text-white text-sm leading-7">
                    {member.bio}
                  </p>
                </div>
              </div>

              <h3 className="mt-6 text-2xl font-bold text-foreground">
                {member.name}
              </h3>

              <p className="text-primary font-semibold mt-2">
                {member.role}
              </p>

              <div className="w-16 h-1 bg-primary mx-auto rounded-full mt-4"></div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}