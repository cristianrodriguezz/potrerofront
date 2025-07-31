


export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full max-w-3xl px-4 py-8">
        {children}
      </div>
      {/* You can add a footer or other components here if needed */}
      <footer className="w-full text-center py-4">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Potrero. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
