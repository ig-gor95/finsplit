# AI Analytics - Quick Start Guide

## For Developers

### What Was Added?

✅ **7 New AI-powered insight cards** in DashboardAnalytics component
✅ **InfoTooltip for Scenario Analysis Tool** in FXRiskAnalysis component
✅ **Comprehensive documentation** (3 new markdown files)

---

## Quick Reference

### Files Modified

1. `/components/DashboardAnalytics.tsx` - Added AI Insights section
2. `/components/FXRiskAnalysis.tsx` - Added InfoTooltip to Scenario Analysis

### Files Created

1. `/AI_ANALYTICS_MODULE.md` - Technical documentation
2. `/AI_ANALYTICS_USER_GUIDE.md` - User guide (Russian)
3. `/CHANGELOG_AI_ANALYTICS.md` - Version history
4. `/AI_ANALYTICS_QUICK_START.md` - This file

---

## Code Snippets

### 1. Using InfoTooltip Component

```tsx
import { InfoTooltip } from './InfoTooltip';

<h3 className="flex items-center gap-2">
  Your Title
  <InfoTooltip 
    text="Your helpful explanation here" 
    position="top" // optional: 'top' | 'bottom' | 'left' | 'right'
    variant="dark" // optional: 'dark' | 'light'
  />
</h3>
```

### 2. AI Insight Card Template

```tsx
<div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
      <Icon className="w-5 h-5 text-blue-600" />
    </div>
    <div className="flex-1">
      <h4 className="text-gray-900 flex items-center gap-2">
        Title
        <InfoTooltip text="Explanation" />
      </h4>
      <p className="text-xs text-gray-500">Subtitle</p>
    </div>
  </div>
  <div className="space-y-2">
    {/* Your content here */}
  </div>
</div>
```

### 3. Adding Toast Notifications

```tsx
import { toast } from 'sonner@2.0.3';

// Success message
toast.success('Operation completed!');

// Info message
toast.info('Information message');

// Warning message
toast.warning('Warning message');

// Error message
toast.error('Error occurred');
```

---

## Testing Checklist

### Visual Testing
- [ ] All cards render without errors
- [ ] InfoTooltips display on hover
- [ ] Responsive design works on mobile (< 768px)
- [ ] Gradients and colors display correctly
- [ ] Icons load properly

### Functional Testing
- [ ] Refresh button triggers update
- [ ] Click handlers work on interactive elements
- [ ] Toast notifications appear
- [ ] Language switching works (EN/RU)
- [ ] InfoTooltip can be dismissed

### Browser Testing
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers

---

## Common Issues & Solutions

### Issue: InfoTooltip not showing
**Solution:** Check that InfoTooltip component is imported correctly:
```tsx
import { InfoTooltip } from './InfoTooltip';
```

### Issue: Icons not displaying
**Solution:** Verify lucide-react imports:
```tsx
import {
  Activity,
  AlertCircle,
  Target,
  Bell,
  Info,
} from 'lucide-react';
```

### Issue: Toast notifications not working
**Solution:** Ensure correct sonner import with version:
```tsx
import { toast } from 'sonner@2.0.3';
```

### Issue: Responsive layout broken
**Solution:** Check Tailwind breakpoints:
```tsx
// Use lg: prefix for desktop, no prefix for mobile
className="grid grid-cols-1 lg:grid-cols-3 gap-4"
```

---

## Customization Guide

### Change Colors

Find the color scheme section in DashboardAnalytics.tsx:

```tsx
// Predictive Insights - Indigo
bg-indigo-100, text-indigo-600

// Anomaly Detection - Orange
bg-orange-100, text-orange-600

// Tax Optimization - Green
bg-green-100, text-green-600

// Cash Flow - Blue gradient
from-blue-500 to-blue-600

// Compliance - Purple gradient
from-purple-500 to-purple-600
```

### Change Mock Data

Update the data at the beginning of your component or fetch from API:

```tsx
// Example: Update revenue forecast
const revenueForecast = {
  amount: 12800,
  growth: 19,
  accuracy: 87,
  confidence: 'High'
};
```

