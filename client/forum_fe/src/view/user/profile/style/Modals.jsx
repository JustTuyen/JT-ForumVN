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