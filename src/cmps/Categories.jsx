import { useNavigate } from 'react-router-dom'

export function Categories({ onClickCategory }) {

  const navigate = useNavigate()

  const categories = [
    { name: 'Music', imgUrl: 'https://i.scdn.co/image/ab67706f00000002724554ed6bed6f051d9b0bfc', color: '#e1118c' },
    { name: 'Podcasts', imgUrl: 'https://i.scdn.co/image/ab6765630000ba8a81f07e1ead0317ee3c285bfa', color: '#27856a' },
    { name: 'Live Events', imgUrl: 'https://concerts.spotify.com/images/live-events_category-image.jpg', color: '#7358ff' },
    { name: 'Made For You', imgUrl: 'https://i.scdn.co/image/ab67706f00000002724554ed6bed6f051d9b0bfc', color: '#1e3264' },
    { name: 'New Releases', imgUrl: 'https://i.scdn.co/image/ab67706f00000002724554ed6bed6f051d9b0bfc', color: '#8d67ab' },
    { name: 'Pop', imgUrl: 'https://i.scdn.co/image/ab67706f00000002724554ed6bed6f051d9b0bfc', color: '#148a08' },
    { name: 'Hip-Hop', imgUrl: 'https://i.scdn.co/image/ab6765630000ba8a81f07e1ead0317ee3c285bfa', color: '#ba5d07' },
    { name: 'Rock', imgUrl: 'https://i.scdn.co/image/ab67706f00000002724554ed6bed6f051d9b0bfc', color: '#e8115b' },
    { name: 'Latin', imgUrl: 'https://i.scdn.co/image/ab6765630000ba8a81f07e1ead0317ee3c285bfa', color: '#0d72ea' },
    { name: 'Charts', imgUrl: 'https://charts-images.scdn.co/assets/locale_en/regional/weekly/region_global_default.jpg', color: '#8d67ab' },
    { name: 'Podcast Charts', imgUrl: 'https://i.scdn.co/image/ab6765630000ba8a81f07e1ead0317ee3c285bfa', color: '#0d73ec' },
    { name: 'Educational', imgUrl: 'https://i.scdn.co/image/ab6765630000ba8a81f07e1ead0317ee3c285bfa', color: '#27856a' },
    { name: 'Documentary', imgUrl: 'https://i.scdn.co/image/ab6765630000ba8a81f07e1ead0317ee3c285bfa', color: '#777777' },
    { name: 'Comedy', imgUrl: 'https://i.scdn.co/image/ab6765630000ba8a81f07e1ead0317ee3c285bfa', color: '#c49bc8' },
    { name: 'Dance/Electronic', imgUrl: 'https://i.scdn.co/image/ab67706f00000002724554ed6bed6f051d9b0bfc', color: '#1db954' },
    { name: 'Mood', imgUrl: 'https://i.scdn.co/image/ab67706f00000002724554ed6bed6f051d9b0bfc', color: '#e1118c' },
    { name: 'Indie', imgUrl: 'https://i.scdn.co/image/ab67706f00000002724554ed6bed6f051d9b0bfc', color: '#e13300' },
    { name: 'Workout', imgUrl: 'https://i.scdn.co/image/ab67706f00000002724554ed6bed6f051d9b0bfc', color: '#777777' },
    { name: 'Discover', imgUrl: 'https://i.scdn.co/image/ab67706f00000002724554ed6bed6f051d9b0bfc', color: '#8d67ab' },
    { name: 'Country', imgUrl: 'https://i.scdn.co/image/ab67706f00000002724554ed6bed6f051d9b0bfc', color: '#e8115b' },
  ]


  return (
    <section className="categories">
      <h2>Browse all</h2>
      <div className="category-grid">
        {categories.map(cat => (
          <div
            key={cat.name}
            className="category-item"
            onClick={() => onClickCategory(cat.name)}
            style={{ backgroundColor: cat.color }}
          >
            <h3 className="category-title">{cat.name}</h3>
            <div className="category-image">
              <img src={cat.imgUrl} alt={cat.name} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
