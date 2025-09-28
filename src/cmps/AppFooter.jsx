import { useSelector } from 'react-redux'

import ContinuousSlider from './Slider.jsx'

export function AppFooter() {
	const count = useSelector(storeState => storeState.userModule.count)

	return (
		<footer className="app-footer full">
			<ContinuousSlider />
			<p>Coffeeright, Liat & Omri &copy;  </p>
		</footer>
	)
}