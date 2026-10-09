import { useEffect, useRef } from 'react';

export default function Modal({ onClose, children }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current.open) ref.current.showModal();
  }, []);

  return <dialog ref={ref} onClose={onClose}>{children}</dialog>;
}
