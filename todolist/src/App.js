import './App.css';

import {useState, useEffect} from "react";
import {BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from "react-icons/bs";

const API = "http://localhost:5000";

function App() {

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load todos on page load
  useEffect(() => {

    const loadData = async () => {
      setLoading(true);

      const response = await fetch(API + "/todos")
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => console.log(error));

      setLoading(false);
      setTodos(response);
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    }

    await fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) => [...prevState, todo]);

    setTitle("");
    setTime("");
  }

  if (loading) {
    return <p>Carregando...</p>
  }

  const handleEdit = async (todo) => {
    todo.done = !todo.done;
    const data = await fetch(API + "/todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) => 
      prevState.map((t) => (t.id === data.id ? (t = data): t))
    );
  };

  const handleDelete = async (id) => {
    await fetch(API + "/todos/" + id, {
      method: "DELETE"
    });

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id))
  }

  return (
    <div className="App">
      <div className="todo-header">
        <h1>React Todo List</h1>
      </div>
      <div className="todo-form">
        <h2>Insira sua próxima tarefa</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que você vai fazer?</label>
            <input 
              type="text"
              name="title"
              placeholder="Titulo da tarefa"
              onChange={(e) => setTitle(e.target.value)}
              value={title || ''}
              required
            ></input>

            <label htmlFor="time">Duração</label>
            <input
              type="text"
              name="time"
              placeholder="Tempo estimado (em horas)"
              onChange={(e) => setTime(e.target.value)}
              value={time || ""}
            ></input>
          </div>
          <input type="submit" value="Criar tarefa"></input>
        </form>
      </div>
      <div className="todo-list">
        <h2>lista de tarefas</h2>
        {todos.length === 0 && <p>Não há tarefas!</p>}
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time}</p>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck/> : <BsBookmarkCheckFill/>}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
