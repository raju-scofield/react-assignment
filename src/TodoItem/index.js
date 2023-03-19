import './index.css'

const TodoItem=props=>{
    const{eachTodo,getUserDetails}=props
    const{userId,id,title,completed}=eachTodo

    const onClickViewUserButton=()=>{
        getUserDetails(userId,id,title)
    }

    return(<tr>
        <td>{id}</td>
        <td>{title}</td>
        <td>{completed}</td>
        <td><button type="button" className='user-button' onClick={onClickViewUserButton}>View User</button></td>
    </tr>)
}

export default TodoItem