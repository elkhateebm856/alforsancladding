'use client'

import { useState } from 'react'
import type { Service } from '@/data/services'

interface ContactFormProps {
  services: Service[]
}

export function ContactForm({ services }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // إنشاء رسالة WhatsApp
    const message = `
اسم: ${formData.name}
بريد إلكتروني: ${formData.email}
هاتف: ${formData.phone}
الخدمة: ${formData.service}
الرسالة: ${formData.message}
    `.trim()

    // ترميز الرسالة للـ URL
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/201000000000?text=${encodedMessage}`
    
    // فتح WhatsApp في نافذة جديدة
    window.open(whatsappUrl, '_blank')
    
    // مسح النموذج
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: '',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            الاسم كاملاً
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="أدخل اسمك الكامل"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            البريد الإلكتروني
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="your@example.com"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-semibold text-foreground mb-2"
        >
          رقم الهاتف (مصري)
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          pattern="^(\+20|0)?[0-9]{10}$"
          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="01000000000 أو +201000000000"
        />
        <p className="text-xs text-muted-foreground mt-1">
          أدخل رقماً مصرياً صحيحاً (01xxxxxxxxx)
        </p>
      </div>

      <div>
        <label
          htmlFor="service"
          className="block text-sm font-semibold text-foreground mb-2"
        >
          الخدمة المطلوبة
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">-- اختر الخدمة --</option>
          {services.map((service) => (
            <option key={service.id} value={service.name}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-semibold text-foreground mb-2"
        >
          الرسالة
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="اكتب تفاصيل استفسارك..."
        />
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
      >
        إرسال الرسالة
      </button>
    </form>
  )
}
