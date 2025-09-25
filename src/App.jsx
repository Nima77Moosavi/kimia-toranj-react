import {useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastProvider } from "./components/Toast/ToastContext.jsx";
import { useCartStore } from "./cartStore.js";

// Import your layout, ProtectedRoute, and pages
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import UserPanel from "./pages/UserPanel/UserPanel.jsx";
import AccountInfo from "./pages/AccountInfo/AccountInfo";
import ShoppingCart from "./pages/ShoppingCart/ShoppingCart";
import UserOrders from "./pages/UserOrders/UserOrders";
import Wishlist from "./pages/WishList/WishList";
import UserReviews from "./pages/UserReviews/UserReviews";
import UserAddresses from "./pages/UserAddresses/UserAddresses";

// Public pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login/Login";
import Blog from "./pages/Blog/Blog";
import BlogDetail from "./pages/BlogDetail/BlogDetail.jsx";
import HighlightMedia from "./components/HighlightMedia/HighlightMedia";
import CollectionDetail from "./pages/CollectionDetail/CollectionDetail";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import BestsellersPage from "./pages/BestsellersPage/BestsellersPage";
import ContactButton from "./components/ContactButton/ContactButton.jsx";
import FooterMenu from "./components/FooterMenu/FooterMenu.jsx";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage.jsx";
import Shop from "./pages/Shop/Shop.jsx";
import GiftSelector from "./pages/GiftSelector/GiftSelector.jsx";
import ScrollToTop from "./utils/ScrollToTop.jsx";
import BrassSamovar from "./pages/BrassSamovar/BrassSamovar.jsx";
import MirrorCandleHolder from "./pages/MirrorCandleholder/MirrorCandleholder.jsx";
import Khatamkari from "./pages/Khatamkari/Khatamkari.jsx";
import BrassProducts from "./pages/BrassProducts/BrassProducts.jsx";
import OrganizationalGiftPack from "./pages/OrganizationalGiftPack/OrganizationalGiftPack.jsx";
import InstallmentPayment from "./pages/InstallmentPayment/InstallmentPayment.jsx";
import SilverPlated from "./pages/SilverPlated/SilverPlated.jsx";
import GoldenBrass from "./pages/GoldenBrass/GoldenBrass.jsx";
import Qalamzani from "./pages/Qalamzani/Qalamzani.jsx";
import FAQPage from "./pages/FAQPage/FAQPage.jsx";
import PaymentSuccess from "./pages/PaymentSuccess/PaymentSuccess.jsx";
import PaymentFailure from "./pages/PaymentFailure/PaymentFailure.jsx";
import FrameArt from "./pages/FrameArt/FrameArt.jsx";
import Post1 from "./pages/BlogPosts/Post1/Post1.jsx";
import Post2 from "./pages/BlogPosts/Post2/Post2.jsx";
import Post3 from "./pages/BlogPosts/Post3/Post3.jsx";

const App = () => {
  const loadCart = useCartStore((state) => state.loadCart);

  useEffect(() => {
    loadCart();
  }, [loadCart]);
  return (
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/installment-payment" element={<InstallmentPayment />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/highlight/:id" element={<HighlightMedia />} />
          <Route path="/collection/:id" element={<CollectionDetail />} />
          <Route path="/product/:slugAndId" element={<ProductDetails />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/gift-selector" element={<GiftSelector />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />

          {/* Blog Page and Posts */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/post/Enlivening-your-home-with-iranian-arts-and-crafts" element={<Post1 />} />
          <Route path="/post/Isfahan-Handicrafts-A-lasting-legacy-from-the-heart-of-Iranian-history" element={<Post2 />} />
          <Route path="/post/The-art-of-calligraphy-and-inlay-work-masterpieces-of-Isfahan-handicrafts" element={<Post3 />} />


          {/* Category Landing Pages */}
          <Route path="/category/brass-samovar" element={<BrassSamovar />} />
          <Route path="/category/brass-products" element={<BrassProducts />} />
          <Route path="/category/silver-plated" element={<SilverPlated />} />
          <Route path="/category/golden-brass" element={<GoldenBrass />} />
          <Route path="/category/qalamzani" element={<Qalamzani />} />
          <Route
            path="/category/mirror-candleholder"
            element={<MirrorCandleHolder />}
          />
          <Route
            path="/category/organizational-gift-pack"
            element={<OrganizationalGiftPack />}
          />
          <Route path="/category/khatamkari" element={<Khatamkari />} />
          <Route path="/category/frame" element={<FrameArt />} />
          {/* Protected UserPanel Routes */}
          <Route
            path="/user-panel/*"
            element={
              <ProtectedRoute>
                <UserPanel />
              </ProtectedRoute>
            }
          >
            {/* Default /user-panel shows AccountInfo */}
            <Route path="account-info" element={<AccountInfo />} />
            <Route path="cart" element={<ShoppingCart />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="reviews" element={<UserReviews />} />
            <Route path="addresses" element={<UserAddresses />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Home />} />
        </Routes>
        <ContactButton />
        <FooterMenu />
      </Router>
    </ToastProvider>
  );
};

export default App;
