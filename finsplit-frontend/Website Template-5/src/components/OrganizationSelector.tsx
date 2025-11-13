import { useState } from 'react';
import { useOrganization } from '../utils/OrganizationContext';
import { useLanguage } from '../utils/LanguageContext';
import { 
  Building2, 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown,
  Check,
  Globe,
  Users,
  FolderTree,
  X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface OrganizationSelectorProps {
  onClose?: () => void;
  compact?: boolean;
}

export function OrganizationSelector({ onClose, compact = false }: OrganizationSelectorProps) {
  const { language } = useLanguage();
  const {
    legalEntities,
    holdings,
    viewMode,
    setViewMode,
    selectedEntity,
    setSelectedEntity,
    selectedHolding,
    setSelectedHolding,
    getCurrentSelectionName,
    addLegalEntity,
    updateLegalEntity,
    deleteLegalEntity,
    addHolding,
    updateHolding,
    deleteHolding,
  } = useOrganization();

  const [isOpen, setIsOpen] = useState(false);
  const [showAddEntity, setShowAddEntity] = useState(false);
  const [showAddHolding, setShowAddHolding] = useState(false);
  const [editingEntity, setEditingEntity] = useState<string | null>(null);
  const [editingHolding, setEditingHolding] = useState<string | null>(null);

  // Form states
  const [newEntityName, setNewEntityName] = useState('');
  const [newEntityNameEn, setNewEntityNameEn] = useState('');
  const [newEntityCountry, setNewEntityCountry] = useState('KZ');
  const [newEntityType, setNewEntityType] = useState<'LLC' | 'IP' | 'Branch' | 'Holding'>('LLC');
  const [newEntityTaxId, setNewEntityTaxId] = useState('');
  const [newEntityHolding, setNewEntityHolding] = useState<string>('');

  const [newHoldingName, setNewHoldingName] = useState('');
  const [newHoldingNameEn, setNewHoldingNameEn] = useState('');
  const [selectedEntitiesForHolding, setSelectedEntitiesForHolding] = useState<string[]>([]);

  const handleSelectEntity = (entityId: string) => {
    setViewMode('entity');
    setSelectedEntity(entityId);
    setSelectedHolding(null);
    setIsOpen(false);
    
    const entity = legalEntities.find(e => e.id === entityId);
    if (entity) {
      toast.success(
        language === 'ru'
          ? `Выбрано: ${entity.name}`
          : `Selected: ${entity.nameEn}`
      );
    }
  };

  const handleSelectHolding = (holdingId: string) => {
    setViewMode('holding');
    setSelectedHolding(holdingId);
    setSelectedEntity(null);
    setIsOpen(false);
    
    const holding = holdings.find(h => h.id === holdingId);
    if (holding) {
      toast.success(
        language === 'ru'
          ? `Выбран холдинг: ${holding.name}`
          : `Selected holding: ${holding.nameEn}`
      );
    }
  };

  const handleSelectAll = () => {
    setViewMode('all');
    setSelectedEntity(null);
    setSelectedHolding(null);
    setIsOpen(false);
    
    toast.success(
      language === 'ru'
        ? 'Показаны все юридические лица'
        : 'Showing all entities'
    );
  };

  const handleAddEntity = () => {
    if (!newEntityName || !newEntityNameEn) {
      toast.error(language === 'ru' ? 'Заполните все поля' : 'Fill in all fields');
      return;
    }

    const newEntity = {
      id: `entity-${Date.now()}`,
      name: newEntityName,
      nameEn: newEntityNameEn,
      country: newEntityCountry,
      type: newEntityType,
      taxId: newEntityTaxId,
      holding: newEntityHolding || undefined,
      revenue: 0,
      expenses: 0,
      accounts: [],
    };

    addLegalEntity(newEntity);
    
    // Reset form
    setNewEntityName('');
    setNewEntityNameEn('');
    setNewEntityCountry('KZ');
    setNewEntityType('LLC');
    setNewEntityTaxId('');
    setNewEntityHolding('');
    setShowAddEntity(false);
    
    toast.success(
      language === 'ru'
        ? `Добавлено юр. лицо: ${newEntityName}`
        : `Added entity: ${newEntityNameEn}`
    );
  };

  const handleAddHolding = () => {
    if (!newHoldingName || !newHoldingNameEn) {
      toast.error(language === 'ru' ? 'Заполните все поля' : 'Fill in all fields');
      return;
    }

    const newHolding = {
      id: `holding-${Date.now()}`,
      name: newHoldingName,
      nameEn: newHoldingNameEn,
      entities: selectedEntitiesForHolding,
      color: 'from-blue-600 to-purple-600',
    };

    addHolding(newHolding);
    
    // Reset form
    setNewHoldingName('');
    setNewHoldingNameEn('');
    setSelectedEntitiesForHolding([]);
    setShowAddHolding(false);
    
    toast.success(
      language === 'ru'
        ? `Добавлен холдинг: ${newHoldingName}`
        : `Added holding: ${newHoldingNameEn}`
    );
  };

  const handleDeleteEntity = (id: string) => {
    const entity = legalEntities.find(e => e.id === id);
    if (entity && window.confirm(
      language === 'ru'
        ? `Удалить юр. лицо "${entity.name}"?`
        : `Delete entity "${entity.nameEn}"?`
    )) {
      deleteLegalEntity(id);
      toast.success(
        language === 'ru'
          ? 'Юр. лицо удалено'
          : 'Entity deleted'
      );
    }
  };

  const handleDeleteHolding = (id: string) => {
    const holding = holdings.find(h => h.id === id);
    if (holding && window.confirm(
      language === 'ru'
        ? `Удалить холдинг "${holding.name}"?`
        : `Delete holding "${holding.nameEn}"?`
    )) {
      deleteHolding(id);
      toast.success(
        language === 'ru'
          ? 'Холдинг удален'
          : 'Holding deleted'
      );
    }
  };

  const handleEditEntity = (id: string) => {
    const entity = legalEntities.find(e => e.id === id);
    if (entity) {
      setEditingEntity(id);
      setNewEntityName(entity.name);
      setNewEntityNameEn(entity.nameEn);
      setNewEntityCountry(entity.country);
      setNewEntityType(entity.type || 'LLC');
      setNewEntityTaxId(entity.taxId || '');
      setNewEntityHolding(entity.holding || '');
    }
  };

  const handleUpdateEntity = () => {
    if (!editingEntity || !newEntityName || !newEntityNameEn) {
      toast.error(language === 'ru' ? 'Заполните все поля' : 'Fill in all fields');
      return;
    }

    updateLegalEntity(editingEntity, {
      name: newEntityName,
      nameEn: newEntityNameEn,
      country: newEntityCountry,
      type: newEntityType,
      taxId: newEntityTaxId,
      holding: newEntityHolding || undefined,
    });
    
    // Reset form
    setNewEntityName('');
    setNewEntityNameEn('');
    setNewEntityCountry('KZ');
    setNewEntityType('LLC');
    setNewEntityTaxId('');
    setNewEntityHolding('');
    setEditingEntity(null);
    
    toast.success(
      language === 'ru'
        ? 'Юр. лицо обновлено'
        : 'Entity updated'
    );
  };

  const handleEditHolding = (id: string) => {
    const holding = holdings.find(h => h.id === id);
    if (holding) {
      setEditingHolding(id);
      setNewHoldingName(holding.name);
      setNewHoldingNameEn(holding.nameEn);
      setSelectedEntitiesForHolding(holding.entities);
    }
  };

  const handleUpdateHolding = () => {
    if (!editingHolding || !newHoldingName || !newHoldingNameEn) {
      toast.error(language === 'ru' ? 'Заполните все поля' : 'Fill in all fields');
      return;
    }

    updateHolding(editingHolding, {
      name: newHoldingName,
      nameEn: newHoldingNameEn,
      entities: selectedEntitiesForHolding,
    });
    
    // Reset form
    setNewHoldingName('');
    setNewHoldingNameEn('');
    setSelectedEntitiesForHolding([]);
    setEditingHolding(null);
    
    toast.success(
      language === 'ru'
        ? 'Холдинг обновлен'
        : 'Holding updated'
    );
  };

  const countryFlags: Record<string, string> = {
    KZ: '🇰🇿',
    RU: '🇷🇺',
    GE: '🇬🇪',
    AM: '🇦🇲',
    EU: '🇪🇺',
  };

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Building2 className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-900">{getCurrentSelectionName(language)}</span>
          <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl border border-gray-200 shadow-2xl z-50 max-h-[600px] overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  {language === 'ru' ? 'Выбор организации' : 'Select Organization'}
                </h3>
              </div>

              <div className="p-4">
                {/* View All Option */}
                <button
                  onClick={handleSelectAll}
                  className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg transition-all ${
                    viewMode === 'all'
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-900">
                        {language === 'ru' ? 'Все юр. лица' : 'All Entities'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {legalEntities.length} {language === 'ru' ? 'компаний' : 'entities'}
                      </p>
                    </div>
                  </div>
                  {viewMode === 'all' && <Check className="w-5 h-5 text-blue-600" />}
                </button>

                {/* Holdings Section */}
                {holdings.length > 0 && (
                  <>
                    <div className="mt-6 mb-3 flex items-center justify-between">
                      <h4 className="text-sm text-gray-600 flex items-center gap-2">
                        <FolderTree className="w-4 h-4" />
                        {language === 'ru' ? 'Холдинги' : 'Holdings'}
                      </h4>
                      <button
                        onClick={() => setShowAddHolding(true)}
                        className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        {language === 'ru' ? 'Добавить' : 'Add'}
                      </button>
                    </div>
                    <div className="space-y-2">
                      {holdings.map((holding) => (
                        <div
                          key={holding.id}
                          className={`flex items-center justify-between gap-3 p-3 rounded-lg transition-all ${
                            viewMode === 'holding' && selectedHolding === holding.id
                              ? 'bg-emerald-50 border-2 border-emerald-500'
                              : 'hover:bg-gray-50 border-2 border-transparent'
                          }`}
                        >
                          <button
                            onClick={() => handleSelectHolding(holding.id)}
                            className="flex-1 flex items-center gap-3 text-left"
                          >
                            <div className={`w-10 h-10 bg-gradient-to-br ${holding.color} rounded-lg flex items-center justify-center text-white`}>
                              <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-900">
                                {language === 'ru' ? holding.name : holding.nameEn}
                              </p>
                              <p className="text-xs text-gray-500">
                                {holding.entities.length} {language === 'ru' ? 'компаний' : 'entities'}
                              </p>
                            </div>
                          </button>
                          <div className="flex items-center gap-2">
                            {viewMode === 'holding' && selectedHolding === holding.id && (
                              <Check className="w-5 h-5 text-emerald-600" />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditHolding(holding.id);
                              }}
                              className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteHolding(holding.id);
                              }}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Legal Entities Section */}
                <div className="mt-6 mb-3 flex items-center justify-between">
                  <h4 className="text-sm text-gray-600 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {language === 'ru' ? 'Юридические лица' : 'Legal Entities'}
                  </h4>
                  <button
                    onClick={() => setShowAddEntity(true)}
                    className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    {language === 'ru' ? 'Добавить' : 'Add'}
                  </button>
                </div>
                <div className="space-y-2">
                  {legalEntities.map((entity) => (
                    <div
                      key={entity.id}
                      className={`flex items-center justify-between gap-3 p-3 rounded-lg transition-all ${
                        viewMode === 'entity' && selectedEntity === entity.id
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <button
                        onClick={() => handleSelectEntity(entity.id)}
                        className="flex-1 flex items-center gap-3 text-left"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                          {countryFlags[entity.country] || '🏢'}
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">
                            {language === 'ru' ? entity.name : entity.nameEn}
                          </p>
                          <p className="text-xs text-gray-500">
                            {entity.country} • {entity.type}
                          </p>
                        </div>
                      </button>
                      <div className="flex items-center gap-2">
                        {viewMode === 'entity' && selectedEntity === entity.id && (
                          <Check className="w-5 h-5 text-blue-600" />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEntity(entity.id);
                          }}
                          className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEntity(entity.id);
                          }}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Add/Edit Entity Modal */}
        {(showAddEntity || editingEntity) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    {editingEntity 
                      ? (language === 'ru' ? 'Редактировать юр. лицо' : 'Edit Legal Entity')
                      : (language === 'ru' ? 'Добавить юр. лицо' : 'Add Legal Entity')
                    }
                  </h3>
                  <button 
                    onClick={() => {
                      setShowAddEntity(false);
                      setEditingEntity(null);
                      setNewEntityName('');
                      setNewEntityNameEn('');
                      setNewEntityCountry('KZ');
                      setNewEntityType('LLC');
                      setNewEntityTaxId('');
                      setNewEntityHolding('');
                    }} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    {language === 'ru' ? 'Название (рус)' : 'Name (Russian)'}
                  </label>
                  <input
                    type="text"
                    value={newEntityName}
                    onChange={(e) => setNewEntityName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={language === 'ru' ? 'ООО "Название"' : 'LLC "Name"'}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    {language === 'ru' ? 'Название (eng)' : 'Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={newEntityNameEn}
                    onChange={(e) => setNewEntityNameEn(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Company Name LLC"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      {language === 'ru' ? 'Страна' : 'Country'}
                    </label>
                    <select
                      value={newEntityCountry}
                      onChange={(e) => setNewEntityCountry(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="KZ">🇰🇿 Kazakhstan</option>
                      <option value="RU">🇷🇺 Russia</option>
                      <option value="GE">🇬🇪 Georgia</option>
                      <option value="AM">🇦🇲 Armenia</option>
                      <option value="EU">🇪🇺 EU</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      {language === 'ru' ? 'Тип' : 'Type'}
                    </label>
                    <select
                      value={newEntityType}
                      onChange={(e) => setNewEntityType(e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="LLC">LLC</option>
                      <option value="IP">IP</option>
                      <option value="Branch">Branch</option>
                      <option value="Holding">Holding</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    {language === 'ru' ? 'ИИН/БИН' : 'Tax ID'}
                  </label>
                  <input
                    type="text"
                    value={newEntityTaxId}
                    onChange={(e) => setNewEntityTaxId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123456789012"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    {language === 'ru' ? 'Холдинг (опционально)' : 'Holding (optional)'}
                  </label>
                  <select
                    value={newEntityHolding}
                    onChange={(e) => setNewEntityHolding(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{language === 'ru' ? 'Без холдинга' : 'No holding'}</option>
                    {holdings.map((holding) => (
                      <option key={holding.id} value={holding.id}>
                        {language === 'ru' ? holding.name : holding.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => {
                    setShowAddEntity(false);
                    setEditingEntity(null);
                    setNewEntityName('');
                    setNewEntityNameEn('');
                    setNewEntityCountry('KZ');
                    setNewEntityType('LLC');
                    setNewEntityTaxId('');
                    setNewEntityHolding('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {language === 'ru' ? 'Отмена' : 'Cancel'}
                </button>
                <button
                  onClick={editingEntity ? handleUpdateEntity : handleAddEntity}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingEntity 
                    ? (language === 'ru' ? 'Сохранить' : 'Save')
                    : (language === 'ru' ? 'Добавить' : 'Add')
                  }
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Holding Modal */}
        {(showAddHolding || editingHolding) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                    {editingHolding
                      ? (language === 'ru' ? 'Редактировать холдинг' : 'Edit Holding')
                      : (language === 'ru' ? 'Создать холдинг' : 'Create Holding')
                    }
                  </h3>
                  <button 
                    onClick={() => {
                      setShowAddHolding(false);
                      setEditingHolding(null);
                      setNewHoldingName('');
                      setNewHoldingNameEn('');
                      setSelectedEntitiesForHolding([]);
                    }} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    {language === 'ru' ? 'Название холдинга (рус)' : 'Holding Name (Russian)'}
                  </label>
                  <input
                    type="text"
                    value={newHoldingName}
                    onChange={(e) => setNewHoldingName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={language === 'ru' ? 'Холдинг "Название"' : 'Holdings Name'}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    {language === 'ru' ? 'Название холдинга (eng)' : 'Holding Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={newHoldingNameEn}
                    onChange={(e) => setNewHoldingNameEn(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Holdings Name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    {language === 'ru' ? 'Выберите компании' : 'Select Companies'}
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {legalEntities.map((entity) => (
                      <label key={entity.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedEntitiesForHolding.includes(entity.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEntitiesForHolding([...selectedEntitiesForHolding, entity.id]);
                            } else {
                              setSelectedEntitiesForHolding(selectedEntitiesForHolding.filter(id => id !== entity.id));
                            }
                          }}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{countryFlags[entity.country] || '🏢'}</span>
                          <span className="text-sm text-gray-900">
                            {language === 'ru' ? entity.name : entity.nameEn}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => {
                    setShowAddHolding(false);
                    setEditingHolding(null);
                    setNewHoldingName('');
                    setNewHoldingNameEn('');
                    setSelectedEntitiesForHolding([]);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {language === 'ru' ? 'Отмена' : 'Cancel'}
                </button>
                <button
                  onClick={editingHolding ? handleUpdateHolding : handleAddHolding}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {editingHolding
                    ? (language === 'ru' ? 'Сохранить' : 'Save')
                    : (language === 'ru' ? 'Создать' : 'Create')
                  }
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full version (non-compact)
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          {language === 'ru' ? 'Управление организациями' : 'Organization Management'}
        </h3>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Current Selection Display */}
      <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <p className="text-xs text-gray-600 mb-1">
          {language === 'ru' ? 'Текущий выбор:' : 'Current Selection:'}
        </p>
        <p className="text-gray-900">{getCurrentSelectionName(language)}</p>
      </div>

      {/* Rest of the component content would go here for the full version */}
      <p className="text-sm text-gray-600">
        {language === 'ru' 
          ? 'Используйте компактный режим для выбора организаций' 
          : 'Use compact mode to select organizations'}
      </p>
    </div>
  );
}
