type PageHeroProps = {
  badge?: string;
  title: React.ReactNode;
  description: string;
  /** Extra classes on the section (e.g. page-hero). */
  className?: string;
  style?: React.CSSProperties;
  centered?: boolean;
  children?: React.ReactNode;
};

/** Reusable page top hero — keeps existing CSS class names. */
export default function PageHero({
  badge,
  title,
  description,
  className = "page-hero section",
  style,
  centered = false,
  children,
}: PageHeroProps) {
  const sectionStyle: React.CSSProperties | undefined =
    style === undefined && !centered
      ? { paddingTop: "8rem", paddingBottom: "3rem" }
      : style;

  return (
    <section className={className} style={sectionStyle}>
      <div className="container" style={centered ? { textAlign: "center" } : undefined}>
        {badge ? <div className="page-hero-badge">{badge}</div> : null}
        <h1 className="page-hero-title">{title}</h1>
        <p
          className="page-hero-desc"
          style={
            centered
              ? { marginInline: "auto", marginBottom: "2rem" }
              : undefined
          }
        >
          {description}
        </p>
        {children}
      </div>
    </section>
  );
}
