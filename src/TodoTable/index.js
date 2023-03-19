import TodoItem from '../TodoItem'
import './index.css'

const TodoTable =props=>{
    const{todoList,getUserDetails}=props
    return(
    <table className='todo-table'>
       <tbody>
        <tr>
            <th className='todo-id'>ToDo ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
        {todoList.map(eachTodo=><TodoItem key={eachTodo.id} eachTodo={eachTodo} getUserDetails={getUserDetails} />)}
        </tbody>
    </table>)
}

export default TodoTable