import { useSelector } from 'react-redux'
import { MusicPlayer } from './MusicPlayer'

export function AppFooter() {
	const station = useSelector(storeState => storeState.stationModule.station)

	return (
		<footer className="app-footer full">
			<MusicPlayer station={station} />
		</footer>
	)
}