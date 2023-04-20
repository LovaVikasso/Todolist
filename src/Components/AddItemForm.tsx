import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from "@material-ui/core";
import {Add} from "@material-ui/icons";


type AddItemsProps = {
    addItem: (title: string) => void

}

export const AddItemForm = (props: AddItemsProps) => {
    const [title, setTitle] = useState('')
    const [error, setError] = useState('')
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
        setError('')
    }
    const addItem = () => {
        if (title.trim() !== "") {
            props.addItem(title.trim())
            setTitle("")
        } else {
            setError('Title is required')
        }
    }
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addItem();
        }
    }
    return (
        <div>
            <div>
                <TextField
                    variant={"outlined"}
                    label={'Type value'}
                    value={title}
                    onChange={onChangeHandler}
                    onKeyDown={onKeyDownHandler}
                    helperText={error }
                    error={!!error}/>
                <IconButton onClick={addItem}>
                    <Add />
                </IconButton>
            </div>
        </div>
    );
};

