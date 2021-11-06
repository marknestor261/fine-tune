export default function ErrorMessage({
  error,
}: {
  error: Error | string;
}): JSX.Element {
  return (
    <div className="max-w-2xl mx-auto my-4 bg-red-100 border border-red-600 text-red-600 px-4 py-3 rounded relative">
      <strong className="font-bold">Oops!</strong>
      <span className="block sm:inline"> {String(error)}</span>
    </div>
  );
}
