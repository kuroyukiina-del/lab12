export interface ExternalItem {
 id: string;
 title: string;
 subtitle?: string;
 image?: string;
}
export async function fetchExternal(
 source: 'products' | 'news'
): Promise<ExternalItem[]> {
  if (source === 'products') {
    try {
      const res = await fetch('https://fakestoreapi.com/products?limit=8', {
        cache: 'no-store',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
      });
      if (res.ok) {
        const items = await res.json();
        if (Array.isArray(items)) {
          return items.map((p: any) => ({
            id: String(p.id),
            title: p.title,
            subtitle: `$${p.price} • ${p.category}`,
            image: p.image,
          }));
        }
      }
    } catch (e) {
      console.error('FakeStoreAPI failed:', e);
    }

    // Fallback Mock Products กรณี FakeStoreAPI ล่มหรือถูก Cloudflare บล็อก
    return [
      {
        id: '1',
        title: 'Fjallraven - Foldsack No. 1 Backpack',
        subtitle: '$109.95 • men\'s clothing',
        image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      },
      {
        id: '2',
        title: 'Mens Casual Premium Slim Fit T-Shirts',
        subtitle: '$22.3 • men\'s clothing',
        image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
      },
      {
        id: '3',
        title: 'Mens Cotton Jacket',
        subtitle: '$55.99 • men\'s clothing',
        image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
      },
      {
        id: '4',
        title: 'Mens Casual Slim Fit',
        subtitle: '$15.99 • men\'s clothing',
        image: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
      },
    ];
  }
 // source === 'news' — ดึงจาก Hacker News (Algolia)
 const data = await fetch(
 'https://hn.algolia.com/api/v1/search?tags=story&hitsPerPage=8'
 ).then((r) => r.json());
 return (data.hits || []).map((h: any) => ({
 id: String(h.objectID), title: h.title,
 subtitle: `${h.points ?? 0} points • by ${h.author}`,
 }));
}