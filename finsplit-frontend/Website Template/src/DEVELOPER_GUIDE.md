# FinOrbit - Developer Guide

## 📦 Component API Reference

### UploadStatements Component

```tsx
import { UploadStatements } from './components/UploadStatements';

<UploadStatements 
  onClose={() => void}  // Callback when modal closes
/>
```

**Features:**
- Drag & Drop file upload
- File format validation
- Bank selection
- Preview table (first 5 rows)
- Upload progress
- Success/error states

**Supported Formats:**
- CSV, XLSX, PDF, MT940, 1C, XML

---

### PricingModal Component

```tsx
import { PricingModal } from './components/PricingModal';

<PricingModal 
  onClose={() => void}     // Callback when modal closes
  currentPlan="pro"        // Current plan: 'free' | 'pro' | 'global'
/>
```

**Features:**
- 3-tier pricing table
- Feature comparison
- Current plan indicator
- Payment modal (demo)
- FAQ section

---

### LoadingSkeleton Components

```tsx
import { 
  DashboardSkeleton, 
  CardSkeleton, 
  TableSkeleton 
} from './components/LoadingSkeleton';

// Full dashboard skeleton
<DashboardSkeleton />

// Single card skeleton
<CardSkeleton />

// Table skeleton with custom rows
<TableSkeleton rows={10} />
```

**Use Cases:**
- Initial page load
- Data fetching
- Component mounting

---

### Translation Hook

```tsx
import { useTranslation } from '../utils/translations';
import type { Language } from '../utils/translations';

function MyComponent() {
  const [language, setLanguage] = useState<Language>('en');
  const { t, lang } = useTranslation(language);

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <button onClick={() => setLanguage('ru')}>
        Switch to Russian
      </button>
    </div>
  );
}
```

**Available Languages:**
- `'en'` - English
- `'ru'` - Russian
- `'kz'` - Kazakh

**Translation Keys Structure:**
```typescript
'nav.cashflow'
'dashboard.title'
'accounts.connectBank'
'common.save'
'status.completed'
// etc...
```

---

### Toast Notifications

```tsx
import { toast } from 'sonner';

// Success
toast.success('Operation completed!');

// Error
toast.error('Something went wrong!');

// Info
toast.info('Processing your request...');

// Warning
toast.warning('Please review your data!');

// Custom duration
toast.success('Saved!', { duration: 5000 });

// With action
toast.success('File uploaded', {
  action: {
    label: 'View',
    onClick: () => console.log('View clicked'),
  },
});
```

**Setup (App.tsx):**
```tsx
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <div>
      {/* Your app content */}
      <Toaster position="top-right" richColors />
    </div>
  );
}
```

---

## 🎨 Design System

### Colors

```tsx
// Primary
className="bg-blue-600"      // #2563EB
className="bg-blue-800"      // #1E40AF

// Success
className="bg-green-600"     // #10B981

// Warning
className="bg-orange-600"    // #F59E0B

// Error
className="bg-red-600"       // #EF4444

// Neutrals
className="bg-gray-50"       // Lightest
className="bg-gray-900"      // Darkest
```

### Typography

```tsx
// Headlines (uses defaults from globals.css)
<h1>Headline 1</h1>
<h2>Headline 2</h2>
<h3>Headline 3</h3>

// Body text
<p className="text-gray-700">Body text</p>

// Small text
<p className="text-sm text-gray-600">Small text</p>

// Financial numbers (tabular)
<p className="tabular-nums">$1,234.56</p>
```

### Spacing

```tsx
// Padding
className="p-4"   // 1rem (16px)
className="p-6"   // 1.5rem (24px)
className="p-8"   // 2rem (32px)

// Margins
className="mt-4"  // margin-top: 1rem
className="mb-6"  // margin-bottom: 1.5rem

// Gaps (flex/grid)
className="gap-4" // 1rem
className="gap-6" // 1.5rem
```

### Buttons

```tsx
// Primary button
<button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
  Primary Action
</button>

// Secondary button
<button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
  Secondary Action
</button>

// Disabled button
<button 
  disabled
  className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
>
  Disabled
</button>

// Loading button
<button className="px-6 py-2 bg-blue-600 text-white rounded-lg">
  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  Loading...
</button>
```

### Cards

```tsx
// Standard card
<div className="bg-white rounded-xl border p-6">
  <h3 className="text-black mb-4">Card Title</h3>
  <p className="text-gray-600">Card content</p>
</div>

// Gradient card
<div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
  <p className="text-white/80">Gradient card</p>
</div>

// Hover effect
<div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
  Hover me
</div>
```

### Forms

```tsx
// Input field
<input
  type="text"
  placeholder="Enter text..."
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
/>

// Select dropdown
<select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

// Textarea
<textarea
  rows={4}
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
/>

// Checkbox
<input type="checkbox" className="w-4 h-4" />

// Toggle switch
<label className="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" className="sr-only peer" />
  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
</label>
```

### Modals

```tsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
    {/* Header */}
    <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
      <h2 className="text-black">Modal Title</h2>
      <button onClick={onClose}>Close</button>
    </div>
    
    {/* Content */}
    <div className="p-6">
      Modal content
    </div>
    
    {/* Footer */}
    <div className="p-6 border-t bg-gray-50 flex justify-between sticky bottom-0">
      <button onClick={onClose}>Cancel</button>
      <button>Submit</button>
    </div>
  </div>
</div>
```

