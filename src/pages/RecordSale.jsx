import { useState, useMemo } from "react";
import { Sidebar } from "../components/Sidebar";
import { postData } from "../utils/api";
import { useAuthContext } from "../utils/context/CreateAuthContext";
import { useProductsContext } from "../utils/context/CreateProductContext";
import Input from "../ui/Input";
import { toast } from "react-toastify";
import { getFriendlyErrorMessage } from "../utils/errorMessages";
import ResponsiveNav from "../components/ResponsiveNav";
import LoadingPage from "../components/LoadingPage";
import FetchedError from "../components/FefchError";
import Error from "../components/Error";
import Blur from "../components/Blur";
import SaleButton from "../ui/SaleButton";
import {
  filterAppData,
  getNames,
  handleAddProductToSale,
  saleItems,
  updateDatabaseAndUi,
  updateSelectedProduct,
} from "../services/pages/PagesFunctionalities";
import { createHandleBlur } from "../services/form/FormValidations";
import ReceiptPreview from "../components/ReceiptPreview";
import { formatMoney } from "../utils/format";
import { useLocation, useNavigate } from "react-router-dom";
import { useSaleContext } from "../utils/context/CreateSaleContext";
import Search from "../components/Search";
const inputNames = {
  productId: "ProductId",
  quantity: "Quantity",
  price: "Price",
  vat: "VAT",
};
const RecordSale = () => {
  const { user } = useAuthContext();
  const { products, loading, setProducts, setSalesData, branches } =
    useProductsContext();
  const {
    selectedProducts,
    setSelectedProducts,
    selectedItem,
    setSelectedItem,
    calculatedQuantity,
    setCalculatedQuantity,
    showUpdateButton,
    setShowUpdateButton,
    error,
    setError,
  } = useSaleContext();

  const navigate = useNavigate();
  const location = useLocation();
  const [onBlurErrors, setOnBlurErrors] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);

  const activeBranchId = user?.branchId;

  const getBranchName = useMemo(() => getNames(branches), [branches]);

  const handleBlur = createHandleBlur(inputNames, setOnBlurErrors);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const handleCloseReceipt = () => {
    setIsReceiptVisible(false);
    setSelectedReceipt(null);
  };

  const salesProducts = useMemo(() => {
    return products.filter((product) => product.branchId === activeBranchId);
  }, [products, activeBranchId]);

  const filteredProducts = useMemo(() => {
    return filterAppData(salesProducts, user, null, getBranchName, search);
  }, [salesProducts, user, search, getBranchName]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSelectedItem((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSelectProduct = (product) => {
    const alreadyInCart = selectedProducts.some(
      (item) => item.productId === product.id,
    );
    if (alreadyInCart) return;

    setSelectedItem({
      productId: product.id,
      quantity: "1",
      price: product.sellingPrice,
      vat: product.vat,
    });
    setCalculatedQuantity(+product.quantity);
    setShowUpdateButton(false);
    setError("");
  };

  const isProvidedQuantitySuported = useMemo(() => {
    return (
      +selectedItem.quantity > 0 && +selectedItem.quantity <= calculatedQuantity
    );
  }, [selectedItem.quantity, calculatedQuantity]);

  const handleAddToSale = () => {
    handleAddProductToSale(
      selectedItem,
      filteredProducts,
      setSelectedProducts,
      setSelectedItem,
      setError,
      selectedProducts,
      setCalculatedQuantity,
    );
  };

  const handleUpdateSelectedProduct = () => {
    const product = filteredProducts.find(
      (item) => item.id === selectedItem.productId,
    );
    const otherSelectedQuantity = selectedProducts
      .filter((item) => item.productId !== selectedItem.productId)
      .reduce((sum, item) => sum + +item.quantity, 0);
    const availableQuantity = +product?.quantity - otherSelectedQuantity;

    if (
      !product ||
      +selectedItem.quantity < 1 ||
      +selectedItem.quantity > availableQuantity ||
      +selectedItem.price <= 0
    ) {
      setError(
        "Enter a valid price and choose a quantity within the available stock.",
      );
      return;
    }

    updateSelectedProduct(
      setSelectedProducts,
      {
        ...selectedItem,
        quantity: +selectedItem.quantity,
        price: +selectedItem.price,
        vat: +selectedItem.vat,
      },
      setSelectedItem,
      setShowUpdateButton,
    );
    setError("");
    if (location.state?.returnToCartAfterUpdate) {
      navigate("/selected-products-cart");
    }
  };

  const totalPricePerSelectedItem = formatMoney(
    selectedItem?.quantity * selectedItem?.price,
  );

  const isGoToSelectedItemsButtonDissabled = selectedProducts.length < 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedProducts.length) {
      setError("Add at least one product to the sale.");
      return;
    }

    try {
      const items = saleItems(selectedProducts, filteredProducts);
      const saleTotal = items.reduce((sum, item) => sum + item.total, 0);

      const sale = {
        items,
        total: saleTotal,
        vat: selectedItem.vat,
        branchId: activeBranchId,
        createdBy: user?.id,
        createdAt: new Date().toISOString(),
        saleRecieptNumber: Math.floor(100000 + Math.random() * 900000),
      };

      const saleResponse = await postData(sale, "sales");
      const createdSale = {
        id: saleResponse?.data?.name || Date.now().toString(),
        ...sale,
      };
      setSelectedReceipt(createdSale);
      setIsReceiptVisible(true);
      setSalesData((prev) => [createdSale, ...prev]);
      await updateDatabaseAndUi(filteredProducts, setProducts, items);

      toast.success("Sale recorded successfully!");
      setSelectedProducts([]);
    } catch (err) {
      setError(getFriendlyErrorMessage(err, "general"));
    }
  };

  const goToSelectedItems = () => {
    navigate("/selected-products-cart");
  };

  if (loading) {
    return (
      <LoadingPage
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    );
  }

  return (
    <div className="relative flex min-h-screen bg-background font-font-family">
      <Blur setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:ml-64 lg:p-10">
        <ResponsiveNav onClick={() => setIsSidebarOpen(true)} />
        {isReceiptVisible && selectedReceipt ? (
          <ReceiptPreview
            sale={selectedReceipt}
            isVisible={isReceiptVisible}
            onClose={handleCloseReceipt}
          />
        ) : (
          <div className="mx-auto">
            <Search
              title={"Select a product to add it to the sale."}
              urlBranchId={null}
              getBranchName={getBranchName}
              search={search}
              setSearch={setSearch}
              placeholder={"Search by product name..."}
            />

            <FetchedError />

            <form onSubmit={handleSubmit}>
              <div className="flex gap-4 justify-between">
                <section className="rounded-2xl w-[60%] border border-border-color bg-white p-4 shadow-sm sm:p-6">
                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-header-color">
                      Available products
                    </h2>
                    <p className="mt-1 text-sm text-header-description">
                      Select a product to add it to the sale.
                    </p>
                  </div>
                  {filteredProducts.length === 0 ? (
                    <p className=" p-5 text-center text-sm text-header-description">
                      No products are available at this branch.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {filteredProducts.map((product) => {
                        const selected = selectedProducts.some(
                          (item) => item.productId === product.id,
                        );
                        const isSelected =
                          selectedItem.productId === product.id;

                        return (
                          <button
                            key={product.id}
                            type="button"
                            disabled={
                              selected ||
                              +product.quantity < 1 ||
                              showUpdateButton
                            }
                            onClick={() => handleSelectProduct(product)}
                            className={`min-w-0 rounded-xl border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                              isSelected
                                ? "border-action-color bg-indigo-50/60"
                                : "border-border-color hover:border-action-color/50"
                            }`}>
                            <span className="block truncate font-semibold text-header-color">
                              {product.name}
                            </span>
                            <span className="mt-1 block text-sm text-header-description">
                              {formatMoney(+product.sellingPrice)}
                            </span>
                            <span className="mt-2 block text-xs font-medium text-header-description">
                              {selected
                                ? "Already in cart"
                                : `${product.quantity} in stock`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>

                <section className="relative w-100 rounded-2xl border border-border-color bg-white p-4 shadow-sm sm:p-6 self-start">
                  <h3 className="font-semibold text-header-color">
                    {showUpdateButton
                      ? "Update cart item"
                      : "Add selected product"}
                  </h3>

                  <div className="absolute px-3 top-0 right-0">
                    <SaleButton
                      disabled={isGoToSelectedItemsButtonDissabled}
                      onClick={goToSelectedItems}
                      text={`${selectedProducts.length} View Items`}
                    />
                  </div>

                  {!selectedItem.productId && (
                    <p className="text-sm text-header-description">
                      Choose a product to set its quantity and price.
                    </p>
                  )}

                  <p className="text-sm capitalize mb-3 font-semibold text-header-color">
                    {
                      filteredProducts.find(
                        (product) => product.id === selectedItem.productId,
                      )?.name
                    }
                  </p>

                  <div className="space-y-3 mb-3">
                    <Input
                      label={"Selling Price"}
                      inputConfig={{
                        type: "number",
                        name: "price",
                        value: selectedItem.price,
                        onChange: handleChange,
                        placeholder: "0.00",
                        min: 0.01,
                        step: "any",
                        onBlur: handleBlur,
                      }}
                      error={onBlurErrors.price}
                    />
                    <Input
                      label={"Quantity Sold"}
                      inputConfig={{
                        type: "number",
                        name: "quantity",
                        value: selectedItem.quantity,
                        onChange: handleChange,
                        placeholder: "0",
                        min: 1,
                        max: calculatedQuantity,
                        step: 1,
                        onBlur: handleBlur,
                      }}
                      error={onBlurErrors.quantity}
                    />
                    <Input
                      label={"Value Added Tax"}
                      inputConfig={{
                        type: "number",
                        name: "vat",
                        value: selectedItem.vat,
                        onChange: handleChange,
                        placeholder: "0",
                        onBlur: handleBlur,
                      }}
                      error={onBlurErrors.vat}
                    />
                  </div>

                  {selectedItem.price > 0 && (
                    <p
                      className={`text-sm font-medium text-${isProvidedQuantitySuported ? "header-description" : "error-color"}`}>
                      {isProvidedQuantitySuported
                        ? `Item total: ${totalPricePerSelectedItem}`
                        : "The provided quantity is higher than the quantity in stock."}
                    </p>
                  )}

                  <Error message={error}>{error}</Error>

                  <div className="mt-2 flex justify-center">
                    {!showUpdateButton ? (
                      <SaleButton
                        onClick={handleAddToSale}
                        text={"+ Add Product to Sale"}
                      />
                    ) : (
                      <SaleButton
                        onClick={handleUpdateSelectedProduct}
                        text={"Confirm Product Update"}
                      />
                    )}
                  </div>
                </section>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default RecordSale;
