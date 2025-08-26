import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Verificar se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Rotas que precisam de autenticação
  const protectedRoutes = ['/api/tasks', '/api/ai', '/api/audio', '/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // Se é uma rota protegida e não há sessão, redirecionar para login
  if (isProtectedRoute && !session) {
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Em vez de redirecionar para /, vamos permitir acesso ao dashboard
    // e deixar que o componente lide com a autenticação
    return res;
  }

  return res;
}

export const config = {
  matcher: [
    '/api/tasks/:path*',
    '/api/ai/:path*', 
    '/api/audio/:path*',
    '/dashboard/:path*'
  ],
};
