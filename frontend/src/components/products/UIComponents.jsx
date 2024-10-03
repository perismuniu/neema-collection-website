import React from 'react';
import { ChevronDown, X } from 'lucide-react'
import { motion } from 'framer-motion';

export const Button = ({ children, onClick, variant = 'default', size = 'default', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variantClasses = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
  };
  const sizeClasses = {
    default: 'text-sm',
    icon: 'p-2',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export const Switch = ({ checked, onCheckedChange }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={() => onCheckedChange(!checked)}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  );
};

export const Input = ({ ...props }) => {
  return (
    <input
      className="w-full px-3 py-2 text-gray-700 border border-none rounded-lg focus:outline-none focus:border-blue-500"
      {...props}
    />
  );
};

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {children}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => onOpenChange(false)}
        >
          <X/>
        </button>
      </div>
    </div>
  );
};

export const DialogContent = ({ children }) => {
  return <div className="p-6">{children}</div>;
};

export const DialogHeader = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

export const DialogFooter = ({ children }) => {
  return <div className="mt-6 flex justify-end space-x-2">{children}</div>;
};

export const DialogTitle = ({ children }) => {
  return <h3 className="text-lg font-semibold">{children}</h3>;
};

export const DialogDescription = ({ children }) => {
  return <p className="text-sm text-gray-500 mt-2">{children}</p>;
};

export const Avatar = ({ children, ...props }) => {
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center" {...props}>
      {children}
    </div>
  );
};

export const Table = ({ children, ...props }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200" {...props}>
      {children}
    </table>
  );
};

export const TableBody = ({ children, ...props }) => {
  return <tbody className="bg-white divide-y divide-gray-200" {...props}>{children}</tbody>;
};

export const TableCell = ({ children, ...props }) => {
  return <td className="px-6 py-4 whitespace-nowrap" {...props}>{children}</td>;
};

export const TableHead = ({ children, ...props }) => {
  return <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props}>{children}</th>;
};

export const TableHeader = ({ children, ...props }) => {
  return <thead className="bg-gray-50" {...props}>{children}</thead>;
};

export const TableRow = ({ children, ...props }) => {
  return <tr {...props} className='border-none'>{children}</tr>;
};

export const Tabs = ({ children, value, onChange, ...props }) => {
  return (
    <div className="w-full" {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === TabsList) {
            return React.cloneElement(child, {
              children: React.Children.map(child.props.children, tab => {
                if (React.isValidElement(tab) && tab.type === TabsTrigger) {
                  return React.cloneElement(tab, {
                    selected: tab.props.value === value,
                    onChange: onChange || (() => {}),
                  });
                }
                return tab;
              }),
            });
          }
          if (child.type === TabsContent) {
            return React.cloneElement(child, {
              selected: child.props.value === value,
            });
          }
        }
        return child;
      })}
    </div>
  );
};

export const TabsContent = ({ children, value, selected, ...props }) => {
  if (!selected) return null;
  return (
    <div role="tabpanel" {...props}>
      {children}
    </div>
  );
};

export const TabsList = ({ children, ...props }) => {
  return (
    <div className="flex space-x-1 border-b" {...props}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ children, value, selected, onChange, ...props }) => {
  const handleClick = () => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <button
      role="tab"
      className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${
        selected
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-500 hover:text-gray-700'
      }`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export const Label = ({ children, ...props }) => {
  return (
    <label className="block text-sm font-medium text-gray-700" {...props}>
      {children}
    </label>
  );
};

// export const Select = ({ children, ...props }) => {
//   return (
//     <select
//       className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//       {...props}
//     >
//       {children}
//     </select>
//   );
// };

export const Textarea = ({ ...props }) => {
  return (
    <textarea
      className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
      {...props}
    />
  );
};

// // Updated Select Components
// export const Select = React.forwardRef(({ children, onValueChange, ...props }, ref) => {
//   const [isOpen, setIsOpen] = React.useState(false);
//   const [selectedValue, setSelectedValue] = React.useState(props.value || '');

//   return (
//     <div className="relative" ref={ref}>
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full px-3 py-2 text-left bg-white border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//       >
//         {selectedValue || 'Select option'}
//       </button>
//       {isOpen && (
//         <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
//           {React.Children.map(children, child => 
//             React.cloneElement(child, {
//               onSelect: (value) => {
//                 setSelectedValue(value);
//                 onValueChange?.(value);
//                 setIsOpen(false);
//               }
//             })
//           )}
//         </div>
//       )}
//     </div>
//   );
// });

export const Select = React.forwardRef(({ children, value, onValueChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative" ref={ref}>
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            value
          });
        }
        if (child.type === SelectContent && isOpen) {
          return React.cloneElement(child, {
            onValueChange: (newValue) => {
              onValueChange?.(newValue);
              setIsOpen(false);
            }
          });
        }
        return null;
      })}
    </div>
  );
});

export const SelectTrigger = React.forwardRef(({ children, onClick, value, ...props }, ref) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center justify-between w-full px-3 py-2 text-left bg-white border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
    ref={ref}
    {...props}
  >
    {children}
    <ChevronDown className="w-4 h-4 ml-2" />
  </button>
));

export const SelectValue = React.forwardRef(({ placeholder }, ref) => (
  <span ref={ref} className="block truncate">
    {placeholder}
  </span>
));

export const SelectContent = React.forwardRef(({ children, onValueChange }, ref) => (
  <div 
    ref={ref}
    className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200"
  >
    <div className="py-1">
      {React.Children.map(children, child =>
        React.cloneElement(child, {
          onSelect: onValueChange
        })
      )}
    </div>
  </div>
));

export const SelectItem = React.forwardRef(({ value, children, onSelect }, ref) => (
  <div
    ref={ref}
    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
    onClick={() => onSelect?.(value)}
  >
    {children}
  </div>
));

// export const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;

// export const SelectContent = ({ children }) => (
//   <div className="py-1">{children}</div>
// );

// export const SelectItem = ({ value, children, onSelect }) => (
//   <div
//     className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//     onClick={() => onSelect?.(value)}
//   >
//     {children}
//   </div>
// );

// Motion-enhanced components
export const MotionButton = motion(Button);

export const MotionDiv = motion.div;
