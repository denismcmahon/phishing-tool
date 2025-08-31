import { useEffect } from 'react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50'>
      <div className='absolute inset-0 bg-black/50' onClick={onClose} />
      <div className='absolute inset-0 flex items-center justify-center p-4'>
        <div className='w-full max-w-xl bg-white rounded-2xl shadow-card animate-[fadeIn_.12s_ease-out]'>
          <div className='flex items-center justify-between px-5 py-4 border-b border-slate-200'>
            <h2 className='text-lg font-semibold'>{title}</h2>
            <button
              onClick={onClose}
              className='text-slate-500 hover:text-slate-700 text-xl leading-none'
            >
              ×
            </button>
          </div>
          <div className='p-5'>{children}</div>
        </div>
      </div>
    </div>
  );
}
