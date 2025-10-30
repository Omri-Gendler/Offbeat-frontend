import { useSelector } from 'react-redux'
import { MusicPlayer } from './MusicPlayer.jsx'

export function AppFooter() {
	const station = useSelector(storeState => storeState.stationModule.station)

	return (
		<footer className="app-footer">
			<MusicPlayer station={station} />
		</footer>
	)
}