const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const memoRoutes = require('./routes/memoRoutes'); // 👈 라우터 불러오기

const app = express();
const port = process.env.PORT || 3000;

// ✅ 미들웨어
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// ✅ "/api"로 시작하는 모든 요청은 memoRoutes에서 처리
app.use('/api', memoRoutes);

// ✅ 나머지 라우트는 404 처리
app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
