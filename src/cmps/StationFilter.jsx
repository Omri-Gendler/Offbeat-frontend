import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { SearchDropdown } from './SearchDropdown';
import { BrowseFilledIcon, BrowseOutlineIcon, SearchLensIcon } from './Icon';
import { useDebounce } from '../hooks/useDebounce';

export function StationFilter({ filterBy, setFilterBy }) { // filterBy/setFilterBy עשויים להיות מיותרים כעת
  const navigate = useNavigate();
  const location = useLocation();
  const { input } = useParams(); // 'input' הוא הפרמטר מה-URL, למשל "Rock"

  const [txt, setTxt] = useState(''); // State פנימי של תיבת הטקסט
  const debouncedSearchTerm = useDebounce(txt, 500); // מאזין לשינויים ב-txt
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem('recentSearches') || '[]')
  );
  const anchorRef = useRef(null);
  const isSearchActive = location.pathname.startsWith('/search');

  // אפקט לסגירת הדרופדאון בלחיצה בחוץ
  useEffect(() => {
    function onDocClick(ev) {
      if (!anchorRef.current?.contains(ev.target)) setIsOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // ✨ אפקט 1: סנכרן את תיבת הטקסט (txt) מהפרמטר ב-URL (input)
  useEffect(() => {
    const urlSearchTerm = input ? decodeURIComponent(input) : '';
    // עדכן את תיבת הטקסט רק אם היא לא כבר תואמת ל-URL
    if (urlSearchTerm !== txt) {
      console.log(`אפקט 1: מסנכרן את txt מה-URL: "${urlSearchTerm}"`); // Debug
      setTxt(urlSearchTerm);
    }
    // נקה את תיבת הטקסט אם עוזבים את עמוד החיפוש
    if (!isSearchActive && txt !== '') {
      console.log("אפקט 1: מנקה את txt כי יצאנו מעמוד החיפוש"); // Debug
      setTxt('');
    }
  }, [input, isSearchActive]); // הפעל כשהפרמטר ב-URL משתנה, או כשנכנסים/יוצאים מעמוד החיפוש

  // ✨ אפקט 2: נווט ל-URL חדש בהתבסס על הטקסט שהוקלד (עם debounce)
  useEffect(() => {
    // בצע ניווט אוטומטי רק אם אנחנו *כבר* בעמוד החיפוש
    if (!isSearchActive) {
      return;
    }

    const termFromDebounce = debouncedSearchTerm.trim();
    const termFromUrl = input ? decodeURIComponent(input).trim() : '';

    // נווט רק אם המשתמש הקליד משהו ששונה ממה שכבר נמצא ב-URL
    if (termFromDebounce !== termFromUrl) {
      const newPath = termFromDebounce ? `/search/${encodeURIComponent(termFromDebounce)}` : '/search';
      console.log(`אפקט 2: Debounce מפעיל ניווט אל: ${newPath}`); // Debug
      navigate(newPath, { replace: true });
    }

    // (אופציונלי: עדכון filterBy גלובלי, אם עדיין נחוץ)
    // setFilterBy(prev => ({ ...prev, txt: termFromDebounce }));

  }, [debouncedSearchTerm, isSearchActive, input, navigate]); // תלוי במונח המעוכב, מצב החיפוש, וה-URL הנוכחי

  // פונקציה זו רק מעדכנת את ה-State של תיבת הטקסט
  function handleChange(e) {
    setTxt(e.target.value);
  }

  // פונקציה זו רצה בלחיצת Enter (לניווט מיידי)
  function handleSubmit(e) {
    e.preventDefault();
    const term = txt.trim(); // משתמש ב-txt העדכני
    if (!term) return; // אל תנווט אם ריק

    const newPath = `/search/${encodeURIComponent(term)}`;
    // נווט רק אם היעד שונה מהנוכחי (למנוע ניווט מיותר אם ה-URL כבר נכון)
    if (location.pathname !== newPath) {
      console.log(`handleSubmit מנווט אל: ${newPath}`); // Debug
      navigate(newPath);
    } else {
      console.log(`handleSubmit: כבר ב-${newPath}, לא מנווט.`); // Debug
    }


    // שמירת החיפוש האחרון (נשאר זהה)
    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 8);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    setIsOpen(false); // סגור דרופדאון
  }

  function handlePick(term) {
    setTxt(term); // עדכן את תיבת הטקסט
    const newPath = `/search/${encodeURIComponent(term)}`;
    console.log(`handlePick מנווט אל: ${newPath}`); // Debug
    navigate(newPath); // נווט
    setIsOpen(false);
  }

  function handleClearRecent() {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  }

  return (
    <section className="station-filter">
      <form
        className="station-search-container"
        ref={anchorRef}
        onSubmit={handleSubmit}
        autoComplete="off"
        noValidate
      >
        <div className="station-search flex">
          <SearchLensIcon />
          <input
            className="station-filter-input"
            name="station-search"
            type="text"
            placeholder="What do you want to play?"
            value={txt} // קשור ל-State הפנימי 'txt'
            onChange={handleChange} // מעדכן רק את 'txt'
            onFocus={() => txt.trim().length === 0 && setIsOpen(true)}
          // ... (שאר המאפיינים) ...
          />

          <div className="browse">
            <button
              data-testid="browse-button"
              className="button"
              aria-label="Browse"
              data-encore-id="buttonTertiary"
              type="button"
              onClick={() => navigate(`/search`)} // כפתור זה תמיד מנווט ל-/search
            >
              {isSearchActive ? (
                <BrowseFilledIcon size={24} color="#fff" />
              ) : (
                <BrowseOutlineIcon size={24} color="#b3b3b3" />
              )}
            </button>
          </div>
        </div>

        <SearchDropdown
          isOpen={isOpen}
          recentSearches={recentSearches}
          onPick={handlePick}
          onClear={handleClearRecent}
        />
      </form>
    </section>
  );
}