import { useSelector } from 'react-redux'
import { MusicPlayer } from './MusicPlayer'

export function AppFooter() {
	const count = useSelector(storeState => storeState.userModule.count)

	return (
		<footer className="app-footer full">
			<MusicPlayer />
		</footer>
	)
}