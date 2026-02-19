export function ErrorBanner({ error }: { error: string }) {
  if (!error) return null;

  return (
    <div className="appError" role="alert">
      <b>Error:</b> {error}
    </div>
  );
}

