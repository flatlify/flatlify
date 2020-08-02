import { bootstrap } from './main';
import * as dotenv from 'dotenv';
import * as fse from 'fs-extra';

dotenv.config();

fse.ensureDir(process.env.DB_DIR).then(() => bootstrap());
