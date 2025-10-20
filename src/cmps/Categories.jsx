import { useNavigate } from 'react-router-dom'

export function Categories() {

  const navigate = useNavigate()

  const categories = [
    { name: 'Pop', imgUrl: 'https://picsum.photos/300/300?random=1' },
    { name: 'Rock', imgUrl: 'https://picsum.photos/300/300?random=2' },
    { name: 'Hip-Hop', imgUrl: 'https://picsum.photos/300/300?random=3' },
    { name: 'Chill', imgUrl: 'https://picsum.photos/300/300?random=4' },
    { name: 'Workout', imgUrl: 'https://picsum.photos/300/300?random=5' },
    { name: 'Indie', imgUrl: 'https://picsum.photos/300/300?random=6' },
  ]



  const onClickGenre = (genre) => {

    console.log('genre', genre.target.innerText)
    switch (genre.target.innerText) {
      case 'Pop':
        navigate('/browser/Pop')
        console.log('Selected genre: Pop')
        break
      case 'Rock':
        navigate('/browser/Rock')
        console.log('Selected genre: Rock')
        break
      case 'Hip-Hop':
        navigate('/browser/Hip-Hop')
        console.log('Selected genre: Hip-Hop')
        break
      case 'Chill':
        navigate('/browser/Chill')
        console.log('Selected genre: Chill')
        break
      case 'Workout':
        navigate('/browser/Workout')
        console.log('Selected genre: Workout')
        break
      case 'Indie':
        navigate('/browser/Indie')
        console.log('Selected genre: Indie')
        break
      default:
        break

    }
  }

  return (
    <section className="categories">
      <h2>Browse All</h2>
      <ul className="category-grid clean-list ">
        {categories.map(cat => (
          <li
            key={cat.name}
            className="category-item"
            onClick={onClickGenre}
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
