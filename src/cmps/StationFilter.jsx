import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';


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

    return (
        <section className="station-filter">
            <Stack spacing={2} sx={{ width: 300 }}>
                <Autocomplete
                    freeSolo
                    id='search-input'
                    className='search-input'
                    disableClearable
                    options={[]}
                    onInputChange={(event, newInputValue) => {
                        setFilterToEdit({ ...filterToEdit, txt: newInputValue });
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '25px',
                            '& fieldset': {
                                borderColor: 'var(--clr5)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'var(--clr4)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'var(--clr4)',
                            },
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: 'white',
                            opacity: 0.7,
                        },
                        '& .MuiSvgIcon-root': {
                            color: 'white',
                        },
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder='What do you want to play?'
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
            </Stack>
        </section>
    )
}