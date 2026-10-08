export const isLoginFormValid = (values) => {
  const { email, password } = values;

  if (!email.trim()) {
    return false;
  }
  if (!password.trim()) {
    return false;
  }
  return true;
};

export const isSignUpFormValid = (formData, setValidationError) => {
  if (!formData.name.trim()) {
    return false;
  }
  if (!formData.email.trim()) {
    return false;
  }
  if (!formData.password.trim()) {
    return false;
  }
  if (!formData.confirmPassword.trim()) {
    setValidationError("Please confirm your password");
    return false;
  }
  if (formData.password !== formData.confirmPassword) {
    setValidationError("Passwords do not match");
    return false;
  }
  return true;
};

export const isAddProductsFormValid = (formData, setErrorMessage) => {
  if (!formData.name.trim()) {
    return false;
  }
  if (!formData.category?.trim()) {
    return false;
  }

  if (!formData.buyingPrice || formData.buyingPrice < 0) {
    setErrorMessage("Enter a valid buying price");
    return false;
  }
  if (!formData.sellingPrice || formData.sellingPrice < 0) {
    setErrorMessage("Enter a valid selling price");
    return false;
  }
  if (!formData.quantity || formData.quantity < 0) {
    setErrorMessage("Enter a valid quantity");
    return false;
  }
  return true;
};

export const isRecordSaleFormValid = (
  formData,
  availableProducts,
  setErrorMessage,
) => {
  if (!formData.productId) {
    setErrorMessage("Select a product");
    return false;
  }

  if (!formData.quantity || formData.quantity <= 0) {
    setErrorMessage("Quantity MUST be greater that zero (0)");
    return false;
  }

  if (!formData.price || formData.price <= 0) {
    setErrorMessage("Enter valid price");
    return false;
  }

  if (formData.quantity > availableProducts.quantity) {
    setErrorMessage("Not enough stock available");
    return false;
  }

  return true;
};
export const isRecordChargingFormValid = (formData, setErrorMessage) => {
  if (!formData.phonesCharged || formData.phonesCharged <= 0) {
    setErrorMessage("Enter number of phones charged");
    return false;
  }
  if (!formData.pricePerPhone || formData.pricePerPhone <= 0) {
    setErrorMessage("Enter price per phone");
    return false;
  }
  return true;
};
export const isAddBranchFormValid = (formData, setErrorMessage) => {
  if (!formData.name.trim()) {
    setErrorMessage("Branch name is required");
    return false;
  }
  if (!formData.location.trim()) {
    setErrorMessage("Branch location is required");
    return false;
  }
  return true;
};

export const isManageWorkersFormValid = (formData, setErrorMessage) => {
  if (!formData.name.trim()) {
    setErrorMessage("Worker name is required");
    return false;
  }
  if (!formData.email.trim()) {
    setErrorMessage("Worker email is required");
    return false;
  }
  if (!formData.password.trim()) {
    setErrorMessage("Worker password is required");
    return false;
  }

  if (!formData.branchId.trim()) {
    setErrorMessage("Please select a branch");
    return false;
  }
  return true;
};

export const isPhoneChargingFormValid = (formData, setError) => {
  if (!formData.customerName.trim()) {
    setError("Customer name is required.");
    return;
  }
  if (!formData.deviceModel.trim()) {
    setError("Phone model is required.");
    return;
  }
  if (+formData.price <= 0) {
    setError("Enter a valid charging price.");
    return;
  }
  return true;
};

export const createHandleBlur = (fieldNames, setErrors) => {
  return (e) => {
    const { name, value } = e.target;
    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [name]: `${fieldNames[name]} is required!`,
      }));
    }
  };
};
