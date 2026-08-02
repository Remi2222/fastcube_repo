





export const buttonClassMappings = {
  'btn btn-primary': { variant: 'primary', size: 'md' },
  'btn btn-primary btn-lg': { variant: 'primary', size: 'lg' },
  'btn btn-primary btn-sm': { variant: 'primary', size: 'sm' },
  'btn btn-outline': { variant: 'outline', size: 'md' },
  'btn btn-outline btn-lg': { variant: 'outline', size: 'lg' },
  'btn btn-outline btn-sm': { variant: 'outline', size: 'sm' },
  'btn btn-ghost': { variant: 'ghost', size: 'md' },
  'btn btn-ghost btn-lg': { variant: 'ghost', size: 'lg' },
  'btn btn-ghost btn-sm': { variant: 'ghost', size: 'sm' },
  'btn btn-danger': { variant: 'danger', size: 'md' },
  'btn btn-danger btn-sm': { variant: 'danger', size: 'sm' },
  'btn btn-success': { variant: 'success', size: 'md' },
  'btn btn-success btn-sm': { variant: 'success', size: 'sm' },
  'btn btn-warning': { variant: 'warning', size: 'md' },
  'btn btn-warning btn-sm': { variant: 'warning', size: 'sm' },
};


export const convertButtonClass = (className) => {
  for (const [oldClass, props] of Object.entries(buttonClassMappings)) {
    if (className.includes(oldClass)) {
      return props;
    }
  }
  return { variant: 'primary', size: 'md' }; 
};


export const cleanButtonClasses = (className) => {
  let cleaned = className;
  
  
  Object.keys(buttonClassMappings).forEach(btnClass => {
    cleaned = cleaned.replace(btnClass, '').trim();
  });
  
  
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  return cleaned;
};















