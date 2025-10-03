export function SongPreview({ song }) {
    return (
        <section className="song-preview flex">
            <img className="song-img-preview" src={song.imgUrl} alt="song cover" />
            <h5>{song.title}</h5>
        </section>
    )
}