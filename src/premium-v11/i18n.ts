type Dict = Record<string,string>;

const ro: Dict = {
  aiLabel:'AstroVip AI', conciergeTitle:'AstroVip Concierge', close:'Închide',
  conciergeLead:'Caută instant în baza AstroVip: servicii, tehnici, relocare, hartă natală, Solar Arcs și studii de caz.',
  searchPlaceholder:'Ex: Cum mă ajută astrologia relocării?', search:'Caută', searching:'Caut în baza AstroVip…',
  noResult:'Nu am găsit încă un fragment suficient de relevant. Încearcă o formulare mai scurtă.',
  source:'Deschide sursa →', unavailable:'Serviciul de căutare este momentan indisponibil.',
  sourceNote:'Răspunsurile afișate sunt extrase din conținutul public AstroVip.'
};
const en: Dict = {
  aiLabel:'AstroVip AI', conciergeTitle:'AstroVip Concierge', close:'Close',
  conciergeLead:'Search AstroVip knowledge instantly: services, techniques, relocation, natal charts, Solar Arcs and case studies.',
  searchPlaceholder:'Example: How can relocation astrology help me?', search:'Search', searching:'Searching AstroVip knowledge…',
  noResult:'No sufficiently relevant excerpt was found yet. Try a shorter query.', source:'Open source →',
  unavailable:'Knowledge search is temporarily unavailable.', sourceNote:'Displayed results are extracted from public AstroVip content.'
};
const es: Dict = {
  aiLabel:'AstroVip AI', conciergeTitle:'AstroVip Concierge', close:'Cerrar',
  conciergeLead:'Busca al instante en el conocimiento AstroVip: servicios, técnicas, reubicación, carta natal, Arcos Solares y casos.',
  searchPlaceholder:'Ej.: ¿Cómo puede ayudarme la astrología de reubicación?', search:'Buscar', searching:'Buscando en AstroVip…',
  noResult:'Aún no encontré un fragmento suficientemente relevante. Prueba una consulta más corta.', source:'Abrir fuente →',
  unavailable:'La búsqueda no está disponible temporalmente.', sourceNote:'Los resultados se extraen del contenido público de AstroVip.'
};
const it: Dict = {
  aiLabel:'AstroVip AI', conciergeTitle:'AstroVip Concierge', close:'Chiudi',
  conciergeLead:'Cerca subito nella base AstroVip: servizi, tecniche, rilocazione, tema natale, Archi Solari e casi studio.',
  searchPlaceholder:'Es.: Come può aiutarmi l’astrologia della rilocazione?', search:'Cerca', searching:'Cerco nella base AstroVip…',
  noResult:'Non ho ancora trovato un estratto abbastanza pertinente. Prova una domanda più breve.', source:'Apri fonte →',
  unavailable:'La ricerca è temporaneamente non disponibile.', sourceNote:'I risultati sono estratti dai contenuti pubblici AstroVip.'
};
const ru: Dict = {
  aiLabel:'AstroVip AI', conciergeTitle:'AstroVip Concierge', close:'Закрыть',
  conciergeLead:'Поиск по базе AstroVip: услуги, техники, релокация, натальная карта, Solar Arcs и кейсы.',
  searchPlaceholder:'Напр.: Как мне поможет астрология релокации?', search:'Поиск', searching:'Поиск в базе AstroVip…',
  noResult:'Достаточно релевантный фрагмент пока не найден. Попробуйте более короткий запрос.', source:'Открыть источник →',
  unavailable:'Поиск временно недоступен.', sourceNote:'Результаты извлечены из публичного контента AstroVip.'
};
const ar: Dict = {
  aiLabel:'AstroVip AI', conciergeTitle:'AstroVip Concierge', close:'إغلاق',
  conciergeLead:'ابحث في معرفة AstroVip: الخدمات والتقنيات والانتقال والخريطة الميلادية والأقواس الشمسية ودراسات الحالة.',
  searchPlaceholder:'مثال: كيف يمكن أن يساعدني علم التنجيم للانتقال؟', search:'بحث', searching:'جارٍ البحث في AstroVip…',
  noResult:'لم يتم العثور بعد على مقطع ذي صلة كافية. جرّب سؤالاً أقصر.', source:'فتح المصدر ←',
  unavailable:'خدمة البحث غير متاحة مؤقتاً.', sourceNote:'النتائج المعروضة مستخرجة من محتوى AstroVip العام.'
};
const zh: Dict = {
  aiLabel:'AstroVip AI', conciergeTitle:'AstroVip Concierge', close:'关闭',
  conciergeLead:'即时搜索 AstroVip 知识库：服务、技术、迁移占星、本命盘、太阳弧和案例研究。',
  searchPlaceholder:'例如：迁移占星如何帮助我？', search:'搜索', searching:'正在搜索 AstroVip…',
  noResult:'暂未找到足够相关的内容，请尝试更简短的问题。', source:'打开来源 →',
  unavailable:'搜索服务暂时不可用。', sourceNote:'显示的结果来自 AstroVip 的公开内容。'
};

const dictionaries: Record<string, Dict> = { ro, en, es, it, ru, ar, zh };

export function language(): string {
  const html = (document.documentElement.lang || 'ro').toLowerCase().split('-')[0];
  return dictionaries[html] ? html : 'ro';
}

export function t(key: string): string {
  const lang = language();
  return dictionaries[lang]?.[key] || ro[key] || key;
}

export function applyI18n(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-av-i18n]').forEach(node => {
    const key = node.dataset.avI18n || '';
    if (key) node.textContent = t(key);
  });
  root.querySelectorAll<HTMLInputElement>('[data-av-i18n-placeholder]').forEach(node => {
    const key = node.dataset.avI18nPlaceholder || '';
    if (key) node.placeholder = t(key);
  });
  document.documentElement.dir = language() === 'ar' ? 'rtl' : 'ltr';
}
