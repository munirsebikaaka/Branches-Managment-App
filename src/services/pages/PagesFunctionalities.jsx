export const dashboardStats = (sales, charging, dinamic) => {
  const totalSales = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
  const totalCharging = charging.reduce(
    (sum, charge) => sum + (charge.total || 0),
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
  return branches.reduce((acc, branch) => {
    const id = branch.branchID || branch.id;
    acc[id] = branch.branchName;
    return acc;
  }, {});
};
