export default function TestPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-blue-400">Teste Tailwind CSS</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teste Glassmorphism */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Glassmorphism Test</h2>
            <p className="text-slate-300">Este card deve ter efeito glassmorphism.</p>
          </div>

          {/* Teste Gradientes */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Gradient Test</h2>
            <p className="text-white">Este card deve ter gradiente azul para roxo.</p>
          </div>

          {/* Teste Partículas */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Background Test</h2>
            <p className="text-slate-300">Este card deve ter fundo escuro.</p>
          </div>

          {/* Teste Animações */}
          <div className="bg-slate-800 border border-slate-600 rounded-2xl p-6 animate-pulse">
            <h2 className="text-2xl font-semibold mb-4">Animation Test</h2>
            <p className="text-slate-300">Este card deve estar pulsando.</p>
          </div>
        </div>

        <div className="mt-8">
          <a 
            href="/dashboard" 
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            Ir para Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
