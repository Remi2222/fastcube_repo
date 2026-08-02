









export const validateRequiredFields = (formData, requiredFields) => {
  const validatedFields = {};
  
  
  requiredFields.forEach(fieldName => {
    const value = formData[fieldName];
    
    validatedFields[fieldName] = value?.trim?.() || value || '';
  });

  
  const emptyFields = Object.entries(validatedFields)
    .filter(([key, value]) => !value || value.length === 0)
    .map(([key]) => key);

  return {
    isValid: emptyFields.length === 0,
    emptyFields,
    values: validatedFields
  };
};






export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email?.trim() || '');
};






export const showValidationError = (emptyFields, customMessage = null) => {
  if (emptyFields.length > 0) {
    console.log('Champs vides détectés:', emptyFields);
    alert(customMessage || 'Veuillez remplir tous les champs obligatoires (marqués d\'un *)');
    return true;
  }
  return false;
};








export const validateForm = (formData, requiredFields, options = {}) => {
  const { validateEmailField = null, customMessage = null } = options;
  
  
  const requiredValidation = validateRequiredFields(formData, requiredFields);
  
  if (!requiredValidation.isValid) {
    showValidationError(requiredValidation.emptyFields, customMessage);
    return { isValid: false, errors: requiredValidation.emptyFields };
  }

  
  if (validateEmailField && formData[validateEmailField]) {
    if (!validateEmail(formData[validateEmailField])) {
      alert('Veuillez saisir une adresse email valide');
      return { isValid: false, errors: [validateEmailField] };
    }
  }

  return { isValid: true, errors: [] };
}; 