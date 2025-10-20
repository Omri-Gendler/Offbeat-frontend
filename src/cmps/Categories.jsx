import { useNavigate } from 'react-router-dom'

export function Categories({ onClickCategory }) {

  const navigate = useNavigate()

  const categories = [
    { name: 'Pop', imgUrl: 'https://picsum.photos/300/300?random=1' },
    { name: 'Rock', imgUrl: 'https://picsum.photos/300/300?random=2' },
    { name: 'Hip-Hop', imgUrl: 'https://picsum.photos/300/300?random=3' },
    { name: 'Chill', imgUrl: 'https://picsum.photos/300/300?random=4' },
    { name: 'Workout', imgUrl: 'https://picsum.photos/300/300?random=5' },
    { name: 'Indie', imgUrl: 'https://picsum.photos/300/300?random=6' },
  ]


  return (
    <section className="categories">
      <h2>Browse All</h2>
      <ul className="category-grid clean-list">
        {categories.map(cat => (
          <li
            key={cat.name}
            className="category-item"
            onClick={() => onClickCategory(cat.name)}
            style={{ cursor: 'pointer' }}
          >
            <div className="category-cover">
              <img src={cat.imgUrl} alt={cat.name} />
              <h3>{cat.name}</h3>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
