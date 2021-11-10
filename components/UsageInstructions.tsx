export default function UsageInstructions({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <details className="bg-white prose">
      <summary className="font-bold text-lg">Usage Instructions</summary>
      {children}
    </details>
  );
}