### Status Badges

```tsx
// Success
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
  Completed
</span>

// Warning
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-orange-100 text-orange-700">
  Pending
</span>

// Error
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-red-100 text-red-700">
  Failed
</span>

// Info
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
  Processing
</span>
```

### Tables

```tsx
<div className="bg-white rounded-xl border overflow-hidden">
  <table className="w-full">
    <thead className="bg-gray-50 border-b">
      <tr>
        <th className="px-6 py-3 text-left text-xs text-gray-600">
          Column 1
        </th>
      </tr>
    </thead>
    <tbody className="divide-y">
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 text-sm text-gray-900">
          Cell content
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 🔧 Utility Functions

### Format Currency

```tsx
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' ' + currency;
}

// Usage
formatCurrency(12500, 'USD') // "12,500.00 USD"
```

### Format Date

```tsx
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

// Usage
formatDate('2025-11-02') // "11/2/2025"
```

### Calculate Total Balance

```tsx
function calculateTotalBalance(
  accounts: Array<{ balance: number; currency: string }>,
  exchangeRates: Record<string, number>
): number {
  return accounts.reduce((sum, acc) => {
    return sum + (acc.balance * (exchangeRates[acc.currency] || 1));
  }, 0);
}
```

---

## 🎯 State Management Patterns

### Modal State

```tsx
function MyComponent() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Open Modal
      </button>
      
      {showModal && (
        <Modal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

### Filter State

```tsx
function TransactionsList() {
  const [filters, setFilters] = useState({
    country: null,
    currency: null,
    category: null,
  });
  
  const filteredData = data.filter(item => {
    if (filters.country && item.country !== filters.country) return false;
    if (filters.currency && item.currency !== filters.currency) return false;
    if (filters.category && item.category !== filters.category) return false;
    return true;
  });
  
  return (
    <div>
      <select onChange={(e) => setFilters({...filters, country: e.target.value})}>
        <option value="">All Countries</option>
        {/* options */}
      </select>
      {/* ... */}
    </div>
  );
}
```

### Loading State

```tsx
function DataComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData().then(result => {
      setData(result);
      setIsLoading(false);
    });
  }, []);
  
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  return <DataDisplay data={data} />;
}
```

---

## 📝 TypeScript Types

### Transaction Type

```typescript
interface Transaction {
  id: number;
  date: string;
  description: string;
  account: string;
  amount: number;
  category: string;
  aiConfidence: number;
  country: string;
  status: 'Completed' | 'Pending' | 'Failed';
}
```

### Account Type

```typescript
interface Account {
  id: number;
  name: string;
  currency: 'KZT' | 'RUB' | 'USD' | 'EUR';
  balance: number;
  country: 'KZ' | 'RU' | 'GE' | 'AM';
  color: string;
}
```

### Tax Report Type

```typescript
interface TaxReport {
  id: number;
  country: string;
  form: string;
  period: string;
  status: 'Filed' | 'Draft' | 'Pending';
  dueDate: string;
  filedDate: string | null;
}
```

---

## 🧪 Testing Examples

### Component Testing

```tsx
import { render, screen } from '@testing-library/react';
import { UploadStatements } from './UploadStatements';

test('renders upload modal', () => {
  const onClose = jest.fn();
  render(<UploadStatements onClose={onClose} />);
  
  expect(screen.getByText('Upload Bank Statement')).toBeInTheDocument();
});
```

### Hook Testing

```tsx
import { renderHook } from '@testing-library/react-hooks';
import { useTranslation } from '../utils/translations';

test('translates text correctly', () => {
  const { result } = renderHook(() => useTranslation('en'));
  
  expect(result.current.t('dashboard.title')).toBe('Cash Flow');
});
```

---

## 🚀 Performance Tips

### Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./components/Dashboard'));

function App() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}
```

### Memoization

```tsx
import { useMemo } from 'react';

function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return data.map(/* expensive operation */);
  }, [data]);
  
  return <div>{/* render */}</div>;
}
```

### Callback Optimization

```tsx
import { useCallback } from 'react';

function Parent() {
  const handleClick = useCallback(() => {
    // handle click
  }, []);
  
  return <Child onClick={handleClick} />;
}
```

---

## 📱 Responsive Design

### Breakpoints

```tsx
// Mobile first
className="w-full md:w-1/2 lg:w-1/3"

// Grid responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

// Hide on mobile
className="hidden md:block"

// Show only on mobile
className="block md:hidden"
```

### Container Queries

```tsx
// Max width container
className="container mx-auto px-4"

// Responsive padding
className="px-4 md:px-6 lg:px-8"

// Responsive text
className="text-sm md:text-base lg:text-lg"
```

---

## 🔐 Security Best Practices

1. **Never store sensitive data in localStorage**
2. **Always validate user input**
3. **Use HTTPS in production**
4. **Implement CSRF protection**
5. **Sanitize user-generated content**

---

## 📚 Additional Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Sonner Toast Docs](https://sonner.emilkowal.ski/)

---

**Last Updated:** November 2025  
**Version:** 1.0.0
