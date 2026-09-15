import Image from 'next/image'
import Link from 'next/link'

interface HeroProps {
  title: string
  subtitle?: string
  backgroundImage: string
  cta?: {
    label: string
    href: string
  }
}

export function Hero({
  title,
  subtitle,
  backgroundImage,
  cta,
}: HeroProps) {
  return (
    <section className="relative h-96 w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
          {title}
        </h1>

        {subtitle && (
          <p className="text-lg md:text-xl text-gray-100 mb-6 max-w-2xl">
            {subtitle}
          </p>
        )}

        {cta && (
          <Link
            href={cta.href}
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            {cta.label}
          </Link>
        )}
      </div>
    </section>
  )
}