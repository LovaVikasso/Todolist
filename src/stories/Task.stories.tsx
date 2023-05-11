import {action} from '@storybook/addon-actions'
import {Task} from "../Task";
import {Provider} from "react-redux";
import {store} from "../state/store";

export default {
    title: "Task Component",
    component: Task
}
const callback = action('Task')
export const TaskExample = (props: any) => {
    return <Provider store={store}>
        <Task task={{id: '1', title: 'Hi', isDone: false}} todolistId={"1"}/>
        <Task task={{id: '2', title: 'Hello', isDone: true}} todolistId={"2"}/>
    </Provider>
}