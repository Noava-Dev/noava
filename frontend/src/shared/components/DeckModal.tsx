import { Label, TextInput, Textarea, Select, Button } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DeckVisibility, type Deck, type CreateDeckRequest } from '../../models/Deck';

interface DeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deck: CreateDeckRequest) => void;
  deck?: Deck;
}

function DeckModal({ isOpen, onClose, onSubmit, deck }: DeckModalProps) {
  const { t } = useTranslation('decks');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('');
  const [visibility, setVisibility] = useState<DeckVisibility>(DeckVisibility.Private);

  useEffect(() => {
    if (deck) {
      setTitle(deck.title);
      setDescription(deck.description || '');
      setLanguage(deck.language || '');
      setVisibility(deck.visibility);
    } else {
      setTitle('');
      setDescription('');
      setLanguage('');
      setVisibility(DeckVisibility.Private);
    }
  }, [deck, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      title,
      description: description || undefined,
      language: language || undefined,
      visibility,
    });

    setTitle('');
    setDescription('');
    setLanguage('');
    setVisibility(DeckVisibility.Private);
  };

  const getVisibilityHelpText = () => {
    switch (visibility) {
      case DeckVisibility.Private:
        return t('modal.visibilityHelp.private');
      case DeckVisibility.Shared:
        return t('modal.visibilityHelp.shared');
      case DeckVisibility.Public:
        return t('modal.visibilityHelp.public');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

{/* Modal Content */}
<div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
  <form onSubmit={handleSubmit} className="p-6 space-y-4">
    {/* Title */}
    <div>
  <Label htmlFor="title">
    {t('modal.titleLabel')} *
  </Label>
  <TextInput
    id="title"
    type="text"
    placeholder={t('modal.titlePlaceholder')}
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
  />
</div>

{/* Description */}
<div>
  <Label htmlFor="description">
    {t('modal.descriptionLabel')}
  </Label>
  <Textarea
    id="description"
    placeholder={t('modal.descriptionPlaceholder')}
    rows={3}
    value={description}
    onChange={(e) => setDescription(e.target.value)}
  />
</div>

{/* Language */}
<div>
  <Label htmlFor="language">
    {t('modal.languageLabel')}
  </Label>
  <Select
    id="language"
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
  >
    <option value="">{t('languages.select')}</option>
    <option value={t('languages.dutch')}>{t('languages.dutch')}</option>
    <option value={t('languages.french')}>{t('languages.french')}</option>
    <option value={t('languages.english')}>{t('languages.english')}</option>
    <option value={t('languages.german')}>{t('languages.german')}</option>
    <option value={t('languages.spanish')}>{t('languages.spanish')}</option>
    <option value={t('languages.italian')}>{t('languages.italian')}</option>
  </Select>
</div>

{/* Visibility */}
<div>
  <Label htmlFor="visibility">
    {t('modal.visibilityLabel')}
  </Label>
  <Select
    id="visibility"
    value={visibility}
    onChange={(e) => setVisibility(Number(e.target.value) as DeckVisibility)}
  >
    <option value={DeckVisibility.Private}>{t('modal.visibilityPrivate')}</option>
    <option value={DeckVisibility.Shared}>{t('modal.visibilityShared')}</option>
    <option value={DeckVisibility.Public}>{t('modal.visibilityPublic')}</option>
  </Select>
  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
    {getVisibilityHelpText()}
  </p>
</div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {deck ? t('modal.updateButton') : t('modal.createButton')}
              </Button>
              <Button color="gray" onClick={onClose}>
                {t('modal.cancelButton')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    
  );
}

export default DeckModal;