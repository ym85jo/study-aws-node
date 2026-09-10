const express = require('express');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Body Parser (POST/PUT 요청 데이터 파싱) 및 View Engine 설정
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './views');

// ALB/ELB 상태 검사(Health Check) 전용 엔드포인트
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// 1. 게시글 목록 조회 (READ ALL)
app.get('/', async (req, res) => {
  try {
    const [posts] = await db.query('SELECT * FROM posts ORDER BY id DESC');
    res.render('index', { posts });
  } catch (err) {
    console.error('목록 조회 에러:', err);
    res.status(500).send('DB 조회 실패');
  }
});

// 2. 게시글 작성 페이지 (CREATE UI)
app.get('/write', (req, res) => {
  res.render('write');
});

// 3. 게시글 저장 (CREATE PROCESS)
app.post('/write', async (req, res) => {
  const { title, content } = req.body;
  try {
    await db.query('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content]);
    res.redirect('/');
  } catch (err) {
    console.error('글 작성 에러:', err);
    res.status(500).send('DB 저장 실패');
  }
});

// 4. 게시글 상세 조회 (READ ONE)
app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).send('게시글을 찾을 수 없습니다.');
    res.render('detail', { post: rows[0] });
  } catch (err) {
    console.error('상세 조회 에러:', err);
    res.status(500).send('DB 조회 실패');
  }
});

// 5. 게시글 수정 페이지 (UPDATE UI)
app.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).send('게시글을 찾을 수 없습니다.');
    res.render('edit', { post: rows[0] });
  } catch (err) {
    console.error('수정 페이지 에러:', err);
    res.status(500).send('DB 조회 실패');
  }
});

// 6. 게시글 수정 처리 (UPDATE PROCESS)
app.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    await db.query('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, id]);
    res.redirect(`/post/${id}`);
  } catch (err) {
    console.error('글 수정 에러:', err);
    res.status(500).send('DB 수정 실패');
  }
});

// 7. 게시글 삭제 처리 (DELETE PROCESS)
app.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM posts WHERE id = ?', [id]);
    res.redirect('/');
  } catch (err) {
    console.error('글 삭제 에러:', err);
    res.status(500).send('DB 삭제 실패');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Node.js 웹 서버 실행중: http://localhost:${PORT}`);
});
