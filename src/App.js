import { DeleteIcon } from "@chakra-ui/icons";

import {
  Button,
  Heading,
  HStack,
  IconButton,
  Input,
  Spacer,
  VStack,
  useToast,
  Card,
} from "@chakra-ui/react";
import axios from "axios";

import { useState, useEffect } from "react";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  const toast = useToast();

  const addTodo = (e) => {
    e.preventDefault();

    const addTodos = async () => {
      try {
        const result = await axios.post(
          "https://d6t2vunx.directus.app/items/todos",
          {
            task: task,
          }
        );
        setTodos((prev) => [...prev, result.data.data]);
      } catch (error) {
        console.log(error.message);
        toast({
          title: "Adding Todo Failed",
          position: "top-right",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    addTodos();

    setTask("");
  };

  const handleDelete = (id) => {
    const deleteTodo = async () => {
      try {
        await axios.delete(`https://d6t2vunx.directus.app/items/todos/${id}`);
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      } catch (error) {
        console.log(error.message);
        toast({
          title: "delete Todo Failed",
          position: "top-right",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    deleteTodo();
  };

  useEffect(() => {
    const getTodos = async () => {
      try {
        const result = await axios.get(
          "https://d6t2vunx.directus.app/items/todos"
        );

        setTodos(result.data.data);
      } catch (error) {
        console.log(error.message);
        toast({
          title: error.message,
          position: "top-right",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setTodos([]);
      }
    };

    getTodos();
  }, [toast]);

  return (
    <VStack>
      <Heading>Todo</Heading>
      <Spacer />

      <form onSubmit={(e) => addTodo(e)}>
        <HStack>
          <Input
            placeholder="enter todo"
            onChange={(e) => setTask(e.target.value)}
            value={task}
          />
          <Button type="submit">Add</Button>
        </HStack>
      </form>
      <VStack width="20vw">
        {/* {todos.map(({ task, id }) => (
          <IndividualTodo task={task} key={id} />
        ))} */}

        {todos.map((todo) => (
          <Card direction="column" width="full" px="4" py="2" key={todo.id}>
            <HStack justify="space-between" width="full">
              <span>{todo.task}</span>
              <IconButton
                icon={<DeleteIcon />}
                isRound={true}
                colorScheme="red"
                onClick={() => handleDelete(todo.id)}
              />
            </HStack>
          </Card>
        ))}
      </VStack>
    </VStack>
  );
}

export default App;
