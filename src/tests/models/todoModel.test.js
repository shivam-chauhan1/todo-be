const Todo = require('../../models/todoModel');
const pool = require('../../db');

jest.mock('../../db', () => ({
  query: jest.fn(),
}));

describe('Todo Model', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock calls before each test
  });

  // ✅ Test getAll()
  it('should return all todos', async () => {
    const mockTodos = [
      { id: 1, title: 'Test Todo 1', description: 'Description 1' },
      { id: 2, title: 'Test Todo 2', description: 'Description 2' },
    ];
    
    pool.query.mockResolvedValue({ rows: mockTodos });

    const todos = await Todo.getAll();

    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM todos ORDER BY created_at DESC');
    expect(todos).toEqual(mockTodos);
  });

  // ✅ Test getById()
  it('should return a todo by ID', async () => {
    const mockTodo = { id: 1, title: 'Test Todo', description: 'Description' };
    
    pool.query.mockResolvedValue({ rows: [mockTodo] });

    const todo = await Todo.getById(1);

    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM todos WHERE id = $1', [1]);
    expect(todo).toEqual(mockTodo);
  });

  it('should return null if todo not found', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const todo = await Todo.getById(999);

    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM todos WHERE id = $1', [999]);
    expect(todo).toBeUndefined();
  });

  // ✅ Test create()
  it('should create a new todo', async () => {
    const newTodo = { id: 3, title: 'New Todo', description: 'New Description' };
    
    pool.query.mockResolvedValue({ rows: [newTodo] });

    const createdTodo = await Todo.create('New Todo', 'New Description');

    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *',
      ['New Todo', 'New Description']
    );
    expect(createdTodo).toEqual(newTodo);
  });

  // ✅ Test update()
  it('should update an existing todo', async () => {
    const updatedTodo = { id: 1, title: 'Updated Title', description: 'Updated Description', completed: true };
    
    pool.query.mockResolvedValue({ rows: [updatedTodo] });

    const result = await Todo.update(1, 'Updated Title', 'Updated Description', true);

    expect(pool.query).toHaveBeenCalledWith(
      'UPDATE todos SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *',
      ['Updated Title', 'Updated Description', true, 1]
    );
    expect(result).toEqual(updatedTodo);
  });

  it('should return null when updating a non-existent todo', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await Todo.update(999, 'Non-existent', 'No data', false);

    expect(pool.query).toHaveBeenCalledWith(
      'UPDATE todos SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *',
      ['Non-existent', 'No data', false, 999]
    );
    expect(result).toBeUndefined();
  });

  // ✅ Test delete()
  it('should delete a todo', async () => {
    const deletedTodo = { id: 1, title: 'Deleted Todo', description: 'Deleted Description' };
    
    pool.query.mockResolvedValue({ rows: [deletedTodo] });

    const result = await Todo.delete(1);

    expect(pool.query).toHaveBeenCalledWith('DELETE FROM todos WHERE id = $1 RETURNING *', [1]);
    expect(result).toEqual(deletedTodo);
  });

  it('should return null when deleting a non-existent todo', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await Todo.delete(999);

    expect(pool.query).toHaveBeenCalledWith('DELETE FROM todos WHERE id = $1 RETURNING *', [999]);
    expect(result).toBeUndefined();
  });
});
