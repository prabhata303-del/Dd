
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import HomeHeader from '../components/home/HomeHeader';
import Slider from '../components/home/Slider';
import CategoryList from '../components/home/CategoryList';
import DishGrid from '../components/home/DishGrid';
import { useAuth } from '../context/AuthContext';
import { Category, Dish, SliderImage } from '../types';
import { fetchBanners, fetchCategories, fetchDishes } from '../services/firebaseService';
import { PLACEHOLDER_DISHES, PLACEHOLDER_CATEGORIES, PLACEHOLDER_SLIDER_IMAGES } from '../constants';
import { PageId } from '../App';
import Spinner from '../components/ui/Spinner';

interface HomePageProps {
  showPage: (pageId: PageId, dishKey?: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ showPage }) => {
  const { userPincode, isLoading: isAuthLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allDishes, setAllDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [banners, setBanners] = useState<SliderImage[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loadingData, setLoadingData] = useState(true);
  const [dishesSectionTitle, setDishesSectionTitle] = useState<string>('Recommended Dishes');

  const processAndSetDishes = useCallback((fetchedDishes: Dish[]) => {
    const processedDishes = fetchedDishes.map(d => {
      // Ensure price structure is consistent
      const priceObj = d.price && typeof d.price === 'object'
        ? d.price
        : { final: parseFloat(d.price as any || 0), restaurantPrice: parseFloat(d.price as any || 0), adminFee: 0 };

      const finalPriceBeforeDiscount = parseFloat(priceObj.final || 0);
      return {
        ...d,
        price: priceObj,
        customerPrice: finalPriceBeforeDiscount * (1 - (d.discount || 0) / 100),
      };
    });
    setAllDishes(processedDishes);
    setFilteredDishes(processedDishes);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        const [fetchedCategories, fetchedDishes, fetchedBanners] = await Promise.all([
          fetchCategories(),
          fetchDishes(userPincode),
          fetchBanners(),
        ]);
        setCategories(fetchedCategories);
        processAndSetDishes(fetchedDishes);
        setBanners(fetchedBanners);
      } catch (error) {
        console.error("Error loading home page data:", error);
        setCategories(PLACEHOLDER_CATEGORIES);
        processAndSetDishes(PLACEHOLDER_DISHES);
        setBanners(PLACEHOLDER_SLIDER_IMAGES);
      } finally {
        setLoadingData(false);
      }
    };

    if (!isAuthLoading) {
      loadData();
    }
  }, [userPincode, isAuthLoading, processAndSetDishes]);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setActiveCategory('ALL'); // Reset category filter on search
    if (term) {
      setDishesSectionTitle(`Search Results for "${term}"`);
    } else {
      setDishesSectionTitle('Recommended Dishes');
    }
  }, []);

  const handleSelectCategory = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    setSearchTerm(''); // Clear search term on category filter
    const filtered = allDishes.filter(dish => dish.categoryId === categoryId);
    setFilteredDishes(filtered);
    setDishesSectionTitle('Dishes in Category');
    // Scroll to dishes section after filtering
    document.getElementById('dishesSectionTitle')?.scrollIntoView({ behavior: 'smooth' });
  }, [allDishes]);

  const handleShowAllDishes = useCallback(() => {
    setActiveCategory('ALL');
    setSearchTerm(''); // Clear search term
    setFilteredDishes(allDishes);
    setDishesSectionTitle('Recommended Dishes');
  }, [allDishes]);

  const dishesToDisplay = useMemo(() => {
    if (searchTerm) {
      return allDishes.filter(dish =>
        dish.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filteredDishes;
  }, [allDishes, filteredDishes, searchTerm]);

  if (isAuthLoading || loadingData) {
    return (
      <div className="absolute inset-0 flex justify-center items-center bg-secondary z-50">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-secondary flex flex-col z-10">
      <HomeHeader onSearchChange={handleSearchChange} />
      <main className="flex-1 overflow-y-auto px-5 pb-24"> {/* Added pb-24 for navbar/fab clearance */}
        <h2 className="text-xl font-bold mt-6 mb-4 text-gray-900">Promotions & Offers</h2>
        <Slider images={banners} />

        <h2 className="text-xl font-bold mt-5 mb-4 text-gray-900">Browse Categories</h2>
        <CategoryList
          categories={categories}
          onSelectCategory={handleSelectCategory}
          onShowAllDishes={handleShowAllDishes}
          activeCategory={activeCategory}
        />

        <h2 className="text-xl font-bold mt-5 mb-4 text-gray-900" id="dishesSectionTitle">{dishesSectionTitle}</h2>
        {searchTerm || activeCategory !== 'ALL' ? (
          <button
            onClick={handleShowAllDishes}
            className="text-primary text-sm font-semibold mb-4 block"
          >
            Show All Products
          </button>
        ) : null}
        <DishGrid dishes={dishesToDisplay} showProductDetail={(dishKey) => showPage('productDetailPage', dishKey)} />
      </main>
    </div>
  );
};

export default HomePage;
