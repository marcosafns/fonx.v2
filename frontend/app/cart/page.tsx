'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type CartItem = {
  id: number;
  product_name: string;
  size?: string;
  price: string;
  quantity?: number;
  product_img?: string;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:3000/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setCart(data));
  }, []);

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:3000/checkout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.redirected) {
      router.push(res.url); // redireciona pro checkout da Yampi
    } else {
      const data = await res.json();
      alert(data.message || 'Erro no checkout');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6">Seu Carrinho</h1>
      {cart.length === 0 ? (
        <p>Carrinho vazio 😢</p>
      ) : (
        <>
          {cart.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b py-4"
            >
              <div>
                <p className="font-semibold">{item.product_name}</p>
                <p className="text-sm text-gray-500">Tamanho: {item.size}</p>
              </div>
              <div>
                <p className="text-right">R$ {item.price}</p>
                <p className="text-xs">Qtd: {item.quantity || 1}</p>
              </div>
            </div>
          ))}
          <button
            onClick={handleCheckout}
            className="bg-black text-white px-6 py-2 mt-6 rounded hover:bg-zinc-800 transition-all"
          >
            Finalizar Compra
          </button>
        </>
      )}
    </div>
  );
}
