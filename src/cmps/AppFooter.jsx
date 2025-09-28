import { useSelector } from 'react-redux'

export function AppFooter() {
	const count = useSelector(storeState => storeState.userModule.count)

	return (
		<footer className="app-footer full">
			<p>Coffeeright, Liat & Omri &copy;  </p>
		</footer>
	)
}