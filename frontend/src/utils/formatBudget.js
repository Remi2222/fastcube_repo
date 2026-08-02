




export const formatBudget = (budget) => {
  if (!budget) return 'Non spécifié';
  
  
  const budgetStr = String(budget).trim();
  
  
  return budgetStr.includes('DH') ? budgetStr : `${budgetStr} DH`;
};

export default formatBudget;
