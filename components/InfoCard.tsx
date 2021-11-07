export default function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="border rounded-xl shadow-sm p-4 space-y-1">{children}</div>
  );
}
