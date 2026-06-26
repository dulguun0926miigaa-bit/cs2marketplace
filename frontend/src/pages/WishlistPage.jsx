import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { wishlistService } from '../services/marketplace.service';
import useCartStore from '../store/cartStore';
import SkinCard from '../components/skin/SkinCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await wishlistService.getWishlist();
      setItems(data.data.items);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingSpinner size="lg" className="py-40" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">❤️</p>
          <p className="text-xl text-gray-400 mb-6">Your wishlist is empty</p>
          <Link to="/marketplace" className="btn-primary">Browse Skins</Link>
        </div>
      ) : (
        <>
          <p className="text-gray-400 mb-4">{items.length} items in wishlist</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map((item) => (
              <SkinCard key={item.id} skin={item.skin} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
