
import {action} from '@storybook/addon-actions'
import {EditableSpan} from "./EditableSpan";

export default {
    title: "EditableSpan Component",
    component: EditableSpan
}
const callback = action('DoubleClicked on a form')
export const EditableSpanExample = (props:any) => {
    return <EditableSpan title={"Example"} onChange={action}/>
}