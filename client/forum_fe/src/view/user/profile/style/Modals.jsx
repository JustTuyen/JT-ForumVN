export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  bgcolor: 'background.paper',
  border: '2px solid #9400D3',
  boxShadow: 24,
  p: 4,

  '@media screen and (max-width: 1024px)': {
    width: '80%',
    p: 2,
  },

  '@media screen and (max-width: 810px)': {
    width: '90%',
    p: 2,
  },
};

export const modalStyle2 = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  border: '2px solid #9400D3',
  boxShadow: 24,
  p: 4,

  '@media screen and (max-width: 1024px)': {
    width: '70%',
    p: 2,
  },

  '@media screen and (max-width: 810px)': {
    width: '90%',
    p: 2,
  },
};

export const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'N/A';   // guards against invalid/malformed input
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};