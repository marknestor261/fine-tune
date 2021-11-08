export default function UsageInstructions({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <details className="mt-12 bg-white group prose">
      <summary className="font-bold text-lg">Usage Instructions</summary>
      <div>{children}</div>
    </details>
  );
}
