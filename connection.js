import moongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();
const url = process.env.URI;

async function main() {
    moongoose.connect(url)
    .then(() => console.log('MongoDB is up and running'))
    .catch(error => console.error('Connection Error: ', error))
}

export default main;