// Image assets configuration for CredNest
// This ensures images are properly bundled and accessible

// Profile images
export const profileImages = {
  shubhamShine: '/static/feedback_profile/sHUBHAM SHINE.jpeg',
  nehaAggarwal: '/static/feedback_profile/nEHA AGGARWAL .jpg',
  krishnaSalunke: '/static/feedback_profile/kRISHNA SALUNKE.jpg',
  vishalGupta: '/static/feedback_profile/Vishal-gUPTA.jpg'
};

// Bank logos
export const bankLogos = [
  '/static/bank1.31609d6e.png',
  '/static/bank2.41607330.png',
  '/static/bank3.94fe7691.png',
  '/static/bank4.66aad27d.png',
  '/static/bank5.00c5700a.png',
  '/static/bank6.ac2df3b6.png'
];

// Loan type icons
export const loanIcons = {
  homeLoans: '/static/homeLoans.e211848b.svg',
  balanceTransfer: '/static/balanceTransfer.5fb1b642.svg',
  loanAgainstProperty: '/static/loanAgainstProperty.996f26f0.svg'
};

// Background images
export const backgroundImages = {
  uspImage1: '/static/UspImage1.e49abf01.webp',
  uspImage2: '/static/UspImage2.12a338ef.webp',
  uspImage3: '/static/UspImage3.a7182985.webp',
  ourOfferings: '/static/ourOfferings.d8a4effd.webp'
};

// Company logos
export const companyLogos = {
  aws: '/static/awslogo.39cdd602.svg',
  digit: '/static/digit-logo.a9a338e6.png',
  bureau: '/static/bureau-logo.66d3355d.png'
};

// Helper function to get image URL with fallback
export const getImageUrl = (imagePath: string): string => {
  // For production, ensure the path starts with /
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return normalizedPath;
};

// Helper function to handle image loading errors
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallback?: string) => {
  const target = e.currentTarget;
  if (fallback) {
    target.src = fallback;
  } else {
    target.style.display = 'none';
  }
};
