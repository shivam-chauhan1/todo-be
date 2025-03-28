const { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo } = require('../../controllers/todoController');
const Todo = require('../../models/todoModel');

jest.mock('../../models/todoModel');

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
};

describe('Todo Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = mockRes();
        jest.clearAllMocks();
    });

    it('should return all todos with status 200', async () => {
        const todos = [{ id: 1, title: 'Test Todo', description: 'Test Description' }];
        Todo.getAll.mockResolvedValue(todos);

        await getAllTodos(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(todos);
    });

    it('should return a todo when found', async () => {
        req.params = { id: '1' };
        const todo = { id: 1, title: 'Sample Todo' };
        Todo.getById.mockResolvedValue(todo);

        await getTodoById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(todo);
    });

    it('should return 404 when todo is not found', async () => {
        req.params = { id: '1' };
        Todo.getById.mockResolvedValue(null);

        await getTodoById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Todo not found' });
    });

    it('should create a new todo with status 201', async () => {
        req.body = { title: 'New Todo', description: 'New Description' };
        const newTodo = { id: 2, title: 'New Todo', description: 'New Description' };
        Todo.create.mockResolvedValue(newTodo);

        await createTodo(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(newTodo);
    });

    it('should return 400 when title is missing', async () => {
        req.body = { description: 'Missing Title' };

        await createTodo(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Title is required' });
    });

    it('should update a todo with status 200', async () => {
        req.params = { id: '1' };
        req.body = { title: 'Updated Todo', description: 'Updated Description', completed: true };
        const updatedTodo = { id: 1, title: 'Updated Todo', description: 'Updated Description', completed: true };
        Todo.update.mockResolvedValue(updatedTodo);

        await updateTodo(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedTodo);
    });

    it('should return 404 when trying to update a non-existent todo', async () => {
        req.params = { id: '1' };
        req.body = { title: 'Updated Todo' };
        Todo.update.mockResolvedValue(null);

        await updateTodo(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Todo not found' });
    });

    it('should delete a todo with status 200', async () => {
        req.params = { id: '1' };
        const deletedTodo = { id: 1, title: 'Deleted Todo' };
        Todo.delete.mockResolvedValue(deletedTodo);

        await deleteTodo(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(deletedTodo);
    });

    it('should return 404 when trying to delete a non-existent todo', async () => {
        req.params = { id: '1' };
        Todo.delete.mockResolvedValue(null);

        await deleteTodo(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Todo not found' });
    });
});
