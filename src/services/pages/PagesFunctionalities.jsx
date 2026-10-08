import { toast } from "react-toastify";
import { deleteData, updateData } from "../../utils/api";
import { isRecordSaleFormValid } from "../form/FormValidations";
import { getFriendlyErrorMessage } from "../../utils/errorMessages";

export const dashboardStats = (sales, charging, dinamic) => {
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalCharging = charging.reduce(
    (sum, charge) => sum + +charge.price,
    0,
  );
  const totalDinamic = dinamic.length;
  return {
    totalRevenue: totalSales + totalCharging,
    totalSales,
    totalCharging,
    totalDinamic,
  };
};

export const getNames = (branches) => {
  const acc = {};
  for (const branch of branches) {
    const id = branch.id;
    acc[id] = branch.branchName;
  }
  return acc;
};

export const handleAddProductToSale = (
  selectedItem,
  salesProducts,
  setSelectedProducts,
  setSelectedItem,
  setError,
  selectedProducts,
  setCalculatedQuantity,
) => {
  const product = salesProducts?.find((p) => p.id === selectedItem.productId);

  if (!product) {
    setError("Please select a product.");
    return;
  }

  const selectedQuantity = selectedProducts
    .filter((item) => item.productId === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);
  const remainingQuantity = product.quantity - selectedQuantity;
  const productWithRemainingStock = {
    ...product,
    quantity: remainingQuantity,
  };

  setCalculatedQuantity(remainingQuantity);

  if (
    !isRecordSaleFormValid(
      {
        productId: selectedItem.productId,
        quantity: selectedItem.quantity,
        price: selectedItem.price,
      },
      productWithRemainingStock,
      setError,
    )
  ) {
    return;
  }

  setSelectedProducts((prev) => [
    ...prev,
    {
      productId: product.id,
      productName: product.name,
      quantity: +selectedItem.quantity,
      price: +selectedItem.price,
    },
  ]);

  setSelectedItem({ productId: "", quantity: "", price: "" });
  setError("");
};

export const removeSelectedProduct = (i, setSelectedProducts) => {
  setSelectedProducts((prev) => prev.filter((_, index) => index !== i));
};

export const saleItems = (selectedProducts, salesProducts) => {
  return selectedProducts.map((item) => {
    const product = salesProducts.find((p) => p.id === item.productId);
    const qty = +item.quantity;
    const unitPrice = +item.price;
    const total = qty * unitPrice;

    return {
      productId: item.productId,
      productName: product?.name,
      quantity: qty,
      price: unitPrice,
      total,
    };
  });
};

export const updateDatabaseAndUi = async (
  salesProducts,
  setProducts,
  saleItems,
) => {
  for (const item of saleItems) {
    const productId = item.productId;
    const quantitySold = item.quantity;

    const product = salesProducts.find((p) => p.id === productId);
    const newQuantity = product.quantity - quantitySold;

    if (newQuantity <= 0) {
      await deleteData("products", product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.warning(`${product.name} is now out of stock!`);
    } else {
      await updateData("products", product.id, { quantity: newQuantity });
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, quantity: newQuantity } : p,
        ),
      );
    }
  }
};

export const handleDeleteProduct = async (
  data,
  setData,
  endPoint,
  setDeletingId,
) => {
  setDeletingId(data.id);
  try {
    await deleteData(endPoint, data.id);
    setData((prev) => prev.filter((item) => item.id !== data.id));
    toast.success("Action completed successfully.");
  } catch {
    toast.error("Unable to complete action. Please try again.");
  } finally {
    setDeletingId(null);
  }
};

export const markAsTaken = async (
  record,
  setError,
  setTakingId,
  setChargingData,
  user,
) => {
  setError("");
  setTakingId(record.id);
  const update = {
    status: "taken",
    collectedAt: new Date().toISOString(),
    collectedBy: user?.id,
  };

  try {
    await updateData("charging", record.id, update);
    setChargingData((current) =>
      current.map((item) =>
        item.id === record.id ? { ...item, ...update } : item,
      ),
    );
    toast.success("Phone taken successfully.");
  } catch (err) {
    setError(getFriendlyErrorMessage(err, "general"));
  } finally {
    setTakingId(null);
  }
};

export const filterAppData = (
  appData,
  user,
  urlBranchId,
  getBranchName,
  search,
) => {
  let filtered = appData;

  if (user?.role === "owner" && urlBranchId) {
    filtered = filtered?.filter((data) => data.branchId === urlBranchId);
  } else if (user?.role === "worker") {
    filtered = filtered?.filter((data) => data.branchId === user.branchId);
  }

  if (search.trim()) {
    const searchValue = search.trim().toLowerCase();
    filtered = filtered?.filter((data) => {
      const branchName = getBranchName[data.branchId];
      return [
        branchName,
        data?.name,
        data?.customerName,
        data?.deviceModel,
      ].some((value) => value?.toLowerCase().includes(searchValue));
    });
  }

  return [...filtered];
};