### Add New Insight Card

1. Copy an existing card structure
2. Change icon and colors
3. Update title and data
4. Add InfoTooltip with explanation
5. Implement click handler if needed

---

## Performance Tips

### Optimize Calculations
```tsx
// Use useMemo for expensive calculations
const aiInsights = useMemo(() => {
  return calculateAIInsights(transactions);
}, [transactions]);
```

### Lazy Load Components
```tsx
// For large dashboards, lazy load AI section
const AIInsights = lazy(() => import('./AIInsights'));
```

### Cache Results
```tsx
// Cache API results to avoid recalculation
const [cachedInsights, setCachedInsights] = useState(null);
```

---

## API Integration (Future)

### Expected API Structure

```typescript
// GET /api/ai-insights
interface AIInsightsResponse {
  revenueForecast: {
    amount: number;
    growth: number;
    accuracy: number;
    confidence: 'High' | 'Medium' | 'Low';
    factors: string[];
  };
  anomalies: Array<{
    id: string;
    severity: 'critical' | 'warning' | 'info';
    description: string;
    amount: number;
    date: string;
  }>;
  taxOptimization: {
    potentialSavings: number;
    recommendations: Array<{
      title: string;
      description: string;
      estimatedSavings: number;
    }>;
  };
  // ... other insights
}
```

### Example Integration

```tsx
const [insights, setInsights] = useState(null);

useEffect(() => {
  fetch('/api/ai-insights')
    .then(res => res.json())
    .then(data => setInsights(data));
}, []);
```

---

## Accessibility

### ARIA Labels
```tsx
<button 
  aria-label="Refresh AI insights"
  onClick={handleRefresh}
>
  <RefreshCw className="w-4 h-4" />
</button>
```

### Keyboard Navigation
```tsx
<div 
  role="button"
  tabIndex={0}
  onKeyPress={(e) => e.key === 'Enter' && handleClick()}
>
  Content
</div>
```

### Screen Reader Support
```tsx
<span className="sr-only">
  Hidden text for screen readers
</span>
```

---

## Debugging

### Enable Console Logs
```tsx
const DEBUG = true;

if (DEBUG) {
  console.log('AI Insights:', aiInsights);
}
```

### Check Component Props
```tsx
// In DashboardAnalytics
console.log('Props:', { 
  displayCurrency, 
  periodFilter 
});
```

### Verify State Updates
```tsx
// Use React DevTools
// Or add logging to useState hooks
const [data, setData] = useState(() => {
  console.log('Initial state');
  return initialData;
});
```

---

## Deployment Checklist

### Pre-Deploy
- [ ] Remove console.log statements
- [ ] Test all features manually
- [ ] Run linter (if available)
- [ ] Check for TypeScript errors
- [ ] Verify no broken imports
- [ ] Test in production mode

### Post-Deploy
- [ ] Monitor for JavaScript errors
- [ ] Check performance metrics
- [ ] Verify API calls (when implemented)
- [ ] Test on production environment
- [ ] Get user feedback

---

## Support & Resources

### Documentation Files
- `/AI_ANALYTICS_MODULE.md` - Technical details
- `/AI_ANALYTICS_USER_GUIDE.md` - User instructions
- `/CHANGELOG_AI_ANALYTICS.md` - Version history

### Component Files
- `/components/DashboardAnalytics.tsx` - Main AI section
- `/components/FXRiskAnalysis.tsx` - Scenario analysis
- `/components/InfoTooltip.tsx` - Tooltip component

### External Resources
- [Lucide React Icons](https://lucide.dev/icons/)
- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)

---

## Quick Commands

```bash
# View AI Analytics component
cat /components/DashboardAnalytics.tsx

# Search for AI insights
grep -r "AI Analytics" /components/

# Find InfoTooltip usage
grep -r "InfoTooltip" /components/

# Check for errors
npm run lint
```

---

**Last Updated:** November 3, 2025
**Maintainer:** FinSplit Development Team
**Questions?** Create an issue or contact support@finsplit.com
