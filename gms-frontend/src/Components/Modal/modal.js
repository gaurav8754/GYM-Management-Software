import React from 'react';
import ClearIcon from '@mui/icons-material/Clear';

const Modal = ({ handleClose, content, header }) => {
  return (
    <div className='w-full h-screen fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto'>
      <div className='w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 relative border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200'>
        <div className='flex justify-between items-center pb-4 border-b border-slate-100'>
          <h3 className='text-xl font-bold text-slate-800 tracking-tight'>
            {header}
          </h3>
          <button
            onClick={handleClose}
            className='p-1.5 rounded-lg text-gray-400 hover:text-slate-800 hover:bg-slate-100 transition-colors'
            aria-label="Close modal"
          >
            <ClearIcon fontSize="small" />
          </button>
        </div>

        <div className='mt-4'>
          {content}
        </div>
      </div>
    </div>
  );
};

export default Modal;
