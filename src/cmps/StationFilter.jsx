import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';


export function StationFilter({ filterBy, setFilterBy }) {
    const [filterToEdit, setFilterToEdit] = useState(structuredClone(filterBy))

    useEffect(() => {
        setFilterBy(filterToEdit)
    }, [filterToEdit])

    function handleChange(ev) {
        const type = ev.target.type
        const field = ev.target.name
        let value

        switch (type) {
            case 'text':
            case 'radio':
                value = field === 'sortDir' ? +ev.target.value : ev.target.value
                if (!filterToEdit.sortDir) filterToEdit.sortDir = 1
                break
            case 'number':
                value = +ev.target.value || ''
                break
        }
        setFilterToEdit({ ...filterToEdit, [field]: value })
    }

    // function clearFilter() {
    //     setFilterToEdit({ ...filterToEdit, txt: '' })
    // }

    // function clearSort() {
    //     setFilterToEdit({ ...filterToEdit, sortField: '', sortDir: '' })
    // }

    return <section className="station-filter">
        <Stack spacing={2} sx={{ width: 300, borderRadius: '255px' }}>
            <Autocomplete
                freeSolo
                id='search-input'
                className='search-input'
                disableClearable
                options={[]}
                onInputChange={(event, newInputValue) => {
                    setFilterToEdit({ ...filterToEdit, txt: newInputValue })
                }}
                renderInput={(params) => (
                    <TextField sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '25px',
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover fieldset': {
                                borderColor: 'white',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'var(--clr4)',
                            },
                        },
                    }} {...params}
                        label={<SearchIcon />}
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                        }}
                    />
                )}
            />
        </Stack>
    </section >
}