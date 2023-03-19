import {useState,useEffect} from 'react'
import {BsSearch} from'react-icons/bs'
import {ThreeDots} from 'react-loader-spinner'
import TodoTable from '../TodoTable'
import './index.css'


const apiStatusConstants={
    initial:"INITIAL",
    inProgress:"IN_PROGRESS",
    success:"SUCCESS",
    failure:"FAILURE"
}
const TodoApplication =()=>{

    const[searchKeyWord,setSearchKeyword]=useState('')
    const[todoList,setTodoList]=useState([])
    const[userDetails,setUserDetails]=useState(null)
    const[apiStatus,setApiStatus]=useState(apiStatusConstants.initial)
    const[userApiStatus,setUserApiStatus]=useState(apiStatusConstants.initial)
    const[showuserDetails,toggleuserDetails]=useState(false)

    //Tracking Search Input
    const onChangeSearchInput =(event)=>{
        if(event.target.value===''){
            getTodosData()
        }
        setSearchKeyword(event.target.value.toLowerCase())
    }

    //On Hitting Search
    const onSearchHit=(event)=>{
        if(event.key==="Enter"){
            const filteredTodoList = todoList.filter(eachTodo=>{
                if(eachTodo.userId.toString().includes(searchKeyWord) || eachTodo.completed.toLowerCase().includes(searchKeyWord) || eachTodo.id.toString().includes(searchKeyWord) || eachTodo.title.toLowerCase().includes(searchKeyWord)){
                    return eachTodo
                }
                return ''
            })
            setTodoList(filteredTodoList)
        }
    }

    //GET Todos Data from API
    const getTodosData = async()=>{
        setApiStatus(apiStatusConstants.inProgress)
        const url="https://jsonplaceholder.typicode.com/todos"
        try{
            const response = await fetch(url)
                const data = await response.json()
                const updatedData=data.map(eachTodo=>{
                    if(eachTodo.completed){
                        return({...eachTodo,completed:"Complete"})
                    }
                    return ({...eachTodo,completed:"Incomplete"})
                })
                setUserDetails(null)
                setApiStatus(apiStatusConstants.success)
                setTodoList(updatedData)
                toggleuserDetails(false)
                
        }
        catch(error){
            setApiStatus(apiStatusConstants.failure)
            console.log(`Todos API Error: ${error}`)
        }
        
        }

    //GET User Data From API
    const getUserDetails=async(id,todoId,title)=>{
        setUserApiStatus(apiStatusConstants.inProgress)
        const url=`https://jsonplaceholder.typicode.com/users/${id}`
        try{
            const response = await fetch(url)
            const data = await response.json() 
            toggleuserDetails(true)
            setUserDetails({...data,todoId,title}) 
            setUserApiStatus(apiStatusConstants.success)
        }
        catch(error){
            console.log(`User Details API Error: ${error}`)
            setUserApiStatus(apiStatusConstants.failure)
            toggleuserDetails(true)
        }
    }

    //Render User Details Function
    const renderuserDetails=()=>{
        if(showuserDetails && !userDetails){
            return renderFailureView()
        }
        const{id,todoId,title, name, email}=userDetails
        console.log(userApiStatus)
        return(
        <div className='user-details-container'>
            <h1 className='user-details-heading'>User Details</h1>
            <table className='user-details-table'>
                {userApiStatus===apiStatusConstants.failure ? renderFailureView() : <tbody>
                    <tr><td>ToDo ID</td> <td>{todoId}</td></tr>
                    <tr><td>ToDo Title</td> <td>{title}</td></tr>
                    <tr><td>User ID</td><td>{id}</td></tr>
                    <tr><td>Name</td><td>{name}</td></tr>
                    <tr><td>Email</td><td>{email}</td></tr>
                </tbody>
                 }

            </table>
        </div>)
    }

    const renderTable=()=>(
        <div className='table-container'>
            <div className='table-header-container'>
                <h1 className='todos-heading'>Todos</h1>
                <div className='input-container'>
                    <BsSearch />
                    <input type="search" onChange={onChangeSearchInput} onKeyDown={onSearchHit} placeholder='Search' className='input-element' />
                </div>
            </div>
        <TodoTable todoList={todoList} getUserDetails={getUserDetails}  />
        {todoList.length===0 ? renderNotFound() : ''}
        </div>
    )

    //Loading View
    const renderLoadingView=()=>(
        <div className='loader-container'>
            <ThreeDots color="#808080" height="50" width="50" />
        </div>
    )

    const renderFailureView =()=>(<div className='failure-view'>
        <h1>Oops! Something Went Wrong</h1>
    </div>)

    const renderNotFound =()=>(
        <div className='not-found-container'>
            <h1>No ToDos Found</h1>
        </div>
    )

    //On Component Mount
    useEffect(()=>{
        getTodosData()
    },[])

    const switchRenderView =()=>{
        switch(apiStatus){
            case apiStatusConstants.inProgress:
                return renderLoadingView()
            case apiStatusConstants.failure:
                return renderFailureView()
            case apiStatusConstants.success:
                return renderTable()
            default:
                return null
        }
    }

    return(<div className='bg-container'>
        {switchRenderView()}
        {showuserDetails && renderuserDetails()}
    </div>)
}

export default TodoApplication