import { IconSearch16, IconClose24, SearchLensIcon } from "./Icon.jsx";

export function StationSearch({
  value = "",
  onChange,
  onClose,      
  onClear,           
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
      <div className="song-list-search-pre ">
        <h2
          className="e-91000-text encore-text-title-small station-search-title"
          data-encore-id="text"
          id="station-search-title"
        >
          {"Let's find something for your playlist"}
        </h2>

        <div
          className="station-search-input-container"
          role="search"
          aria-labelledby="station-search-title"
        >
       

          <input
            id="station-search-input"
            className="e-91000-text encore-text-body-small station-search-input"
            data-encore-id="text"
            type="search"
            maxLength={80}
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="Search for songs"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <div className="search-icon-container flex" aria-hidden="true">
            <span className="search-icon">
              <SearchLensIcon/>
            </span>
          </div>

        </div>
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
