export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="pt-36 pb-16">
      <div className="container-lumi max-w-3xl">
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="font-display text-5xl md:text-6xl tracking-tight text-text leading-[1.05]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg md:text-xl text-text-dim leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
