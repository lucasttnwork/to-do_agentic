export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">TaskFlow AI</h1>
        <p className="text-slate-400 mb-8">Intelligent Task Management</p>
        <a
          href="/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
        >
          Acessar Dashboard
        </a>
      </div>
    </div>
  );
}
