import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { useForm, Controller } from 'react-hook-form';
import {
  Container,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  CircularProgress,
  Box,
  Fab,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

type Item = {
  id: bigint;
  text: string;
  completed: boolean;
};

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { control, handleSubmit, reset } = useForm();

  const fetchItems = async () => {
    try {
      const result = await backend.getItems();
      setItems(result);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const onSubmit = async (data: { newItem: string }) => {
    setLoading(true);
    try {
      await backend.addItem(data.newItem);
      reset({ newItem: '' });
      await fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.markItemComplete(id);
      await fetchItems();
    } catch (error) {
      console.error('Error marking item complete:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.deleteItem(id);
      await fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping List
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" alignItems="center" mb={2}>
          <Controller
            name="newItem"
            control={control}
            defaultValue=""
            rules={{ required: 'Item is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Add new item"
                variant="outlined"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Fab
            color="primary"
            aria-label="add"
            type="submit"
            size="small"
            sx={{ ml: 1 }}
          >
            <AddIcon />
          </Fab>
        </Box>
      </form>
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {items.map((item) => (
            <ListItem key={Number(item.id)} dense>
              <Checkbox
                edge="start"
                checked={item.completed}
                onChange={() => handleToggleComplete(item.id)}
              />
              <ListItemText
                primary={item.text}
                style={{
                  textDecoration: item.completed ? 'line-through' : 'none',
                }}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default App;
