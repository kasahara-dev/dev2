interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
}

// 商品データを取得するための非同期関数
async function getProducts(): Promise<Product[]> {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`;
  console.log(`Fetching data from: ${url}`); // デバッグ用にURLをログ出力

  const res = await fetch(url, {
    // SSRではキャッシュが強力に効くため、開発中はキャッシュを無効にする
    cache: "no-store",
  });

  if (!res.ok) {
    // エラーハンドリング
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

// 商品カードコンポーネント
function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-lg p-6 shadow-md bg-white">
      <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <p className="text-xl font-bold text-right text-gray-800">
        &yen;{product.price.toLocaleString()}
      </p>
    </div>
  );
}

// 商品一覧ページのコンポーネント (Server Component)
export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
        商品一覧
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
