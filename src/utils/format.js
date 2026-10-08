export const formatMoney = (value) => `UGX ${value?.toLocaleString("en-US")}`;

export const formatReceiptDate = (value) =>
  new Date(value).toLocaleDateString("en-US");

export const formatReceiptTime = (value) =>
  new Date(value).toLocaleTimeString("en-US");

export const formatDateTime = (value) => {
  const date = new Date(value);

  return `${formatReceiptDate(date)} — ${formatReceiptTime(date)}`;
};
