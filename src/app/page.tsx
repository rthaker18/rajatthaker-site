export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center text-black">
      <h1 className="text-3xl font-semibold tracking-tight">
        Welcome to Rajat Thaker&apos;s website!
      </h1>
      <a
        href="https://linkedin.com/in/rthaker2"
        className="text-lg font-medium text-blue-700 underline underline-offset-4 hover:text-blue-900"
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>
    </main>
  );
}
