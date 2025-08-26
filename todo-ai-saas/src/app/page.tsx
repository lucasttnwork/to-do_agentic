import { MainDashboard } from '@/components/dashboard/MainDashboard';

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#111827', 
          marginBottom: '2rem' 
        }}>
          🚀 Todo AI SaaS - Interface Personalizada
        </h1>
        
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
          padding: '1.5rem' 
        }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: '#374151', 
            marginBottom: '1rem' 
          }}>
            ✅ Interface Funcionando!
          </h2>
          
          <p style={{ 
            color: '#6b7280', 
            fontSize: '0.875rem' 
          }}>
            <strong>Versões dos Frameworks (Estáveis):</strong><br/>
            • Next.js: 14.0.0<br/>
            • React: 18.3.1<br/>
            • Tailwind CSS: 3.3.0
          </p>
        </div>
      </div>
    </div>
  );
}
