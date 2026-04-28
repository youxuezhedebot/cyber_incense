type MuyuMarksProps = {
  count: number;
  overflow: number;
  resonanceLevel: number;
};

export function MuyuMarks({ count, overflow, resonanceLevel }: MuyuMarksProps) {
  const clusters = Math.min(5, Math.ceil(overflow / 24));

  return (
    <div className="absolute bottom-7 left-4 right-4 flex items-center justify-center gap-1">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className="h-1.5 w-1.5 rounded-full bg-mint-300/70"
          style={{
            boxShadow: `0 0 ${8 + resonanceLevel * 8}px rgba(145,229,207,${0.35 + resonanceLevel * 0.25})`
          }}
        />
      ))}
      {clusters > 0
        ? Array.from({ length: clusters }).map((_, index) => (
            <span
              key={`cluster-${index}`}
              className="ml-0.5 h-2 w-2 rounded-full border border-mint-300/40 bg-mint-300/15"
              style={{ opacity: 0.45 + resonanceLevel * 0.4 }}
            />
          ))
        : null}
      {overflow > 0 ? <span className="ml-1 text-[10px] font-semibold text-mint-300/70">+{overflow}</span> : null}
    </div>
  );
}
