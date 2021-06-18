import fs from 'fs';

export default (path: string) => fs.readFileSync(`assets/app/${path}`, 'utf8');
