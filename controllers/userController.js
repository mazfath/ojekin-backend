const db = require('../config/db');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

exports.getAllUsers = async (req, res, next) => {
  try {
    const [users] = await db.execute('SELECT id, name, email, phone, role, foto_profile FROM users');
    res.json(users);
  } catch (error) {
    next(error);
  }
};


exports.adminUpdateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { name, phone, role, password } = req.body;
    let fotoPath;

    if (req.file) {
      fotoPath = `/uploads/profile/${req.file.filename}`;

      // Hapus foto lama kalau ada
      const [oldUser] = await db.execute('SELECT foto_profile FROM users WHERE id = ?', [userId]);
      if (oldUser[0] && oldUser[0].foto_profile) {
        const oldPath = path.join(__dirname, '..', oldUser[0].foto_profile);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const fields = [];
    const values = [];

    if (name) {
      fields.push('name = ?');
      values.push(name);
    }
    if (phone) {
      fields.push('phone = ?');
      values.push(phone);
    }
    if (role) {
      fields.push('role = ?');
      values.push(role);
    }
    if (hashedPassword) {
      fields.push('password_hash = ?');
      values.push(hashedPassword);
    }
    if (fotoPath) {
      fields.push('foto_profile = ?');
      values.push(fotoPath);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(userId);

    const sql = `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await db.execute(sql, values);

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.adminDeleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Hapus foto profile jika ada
    const [user] = await db.execute('SELECT foto_profile FROM users WHERE id = ?', [userId]);
    if (user[0] && user[0].foto_profile) {
      const fotoPath = path.join(__dirname, '..', user[0].foto_profile);
      if (fs.existsSync(fotoPath)) {
        fs.unlinkSync(fotoPath);
      }
    }

    await db.execute('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};
