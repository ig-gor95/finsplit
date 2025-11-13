import { createContext, useContext, useState, ReactNode } from 'react';

export interface LegalEntity {
  id: string;
  name: string;
  nameEn: string;
  country: string;
  revenue: number;
  expenses: number;
  holding?: string;
  taxId?: string;
  type?: 'LLC' | 'IP' | 'Branch' | 'Holding';
  accounts?: string[]; // Account IDs linked to this entity
}

export interface Holding {
  id: string;
  name: string;
  nameEn: string;
  entities: string[];
  color?: string;
}

export type ViewMode = 'entity' | 'holding' | 'all';

interface OrganizationContextType {
  // Legal Entities
  legalEntities: LegalEntity[];
  selectedEntity: string | null;
  setSelectedEntity: (id: string | null) => void;
  
  // Holdings
  holdings: Holding[];
  selectedHolding: string | null;
  setSelectedHolding: (id: string | null) => void;
  
  // View Mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  
  // Functions
  addLegalEntity: (entity: LegalEntity) => void;
  updateLegalEntity: (id: string, updates: Partial<LegalEntity>) => void;
  deleteLegalEntity: (id: string) => void;
  
  addHolding: (holding: Holding) => void;
  updateHolding: (id: string, updates: Partial<Holding>) => void;
  deleteHolding: (id: string) => void;
  
  // Helper functions
  getFilteredEntities: () => LegalEntity[];
  getEntityMultiplier: () => number;
  getCurrentSelectionName: (language: 'ru' | 'en') => string;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

// Mock data for legal entities and holdings
const defaultLegalEntities: LegalEntity[] = [
  { 
    id: 'kz-1', 
    name: 'ТОО "ФинТех Казахстан"', 
    nameEn: 'FinTech Kazakhstan LLP', 
    country: 'KZ', 
    revenue: 320000, 
    expenses: 240000, 
    holding: 'holding-1',
    taxId: 'KZ123456789',
    type: 'LLC',
    accounts: ['1', '3']
  },
  { 
    id: 'kz-2', 
    name: 'ИП Алиев Д.М.', 
    nameEn: 'IP Aliev D.M.', 
    country: 'KZ', 
    revenue: 180000, 
    expenses: 120000, 
    holding: 'holding-1',
    taxId: 'KZ987654321',
    type: 'IP',
    accounts: ['1']
  },
  { 
    id: 'ru-1', 
    name: 'ООО "ДигиталПро"', 
    nameEn: 'DigitalPro LLC', 
    country: 'RU', 
    revenue: 250000, 
    expenses: 180000, 
    holding: 'holding-1',
    taxId: 'RU1234567890',
    type: 'LLC',
    accounts: ['2']
  },
  { 
    id: 'ge-1', 
    name: 'Tech Solutions Georgia LLC', 
    nameEn: 'Tech Solutions Georgia LLC', 
    country: 'GE', 
    revenue: 100000, 
    expenses: 80000, 
    holding: 'holding-2',
    taxId: 'GE123456789',
    type: 'LLC',
    accounts: ['4']
  },
  { 
    id: 'am-1', 
    name: 'Armenia Digital CJSC', 
    nameEn: 'Armenia Digital CJSC', 
    country: 'AM', 
    revenue: 75000, 
    expenses: 55000, 
    holding: 'holding-2',
    taxId: 'AM123456789',
    type: 'LLC',
    accounts: []
  },
];

const defaultHoldings: Holding[] = [
  { 
    id: 'holding-1', 
    name: 'Холдинг "Евразия"', 
    nameEn: 'Eurasia Holdings', 
    entities: ['kz-1', 'kz-2', 'ru-1'],
    color: 'from-blue-600 to-purple-600'
  },
  { 
    id: 'holding-2', 
    name: 'Холдинг "Кавказ"', 
    nameEn: 'Caucasus Holdings', 
    entities: ['ge-1', 'am-1'],
    color: 'from-emerald-600 to-teal-600'
  },
];

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [legalEntities, setLegalEntities] = useState<LegalEntity[]>(defaultLegalEntities);
  const [holdings, setHoldings] = useState<Holding[]>(defaultHoldings);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [selectedHolding, setSelectedHolding] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  const addLegalEntity = (entity: LegalEntity) => {
    setLegalEntities([...legalEntities, entity]);
  };

  const updateLegalEntity = (id: string, updates: Partial<LegalEntity>) => {
    setLegalEntities(legalEntities.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteLegalEntity = (id: string) => {
    setLegalEntities(legalEntities.filter(e => e.id !== id));
    if (selectedEntity === id) {
      setSelectedEntity(null);
    }
  };

  const addHolding = (holding: Holding) => {
    setHoldings([...holdings, holding]);
  };

  const updateHolding = (id: string, updates: Partial<Holding>) => {
    setHoldings(holdings.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const deleteHolding = (id: string) => {
    setHoldings(holdings.filter(h => h.id !== id));
    if (selectedHolding === id) {
      setSelectedHolding(null);
    }
  };

  const getFilteredEntities = (): LegalEntity[] => {
    if (viewMode === 'all') {
      return legalEntities;
    } else if (viewMode === 'holding' && selectedHolding) {
      const holding = holdings.find(h => h.id === selectedHolding);
      if (holding) {
        return legalEntities.filter(e => holding.entities.includes(e.id));
      }
    } else if (viewMode === 'entity' && selectedEntity) {
      return legalEntities.filter(e => e.id === selectedEntity);
    }
    return legalEntities;
  };

  const getEntityMultiplier = (): number => {
    const totalRevenue = legalEntities.reduce((sum, e) => sum + e.revenue, 0);
    
    if (viewMode === 'holding' && selectedHolding) {
      const holding = holdings.find(h => h.id === selectedHolding);
      if (holding) {
        const entities = legalEntities.filter(e => holding.entities.includes(e.id));
        const holdingRevenue = entities.reduce((sum, e) => sum + e.revenue, 0);
        return holdingRevenue / totalRevenue;
      }
    } else if (viewMode === 'entity' && selectedEntity) {
      const entity = legalEntities.find(e => e.id === selectedEntity);
      return entity ? entity.revenue / totalRevenue : 1;
    }
    
    return 1; // All entities
  };

  const getCurrentSelectionName = (language: 'ru' | 'en'): string => {
    if (viewMode === 'all') {
      return language === 'ru' ? 'Все юр. лица' : 'All Entities';
    } else if (viewMode === 'holding' && selectedHolding) {
      const holding = holdings.find(h => h.id === selectedHolding);
      return holding ? (language === 'ru' ? holding.name : holding.nameEn) : '';
    } else if (viewMode === 'entity' && selectedEntity) {
      const entity = legalEntities.find(e => e.id === selectedEntity);
      return entity ? (language === 'ru' ? entity.name : entity.nameEn) : '';
    }
    return language === 'ru' ? 'Не выбрано' : 'Not selected';
  };

  const value: OrganizationContextType = {
    legalEntities,
    selectedEntity,
    setSelectedEntity,
    holdings,
    selectedHolding,
    setSelectedHolding,
    viewMode,
    setViewMode,
    addLegalEntity,
    updateLegalEntity,
    deleteLegalEntity,
    addHolding,
    updateHolding,
    deleteHolding,
    getFilteredEntities,
    getEntityMultiplier,
    getCurrentSelectionName,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}
