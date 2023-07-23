import React, { useCallback, useEffect } from "react";
import { AddItemForm } from "Components/AddItemForm/AddItemForm";
import { EditableSpan } from "Components/EditableSpan";
import { IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import { fetchTasksTC, UpdateDomainTaskModelType } from "state/tasks-reducer";
import { useAppDispatch } from "state/store";
import { FilterValuesType, TodolistDomainType } from "state/todolists-reducer";
import { TaskStatuses, TaskType } from "API/todolists-api";
import { Task } from "./Task";

type PropsType = {
  todolist: TodolistDomainType;
  // id: string
  // title: string
  tasks: TaskType[];
  removeTodolist: (todolistId: string) => void;
  changeTodolistTitle: (todolistId: string, title: string) => void;
  changeFilter: (todolistId: string, value: FilterValuesType) => void;
  // filter: FilterValueType
  addTask: (todolistId: string, title: string) => void;
  updateTask: (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) => void;
  removeTask: (todolistId: string, taskId: string) => void;
};
export const Todolist: React.FC<PropsType> = React.memo((props: PropsType) => {
  const { todolist, tasks, removeTodolist, changeTodolistTitle, changeFilter, addTask, updateTask, removeTask } = props;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTasksTC(todolist.id));
  }, [dispatch, todolist.id]);

  const onAllClickHandler = useCallback(() => {
    changeFilter(todolist.id, "all");
  }, [changeFilter, todolist.id]);
  const onActiveClickHandler = useCallback(() => {
    changeFilter(todolist.id, "active");
  }, [changeFilter, todolist.id]);
  const onCompletedClickHandler = useCallback(() => {
    changeFilter(todolist.id, "completed");
  }, [changeFilter, todolist.id]);

  const addTaskHandler = useCallback(
    (title: string) => {
      addTask(todolist.id, title);
    },
    [addTask, todolist.id],
  );
  const updateTaskHandler = useCallback(
    (taskId: string, model: UpdateDomainTaskModelType) => {
      updateTask(todolist.id, taskId, model);
    },
    [updateTask, todolist.id],
  );
  const removeTaskHandler = useCallback(
    (taskId: string) => {
      removeTask(todolist.id, taskId);
    },
    [removeTask, todolist.id],
  );
  const onChangeTodolistTitleHandler = useCallback(
    (newTitle: string) => {
      changeTodolistTitle(todolist.id, newTitle);
    },
    [changeTodolistTitle, todolist.id],
  );
  const removeTodolistHandler = () => {
    removeTodolist(todolist.id);
  };
  let tasksForTodolist = tasks;
  if (todolist.filter === "completed") {
    tasksForTodolist = tasksForTodolist.filter((t) => t.status === TaskStatuses.Completed);
  }
  if (todolist.filter === "active") {
    tasksForTodolist = tasksForTodolist.filter((t) => t.status === TaskStatuses.New);
  }

  return (
    <div>
      <h3>
        <EditableSpan title={todolist.title} onChange={onChangeTodolistTitleHandler} />
        <IconButton onClick={removeTodolistHandler} aria-label="delete" disabled={todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === "loading"} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task task={t} key={t.id} updateTask={updateTaskHandler} removeTask={removeTaskHandler} />
        ))}
      </div>
      <div>
        <Button variant={todolist.filter === "all" ? "contained" : "text"} onClick={onAllClickHandler}>
          All
        </Button>
        <Button
          variant={todolist.filter === "active" ? "contained" : "text"}
          color={"primary"}
          onClick={onActiveClickHandler}
        >
          Active
        </Button>
        <Button
          variant={todolist.filter === "completed" ? "contained" : "text"}
          color={"secondary"}
          onClick={onCompletedClickHandler}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
