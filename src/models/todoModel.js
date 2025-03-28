const pool = require('../db');

class Todo {
  static async getAll() {
    const query = 'SELECT * FROM todos ORDER BY created_at DESC';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async getById(id) {
    const query = 'SELECT * FROM todos WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async create(title, description) {
    const query = 'INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *';
    const { rows } = await pool.query(query, [title, description]);
    return rows[0];
  }

  static async update(id, title, description, completed) {
    const query = 'UPDATE todos SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *';
    const { rows } = await pool.query(query, [title, description, completed, id]);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM todos WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = Todo;