const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role = 'customer' } = req.body;

    if ((!email && !phone) || !password || !name) {
      return res.status(400).json({ message: 'Name, email/phone, dan password wajib diisi' });
    }

    const [exists] = await db.execute(
      'SELECT id FROM users WHERE email = ? OR phone = ?',
      [email || null, phone || null]
    );

    if (exists.length > 0) {
      return res.status(400).json({ message: 'Email atau nomor sudah terdaftar' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const foto_profile = req.file ? `/uploads/profile/${req.file.filename}` : null;

    await db.execute(
      `INSERT INTO users (name, email, phone, password_hash, role, foto_profile, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, email || null, phone || null, password_hash, role, foto_profile]
    );

    res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({ message: 'Email/phone dan password wajib diisi' });
    }

    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ? OR phone = ?',
      [email || null, phone || null]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'User tidak ditemukan' });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ message: 'Password salah' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        foto_profile: user.foto_profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const [users] = await db.execute('SELECT id, name, email, phone, role, foto_profile FROM users WHERE id = ?', [req.user.id]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json(users[0]);
  } catch (error) {
    next(error);
  }
};


exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, phone, password } = req.body;
    let fotoPath;

    if (req.file) {
      fotoPath = `/uploads/profile/${req.file.filename}`;

      // Hapus foto lama (jika ada)
      const [oldUser] = await db.execute('SELECT foto_profile FROM users WHERE id = ?', [userId]);
      if (oldUser[0].foto_profile) {
        const oldPath = path.join(__dirname, '..', oldUser[0].foto_profile);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Buat query update dinamis
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
    if (hashedPassword) {
      fields.push('password_hash = ?');
      values.push(hashedPassword);
    }
    if (fotoPath) {
      fields.push('foto_profile = ?');
      values.push(fotoPath);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Tidak ada data yang diubah' });
    }

    values.push(userId);
    const sql = `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await db.execute(sql, values);

    res.json({ message: 'Profil berhasil diperbarui' });
  } catch (error) {
    next(error);
  }
};