/**
 * Normalizes Arabic text so that searching is forgiving of the spelling variants users actually
 * type. Without this, a plain `includes` misses obvious matches — searching "الاعلام" would not
 * find "الإعلام", and "مديريه" would not find "مديرية".
 *
 * Applied to both the query and the text being searched.
 */
export function normalizeArabic(value: string | null | undefined): string {
  if (!value) {
    return '';
  }

  return (
    value
      .toLowerCase()
      // tashkeel (harakat) and the superscript alef
      .replace(/[ً-ْٰ]/g, '')
      // tatweel — a decorative stretch that carries no meaning
      .replace(/ـ/g, '')
      // alef variants
      .replace(/[آأإٱ]/g, 'ا')
      // alef maqsura -> yaa
      .replace(/ى/g, 'ي')
      // taa marbuta -> haa
      .replace(/ة/g, 'ه')
      // hamza carriers
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      // Arabic-Indic digits -> ASCII, so "١٢" matches "12"
      .replace(/[٠-٩]/g, (d) =>
        String(d.charCodeAt(0) - 0x0660)
      )
      .replace(/[۰-۹]/g, (d) =>
        String(d.charCodeAt(0) - 0x06f0)
      )
      // collapse whitespace
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * True when every whitespace-separated token of `query` appears somewhere in `haystack`.
 * Token-based rather than substring-based so word order does not matter: "الشمال مديرية" still
 * matches "مديرية الشمال".
 */
export function matchesArabicSearch(
  query: string,
  ...haystack: (string | null | undefined)[]
): boolean {
  const normalizedQuery = normalizeArabic(query);

  if (!normalizedQuery) {
    return true;
  }

  const target = haystack.map(normalizeArabic).join(' ');

  return normalizedQuery
    .split(' ')
    .every((token) => target.includes(token));
}
