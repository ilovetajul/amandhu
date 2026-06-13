export default function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[--color-border]" />
      <span className="text-xs text-[--color-muted] font-mono uppercase tracking-[0.2em] px-1">{label}</span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[--color-border]" />
    </div>
  );
}
