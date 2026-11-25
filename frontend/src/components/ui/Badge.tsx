interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const styles = {
    default: "bg-zinc-800 text-zinc-300 border-zinc-700",
    success: "bg-emerald-950 text-emerald-400 border-emerald-800",
    warning: "bg-amber-950 text-amber-400 border-amber-800",
    danger: "bg-red-950 text-red-400 border-red-800",
    info: "bg-blue-950 text-blue-400 border-blue-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${styles[variant]}`}
    >
      {children}
    </span>
  );
}