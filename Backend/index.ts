const app = require('./src/app.ts');

app.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}!`));

