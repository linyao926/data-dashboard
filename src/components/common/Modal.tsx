// src/components/common/Modal.tsx
import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
}) => {
  // Size styles
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative bg-white rounded-lg shadow-xl
            w-full ${sizeStyles[size]}
            animate-slide-up
            ${className}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              type="button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

// Modal sub-components
const ModalHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>
);

const ModalTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h3>
);

const ModalBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => <div className={`px-6 py-4 ${className}`}>{children}</div>;

const ModalFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-200 flex justify-end gap-3 ${className}`}>
    {children}
  </div>
);

export default Object.assign(Modal, {
  Header: ModalHeader,
  Title: ModalTitle,
  Body: ModalBody,
  Footer: ModalFooter,
});

/* 
USAGE EXAMPLES:

// 1. Simple modal
const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <div className="p-6">
    <h2>Modal Content</h2>
    <p>This is a simple modal</p>
  </div>
</Modal>

// 2. Compound modal (RECOMMENDED)
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <Modal.Header>
    <Modal.Title>Confirm Delete</Modal.Title>
  </Modal.Header>
  
  <Modal.Body>
    <p>Are you sure you want to delete this item?</p>
    <p className="text-sm text-gray-500 mt-2">
      This action cannot be undone.
    </p>
  </Modal.Body>
  
  <Modal.Footer>
    <Button variant="outline" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  </Modal.Footer>
</Modal>

// 3. Different sizes
<Modal size="sm" isOpen={isOpen} onClose={onClose}>
  <Modal.Body>Small modal</Modal.Body>
</Modal>

<Modal size="lg" isOpen={isOpen} onClose={onClose}>
  <Modal.Body>Large modal</Modal.Body>
</Modal>

<Modal size="full" isOpen={isOpen} onClose={onClose}>
  <Modal.Body>Full screen modal</Modal.Body>
</Modal>

// 4. Form modal
<Modal isOpen={isOpen} onClose={onClose}>
  <Modal.Header>
    <Modal.Title>Add New Product</Modal.Title>
  </Modal.Header>
  
  <Modal.Body>
    <form onSubmit={handleSubmit}>
      <Input label="Product Name" fullWidth className="mb-4" />
      <Input label="Price" type="number" fullWidth className="mb-4" />
      <Input.Textarea label="Description" fullWidth rows={3} />
    </form>
  </Modal.Body>
  
  <Modal.Footer>
    <Button variant="outline" onClick={onClose}>
      Cancel
    </Button>
    <Button type="submit">
      Add Product
    </Button>
  </Modal.Footer>
</Modal>

// 5. Confirmation modal
<Modal 
  isOpen={showConfirm} 
  onClose={() => setShowConfirm(false)}
  size="sm"
>
  <Modal.Body className="text-center py-6">
    <div className="text-5xl mb-4">⚠️</div>
    <h3 className="text-lg font-semibold mb-2">Are you sure?</h3>
    <p className="text-gray-600 mb-6">
      This will permanently delete your account.
    </p>
    <div className="flex gap-3 justify-center">
      <Button variant="outline" onClick={() => setShowConfirm(false)}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleConfirm}>
        Confirm
      </Button>
    </div>
  </Modal.Body>
</Modal>

// 6. Detail view modal (from DataTable row click)
<Modal isOpen={!!selectedRecord} onClose={() => setSelectedRecord(null)} size="lg">
  <Modal.Header>
    <Modal.Title>Sale Details</Modal.Title>
  </Modal.Header>
  
  <Modal.Body>
    {selectedRecord && (
      <div className="space-y-4">
        <div>
          <label className="font-medium">Product:</label>
          <p>{selectedRecord.product}</p>
        </div>
        <div>
          <label className="font-medium">Category:</label>
          <Badge variant="primary">{selectedRecord.category}</Badge>
        </div>
        <div>
          <label className="font-medium">Amount:</label>
          <p className="text-2xl font-bold text-green-600">
            ${selectedRecord.amount.toLocaleString()}
          </p>
        </div>
      </div>
    )}
  </Modal.Body>
  
  <Modal.Footer>
    <Button variant="outline" onClick={() => setSelectedRecord(null)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>

// 7. Prevent closing on overlay click
<Modal 
  isOpen={isOpen} 
  onClose={onClose}
  closeOnOverlayClick={false}
  closeOnEscape={false}
>
  <Modal.Body>
    <p>Must click button to close</p>
    <Button onClick={onClose}>Close</Button>
  </Modal.Body>
</Modal>

// 8. No close button
<Modal 
  isOpen={isOpen} 
  onClose={onClose}
  showCloseButton={false}
>
  <Modal.Body>
    <p>Custom close handling</p>
  </Modal.Body>
</Modal>

// 9. Loading modal
<Modal isOpen={isLoading} onClose={() => {}}>
  <Modal.Body className="text-center py-8">
    <Loading variant="spinner" size="lg" />
    <p className="mt-4 text-gray-600">Processing...</p>
  </Modal.Body>
</Modal>

// 10. Success/Error modal
<Modal isOpen={showSuccess} onClose={() => setShowSuccess(false)} size="sm">
  <Modal.Body className="text-center py-6">
    <div className="text-6xl mb-4">✅</div>
    <h3 className="text-xl font-semibold mb-2">Success!</h3>
    <p className="text-gray-600">Your changes have been saved.</p>
  </Modal.Body>
  <Modal.Footer className="justify-center">
    <Button onClick={() => setShowSuccess(false)}>
      OK
    </Button>
  </Modal.Footer>
</Modal>
*/
