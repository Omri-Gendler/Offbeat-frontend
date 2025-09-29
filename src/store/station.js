// Guidlines:
// *. currently no better API than youtube...
// *. no need for song store, it is part of the station

// Pages, Cmps:
// HomePage render 2 stations => link StationDetails
// Add station
// AppPlayer (initially rendered at StationDetails, later in footer)
//   Smart component - connected to store:
//   -. stationModule.currentlyPlayingUrl
//   -. stationModule.dispatch(nextSong)
// Filtering
// StationList, StationPreview
// StationDetails - Make it amazing
// D & D Later....

const img = '/img/infected.jpg'

export const stations = [
	{
		_id: 'station001',
		name: '80s Rock Anthems',
		tags: ['Rock', '80s', 'Classic'],
		imgUrl: img,
		createdBy: {
			_id: 'u102',
			fullname: 'Muki Levi',
		},
		likedByUsers: ['u101', 'u103'],
		songs: [
			{
				id: 'lDK9QqIzhwk',
				title: "Bon Jovi - Livin' On A Prayer",
				url: 'youtube/song.mp4',
				imgUrl: 'https://i.ytimg.com/vi/lDK9QqIzhwk/mqdefault.jpg',
				addedBy: 'u102',
				likedBy: ['u101'],
				addedAt: 162521765262,
			},
			{
				id: '1w7OgIMMRc4',
				title: "Guns N' Roses - Sweet Child O' Mine",
				url: 'youtube/song.mp4',
				imgUrl: 'https://i.ytimg.com/vi/1w7OgIMMRc4/mqdefault.jpg',
				addedBy: 'u101',
				likedBy: [],
				addedAt: 162531765262,
			},
		],
		msgs: [{ id: 'm201', from: 'u103', txt: 'Classic!' }],
	},
	{
		_id: 'station002',
		name: 'Chill Lo-Fi Beats',
		tags: ['Lo-Fi', 'Chill', 'Study'],
		imgUrl: img,

		createdBy: {
			_id: 'u103',
			fullname: 'Shuki Cohen',
			imgUrl: 'http://some-photo/shuki.jpg',
		},
		likedByUsers: ['u102', 'u104'],
		songs: [
			{
				id: '5AEbq6XbSO0',
				title: 'lofi hip hop radio - beats to relax/study to',
				url: 'youtube/song.mp4',
				imgUrl: 'https://i.ytimg.com/vi/5AEbq6XbSO0/mqdefault.jpg',
				addedBy: 'u103',
				likedBy: ['u102', 'u104'],
				addedAt: 162541765262,
			},
			{
				id: 'DWcJFNfaw9c',
				title: 'Affection - Jinsang',
				url: 'youtube/song.mp4',
				imgUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/mqdefault.jpg',
				addedBy: 'u103',
				likedBy: [],
				addedAt: 162551765262,
			},
		],
		msgs: [],
	},
	{
		_id: 'station003',
		name: '90s Hip Hop Classics',
		tags: ['Hip Hop', '90s', 'Rap'],
		imgUrl: img,

		createdBy: {
			_id: 'u101',
			fullname: 'Puki Ben David',
			imgUrl: 'http://some-photo/puki.jpg',
		},
		likedByUsers: ['u102', 'u103', 'u104'],
		songs: [
			{
				id: 'QZXc39sg300',
				title: "The Notorious B.I.G. - Juicy",
				url: 'youtube/song.mp4',
				imgUrl: 'https://i.ytimg.com/vi/QZXc39sg300/mqdefault.jpg',
				addedBy: 'u101',
				likedBy: ['u102'],
				addedAt: 162561765262,
			},
			{
				id: 'U_IbIMU_f8c',
				title: '2Pac - California Love',
				url: 'youtube/song.mp4',
				imgUrl: 'https://i.ytimg.com/vi/U_IbIMU_f8c/mqdefault.jpg',
				addedBy: 'u104',
				likedBy: ['u103'],
				addedAt: 162571765262,
			},
		],
		msgs: [{ id: 'm202', from: 'u102', txt: 'The golden age!' }],
	},
	{
		_id: 'station004',
		name: 'Indie Folk & Acoustic',
		tags: ['Indie', 'Folk', 'Acoustic'],
		imgUrl: img,

		createdBy: {
			_id: 'u104',
			fullname: 'Anna Popova',
			imgUrl: 'http://some-photo/anna.jpg',
		},
		likedByUsers: ['u101'],
		songs: [
			{
				id: '3aF9AJm0RFc',
				title: 'Bon Iver - Holocene',
				url: 'youtube/song.mp4',
				imgUrl: 'https://i.ytimg.com/vi/3aF9AJm0RFc/mqdefault.jpg',
				addedBy: 'u104',
				likedBy: ['u101'],
				addedAt: 162581765262,
			},
			{
				id: '6k8cpuklA5s',
				title: 'The Lumineers - Ho Hey',
				url: 'youtube/song.mp4',
				imgUrl: 'https://i.ytimg.com/vi/6k8cpuklA5s/mqdefault.jpg',
				addedBy: 'u104',
				likedBy: [],
				addedAt: 162591765262,
			},
		],
		msgs: [],
	},
	{
		_id: 'station005',
		name: 'Electronic Dance Party',
		tags: ['Electronic', 'Dance', 'Party'],
		imgUrl: img,

		createdBy: {
			_id: 'u102',
			fullname: 'Muki Levi',
			imgUrl: 'http://some-photo/muki.jpg',
		},
		likedByUsers: ['u103'],
		songs: [
			{
				id: 'YqeW9_5kURI',
				title: 'Daft Punk - One More Time',
				url: 'youtube/song.mp4',
				imgUrl: 'https://i.ytimg.com/vi/YqeW9_5kURI/mqdefault.jpg',
				addedBy: 'u102',
				likedBy: ['u103'],
				addedAt: 162601765262,
			},
			{
				id: 'IxxstCcJlsc',
				title: 'Avicii - Levels',
				url: 'youtube/song.mp4',
				imgUrl: 'https://i.ytimg.com/vi/IxxstCcJlsc/mqdefault.jpg',
				addedBy: 'u102',
				likedBy: [],
				addedAt: 162611765262,
			},
		],
		msgs: [],
	},
	{
		_id: 'station006',
		name: 'Classic Jazz Lounge',
		tags: ['Jazz', 'Classic', 'Lounge'],
		imgUrl: img,

		createdBy: {
			_id: 'u101',
			fullname: 'Puki Ben David',
			imgUrl: 'http://some-photo/puki.jpg',
		},
		likedByUsers: ['u104'],
		songs: [
			{
				id: 'vmDDOaTupAE',
				title: 'Miles Davis - So What',
				url: 'youtube/song.mp4',
				imgUrl: 'https://i.ytimg.com/vi/vmDDOaTupAE/mqdefault.jpg',
				addedBy: 'u101',
				likedBy: ['u104'],
				addedAt: 162621765262,
			},
			{
				id: '3jWRrafhO7M',
				title: 'John Coltrane - My Favorite Things',
				url: 'youtube/song.mp4',
				imgUrl: 'https://i.ytimg.com/vi/3jWRrafhO7M/mqdefault.jpg',
				addedBy: 'u101',
				likedBy: [],
				addedAt: 162631765262,
			},
		],
		msgs: [],
	},
	{
		_id: 'station007',
		name: 'Reggae Vibes',
		tags: ['Reggae', 'Vibes', 'Chill'],
		imgUrl: img,

		createdBy: {
			_id: 'u103',
			fullname: 'Shuki Cohen',
			imgUrl: 'http://some-photo/shuki.jpg',
		},
		likedByUsers: ['u101', 'u102'],
		songs: [
			{
				id: 'LanCLS_hIo4',
				title: 'Bob Marley - Three Little Birds',
				url: 'youtube/song.mp4',
				imgUrl: 'https://i.ytimg.com/vi/LanCLS_hIo4/mqdefault.jpg',
				addedBy: 'u103',
				likedBy: ['u101', 'u102'],
				addedAt: 162641765262,
			},
			{
				id: 'CVGlY2m_ciM',
				title: 'Damian Marley - Welcome To Jamrock',
				url: 'youtube/song.mp4',
				imgUrl: 'https://i.ytimg.com/vi/CVGlY2m_ciM/mqdefault.jpg',
				addedBy: 'u103',
				likedBy: [],
				addedAt: 162651765262,

			},
		],
		msgs: [{ id: 'm203', from: 'u102', txt: 'Feel the rhythm!' }],
	},
]
// function isLikedByUser(songId){}
