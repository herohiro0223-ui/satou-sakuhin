interface EmptyStateProps {
  emoji: string;
  title: string;
  subtitle?: string;
}

export default function EmptyState({ emoji, title, subtitle }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="text-6xl" role="img">
        {emoji}
      </span>
      <h2 className="text-lg font-bold text-cocoa">{title}</h2>
      {subtitle && <p className="text-sm text-cocoa-light">{subtitle}</p>}
    </div>
  );
}
