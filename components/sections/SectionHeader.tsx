type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  /** Optional centered layout used on the home page. */
  centered?: boolean;
  style?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  subtitleStyle?: React.CSSProperties;
};

export default function SectionHeader({
  title,
  subtitle,
  centered = false,
  style,
  titleStyle,
  subtitleStyle,
}: SectionHeaderProps) {
  return (
    <div
      className="section-header"
      style={
        centered
          ? { textAlign: "center", marginBottom: "4rem", ...style }
          : style
      }
    >
      <h2 className="section-title" style={titleStyle}>
        {title}
      </h2>
      {subtitle ? (
        <p className="section-subtitle" style={subtitleStyle}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
