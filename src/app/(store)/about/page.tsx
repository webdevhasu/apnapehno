export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-heading text-4xl font-bold text-center mb-8">About Apna Pehnoo</h1>
      <div className="bg-white rounded-2xl p-8 border border-border space-y-6 text-text-light leading-relaxed">
        <p>Welcome to <strong className="text-accent">Apna Pehnoo</strong> — your trusted destination for premium women&apos;s clothing in Pakistan. We believe every woman deserves to feel elegant, confident, and beautiful.</p>
        <p>From luxurious lawn collections to intricately embroidered suits, we curate pieces that blend traditional craftsmanship with modern design. Our collections feature the finest fabrics, vibrant prints, and impeccable stitching.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          {[
            { num: "500+", label: "Happy Customers" },
            { num: "200+", label: "Products" },
            { num: "100%", label: "Quality Guaranteed" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="font-heading text-3xl font-bold text-primary">{s.num}</p>
              <p className="text-sm">{s.label}</p>
            </div>
          ))}
        </div>
        <p>Our mission is simple: bring you the best of Pakistani fashion at unbeatable prices, with the convenience of shopping from home. We offer cash on delivery, easy returns, and free shipping across Pakistan.</p>
        <p className="font-heading text-xl text-accent font-bold text-center">Elegance in Every Stitch ✨</p>
      </div>
    </div>
  );
}
