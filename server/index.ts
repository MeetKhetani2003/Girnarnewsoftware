import apiApp from './apiApp.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

apiApp.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
