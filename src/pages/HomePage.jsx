// import MusicPlayerSlider from '../cmps/MusicPlayer.jsx'
import { StationIndex } from './StationIndex.jsx'

export function HomePage() {
    return (
        <section className="home">
            {/* <MusicPlayerSlider /> */}
            <div>
              <h2>stations</h2>
              <StationIndex/>
            </div>
        </section >
    )
}

