import { Toast, ToastToggle } from "flowbite-react";
import { HiCheck, HiExclamation, HiX, HiInformationCircle } from "react-icons/hi";

/* Usage examples:
 Simple message
 showSuccess('Success', 'Saved successfully!');
 showError('Error', 'Failed to save');

  With descriptive title
  showSuccess('Success', 'FAQ created successfully!');
  showError('Connection Error', 'Failed to connect to server');
 */
interface CustomToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose: () => void;
}

function CustomToast({ type, title, message, onClose }: CustomToastProps) {
  const config = {
    success: {
      icon: <HiCheck className="h-5 w-5" />,
      className: "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200"
    },
    error: {
      icon: <HiX className="h-5 w-5" />,
      className: "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200"
    },
    warning: {
      icon: <HiExclamation className="h-5 w-5" />,
      className: "bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200"
    },
    info: {
      icon: <HiInformationCircle className="h-5 w-5" />,
      className: "bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200"
    }
  };

  const { icon, className } = config[type];

  return (
    <Toast className="fixed top-5 right-5 z-50">
      <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${className}`}>
        {icon}
      </div>
      <div className="ml-3 text-sm">
        {title && (
          <div className="font-semibold mb-1">{title}</div>
        )}
        <div className={title ? "font-normal" : "font-normal"}>{message}</div>
      </div>
      <ToastToggle onDismiss={onClose} />
    </Toast>
  );
}

export default CustomToast;