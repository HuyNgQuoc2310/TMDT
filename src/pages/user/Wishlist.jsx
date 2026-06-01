import { useEffect, useMemo, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { useAuth } from "../../context/AuthContext";
import { wishlists as seedWishlists } from "../../data/catalog";
import { useCatalog } from "../../hooks/useCatalog";
import wishlistService from "../../services/wishlistService";

function Wishlist() {
  const { user } = useAuth();
  const { products, categoryById } = useCatalog();
  const targetUserId = user?.id || 2;
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadWishlists() {
      try {
        const data = await wishlistService.getWishlists(targetUserId);
        if (mounted) {
          setWishlists(data);
        }
      } catch {
        if (mounted) {
          setWishlists(seedWishlists.filter((item) => item.userId === targetUserId));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadWishlists();
    return () => {
      mounted = false;
    };
  }, [targetUserId]);

  const favoriteProducts = useMemo(() => {
    const favoriteIds = wishlists.map((item) => item.productId);
    return products.filter((product) => favoriteIds.includes(product.id));
  }, [products, wishlists]);

  const handleRemove = async (productId) => {
    const record = wishlists.find((item) => item.productId === productId);
    if (!record) {
      return;
    }

    try {
      await wishlistService.removeWishlist(record.id);
    } catch {
      // Keep local removal so the UI still responds when persistence fails.
    }
    setWishlists((current) => current.filter((item) => item.id !== record.id));
  };

  return (
    <section className="content-page">
      <div className="section-heading">
        <span className="eyebrow">Yêu thích</span>
        <h1>Sản phẩm đã lưu</h1>
      </div>

      {favoriteProducts.length > 0 ? (
        <div className="product-grid">
          {favoriteProducts.map((product) => (
            <div className="saved-product" key={product.id}>
              <ProductCard product={product} category={categoryById.get(product.categoryId)} />
              <button className="ghost-button" type="button" onClick={() => handleRemove(product.id)}>
                Bỏ yêu thích
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <strong>{loading ? "Đang tải danh sách..." : "Chưa có sản phẩm yêu thích"}</strong>
          {!loading && <p>Hãy lưu sản phẩm bạn quan tâm để xem lại nhanh hơn.</p>}
        </div>
      )}
    </section>
  );
}

export default Wishlist;
