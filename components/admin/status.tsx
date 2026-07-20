/** Shared loading / error states for admin pages. */

export function PageLoading() {
  return (
    <div className="admin-center" style={{ minHeight: "40vh" }}>
      <div className="admin-spinner" aria-label="Loading" />
    </div>
  );
}

export function PageError({ message }: { message: string }) {
  return (
    <div className="admin-alert" role="alert">
      {message}
    </div>
  );
}
