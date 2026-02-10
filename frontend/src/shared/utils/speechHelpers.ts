export const getLanguageCode = (language: string): string => {
  const langMap: Record<string, string> = {
    'english': 'en-US',
    'engels': 'en-US',
    'dutch': 'nl-NL',
    'nederlands': 'nl-NL',
    'french': 'fr-FR',
    'frans': 'fr-FR',
    'spanish': 'es-ES',
    'spaans': 'es-ES',
    'german': 'de-DE',
    'duits': 'de-DE',
    'italian': 'it-IT',
    'italiaans': 'it-IT',
    /* 'portuguese': 'pt-PT',
    'japanese': 'ja-JP',
    'chinese': 'zh-CN',
    'korean': 'ko-KR',
    'russian': 'ru-RU',
    'arabic': 'ar-SA' */
  };

  const normalized = language?.trim().toLowerCase();
  return langMap[normalized] || 'en-US';
};