import React, { ChangeEvent, useState } from "react";
import { TextField } from "@material-ui/core";

type PropsType = {
  title: string;
  onChange: (newValue: string) => void;
};

export const EditableSpan = React.memo((props: PropsType) => {
  let [editMode, setEditMode] = useState<boolean>(false);
  let [title, setTitle] = useState("");
  const activateEditMode = () => {
    setEditMode(true);
    setTitle(props.title);
  };
  const stopEditMode = () => {
    setEditMode(false);
    props.onChange(title);
  };
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };
  return editMode ? (
    <TextField onBlur={stopEditMode} value={title} onChange={onChangeHandler} autoFocus />
  ) : (
    <span onDoubleClick={activateEditMode}>{props.title}</span>
  );
});
