// Root admin layout — no auth check here.
// Auth protection is handled by src/app/admin/(protected)/layout.tsx
// and the proxy.ts middleware for route-level enforcement.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
