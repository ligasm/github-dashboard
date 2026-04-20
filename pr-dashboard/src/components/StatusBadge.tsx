interface StatusBadgeProps {
  label: string;
  color: string;
}

function getTextColor(hex: string): string {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function StatusBadge({ label, color }: StatusBadgeProps) {
  const bg = `#${color}`;
  const fg = getTextColor(color);
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: bg, color: fg }}
    >
      {label}
    </span>
  );
}

export function DraftBadge() {
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
      Draft
    </span>
  );
}
