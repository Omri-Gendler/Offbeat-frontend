import { useState } from 'react'
import{uploadService} from '../services/upload.service'

export function SongPreview({ song}) {

    return (
        <section className="song-preview flex">
            {<img className="song-img" src={song.imgUrl} alt="" />}
            <h5>{song.title}</h5>
        </section>
    )
}