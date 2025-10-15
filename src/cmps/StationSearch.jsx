import { IconSearch16, IconClose24, SearchLensIcon } from "./Icon.jsx";

export function StationSearch({
  value = "",
  onChange,
  onClose,
  onSubmit,          // optional: handle submit if you want
  onClear,           // optional: handle clear if you want, else we'll just onChange("")
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      if (value) onClear ? onClear() : onChange("");
      else onClose?.();
    }
  };

  return (
    <section className="song-list-search">
      <div className="song-list-search-search-pre ">
        <h2
          className="e-91000-text encore-text-title-small station-search-title"
          data-encore-id="text"
          id="station-search-title"
        >
          {"Let's find something for your playlist"}
        </h2>

        <form
          className="station-search-input-container"
          role="search"
          aria-labelledby="station-search-title"
          onSubmit={handleSubmit}
        >
       

          <input
            id="station-search-input"
            className="e-91000-text encore-text-body-small station-search-input"
            data-encore-id="text"
            type="search"
            maxLength={90}
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="Search for songs"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <div className="search-icon-container" aria-hidden="true">
            <span className="search-icon">
              <SearchLensIcon/>
            </span>
          </div>

          {/* optional clear button if there's text */}
          {value && (
            <button
              type="button"
              className="clear-btn"
              aria-label="Clear search"
              onClick={() => (onClear ? onClear() : onChange(""))}
            >
              <IconClose24 />
            </button>
          )}
        </form>
      </div>

      {/* <button
        type="button"
        className="close-icon-btn"
        onClick={onClose}
        aria-label="Close"
      >
        <IconClose24 />
      </button> */}
    </section>
  )
}
