const Equipments = require('./../../models/equipmentsModel');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// to specify env path
dotenv.config({ path: './config.env' });

// to put password into DB
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
// to connect to the database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'));

// const deleteData = async () => {
//   try {
//     await Tour.deleteMany();
//   } catch (err) {
//     console.log(err);
//   }
//   process.exit();
// };
// if (process.argv[2] === '--import') {
//   importData();
//   console.log('import successful');
// } else if (process.argv[2] === '--delete') {
//   deleteData();
//   console.log('delete successful');
// }
