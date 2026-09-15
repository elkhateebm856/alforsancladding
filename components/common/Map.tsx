export function Map() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
          موقعنا في المنصورة
        </h2>
        <div className="bg-muted rounded-lg overflow-hidden h-96 md:h-[500px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3416.0765707050103!2d31.372!3d31.034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z31LCsDM0JzEyLjIiTiAzMcKwMjInMjAuNCJF!5e0!3m2!1sar!2seg!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>
        <p className="text-center text-muted-foreground mt-6">
          المنصورة - محافظة الدقهلية - جمهورية مصر العربية
        </p>
      </div>
    </section>
  )
}
