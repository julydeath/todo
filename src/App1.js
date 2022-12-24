import { DeleteIcon } from '@chakra-ui/icons';

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
} from '@chakra-ui/react';

import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState({
    id: null,
    status: false,
  });

  const toast = useToast();

  const handleDelete = async (id) => {
    setDeleting({ id, status: true });
    try {
      await axios.delete(`https://e9giinm1.directus.app/items/todos/${id}`);

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error({ error });
      toast({
        title: 'delete Todo Failed',
        position: 'top-right',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
    setDeleting({ id: null, status: false });
  };

  const handleChange = (e) => {
    setTask(e.target.value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setAdding(true);

    if (task === '') return null;

    try {
      const result = await axios.post(
        'https://e9giinm1.directus.app/items/todos',
        {
          task: task,
        },
      );

      setTodos((prev) => [...prev, result.data.data]);
    } catch (error) {
      toast({
        title: 'Adding Todo Failed',
        position: 'top-right',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }

    setTask('');
    setAdding(false);
  };

  useEffect(() => {
    const getTodos = async () => {
      try {
        const result = await axios.get(
          'https://e9giinm1.directus.app/items/todos',
        );
        setTodos(result.data.data);
      } catch (error) {
        setTodos([]);
        toast({
          title: error.message,
          position: 'top-right',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    };

    getTodos();
  }, [todos, toast]);

  return (
    <VStack>
      <Heading>Todo</Heading>
      <Spacer />

      <form onSubmit={(e) => handleClick(e)}>
        <HStack>
          <Input
            placeholder='enter todo'
            onChange={(e) => handleChange(e)}
            value={task}
          />
          <Button type='submit' isLoading={adding ? true : false}>
            Add
          </Button>
        </HStack>
      </form>
      <VStack width='20vw'>
        {todos.map((todo) => {
          return (
            <Card key={todo.id} direction='column' width='full' px='4' py='2'>
              <HStack justify='space-between' width='full'>
                <span>{todo.task}</span>
                <IconButton
                  icon={<DeleteIcon />}
                  onClick={() => handleDelete(todo.id)}
                  isRound={true}
                  colorScheme='red'
                  isLoading={todo.id === deleting.id ? true : false}
                />
              </HStack>
            </Card>
          );
        })}
      </VStack>
    </VStack>
  );
}

export default App;
