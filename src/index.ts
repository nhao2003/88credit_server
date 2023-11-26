import { startServer } from './app/server';
import { AppDataSource } from './app/database';
const PORT = process.env.PORT || 8000;
startServer(AppDataSource)
  .then((app) => {
    app.listen(PORT, () => {
      console.log(`Server is running on: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log('Server failed to start');
    console.log(err);
    process.exit(1);
  });
