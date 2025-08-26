export class AIAssetsService {
  private static readonly UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_KEY'; // Configure via env
  
  static async getProductivityBackground(): Promise<string> {
    try {
      const keywords = ['productivity', 'workspace', 'modern-office', 'technology'];
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
      
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${randomKeyword}&orientation=landscape&w=1920&h=1080`,
        {
          headers: {
            'Authorization': `Client-ID ${this.UNSPLASH_ACCESS_KEY}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch background');
      }
      
      const data = await response.json();
      return data.urls.full;
    } catch (error) {
      console.error('Error fetching AI background:', error);
      // Fallback to gradient
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPGI+Z3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjdfMiIgeDE9IjAiIHkxPSIwIiB4Mj0iMTkyMCIgeTI9IjEwODAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzY2N2VlYSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3NjRiYTIiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMjdfMikiLz4KPC9zdmc+Cg==';
    }
  }
  
  static async preloadImages(urls: string[]): Promise<void> {
    const promises = urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
    });
    
    try {
      await Promise.all(promises);
    } catch (error) {
      console.warn('Some images failed to preload:', error);
    }
  }
  
  static createBlurDataURL(width: number = 40, height: number = 30): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    canvas.width = width;
    canvas.height = height;
    
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    return canvas.toDataURL();
  }
}
