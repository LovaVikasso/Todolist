import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import './AddItemForm.css';

type AddItemsProps = {
    addItem: (title: string) => void
    disabled?:boolean
}
export const AddItemForm = React.memo(({addItem, disabled = false}: AddItemsProps) => {
    const [title, setTitle] = useState('')
    const [error, setError] = useState('')

    const addItemHandler = () => {
        if (title.trim() !== "") {
            addItem(title.trim())
            setTitle("")
        } else {
            setError('Title is required')
        }
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
        setError('')
    }
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addItemHandler();
        }
    }
    return (
        <div className='AddItemForm'>
            <div>
                <TextField
                    variant={"outlined"}
                    label={'Type value'}
                    value={title}
                    onChange={onChangeHandler}
                    onKeyDown={onKeyDownHandler}
                    helperText={error }
                    error={!!error}/>
                <IconButton onClick={addItemHandler} disabled={disabled}>
                    <Add />
                </IconButton>
            </div>
        </div>
    );
})

