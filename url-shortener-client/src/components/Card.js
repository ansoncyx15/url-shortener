import cn from "@/lib/cn";

export default function Card({ children, className, ...props }) {
  return (
    <section
      className={cn("rounded-lg border border-[#e6e2d4] bg-white p-4", className)}
      {...props}
    >
      {children}
    </section>
  );
}
