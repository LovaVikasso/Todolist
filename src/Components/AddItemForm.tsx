import React, {ChangeEvent, KeyboardEvent, useState} from 'react';

type AddItemsProps = {
    addItem: (title: string) => void

}

export const AddItemForm = (props:AddItemsProps) => {
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
                <input value={title}
                onChange={onChangeHandler}
                onKeyDown={onKeyDownHandler}
                className={error && "error"}/>
                <button onClick={addItem}>+</button>
                 {error && <p className="error-message">Title is required</p>}
            </div>
        </div>
    );
};

