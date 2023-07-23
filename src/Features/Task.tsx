import React, { ChangeEvent, useCallback } from "react";
import { UpdateDomainTaskModelType } from "state/tasks-reducer";
import { Checkbox, IconButton } from "@material-ui/core";
import { EditableSpan } from "Components/EditableSpan";
import { Delete } from "@material-ui/icons";
import { TaskStatuses, TaskType } from "API/todolists-api";

type TaskPropsType = {
  task: TaskType;
  updateTask: (taskId: string, model: UpdateDomainTaskModelType) => void;
  removeTask: (taskId: string) => void;
};
export const Task = React.memo((props: TaskPropsType) => {
  const { task, updateTask, removeTask } = props;

  const checkboxHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateTask(task.id, { status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New });
    },
    [updateTask, task.id],
  );
  const onClickHandler = useCallback(() => {
    removeTask(task.id);
  }, [removeTask, task.id]);
  const onChangeTitleHandler = useCallback(
    (newTitle: string) => {
      updateTask(task.id, { title: newTitle });
    },
    [updateTask, task.id],
  );

  return (
    <div className={task.status === TaskStatuses.Completed ? "is-done" : "task"} key={task.id}>
      <Checkbox checked={task.status === TaskStatuses.Completed} onChange={checkboxHandler} />
      <EditableSpan title={task.title} onChange={onChangeTitleHandler} />
      <IconButton onClick={onClickHandler} aria-label="delete">
        <Delete />
      </IconButton>
    </div>
  );
});
