import fs from 'node:fs'

fs.cpSync('.env.example', '.env')
fs.writeFileSync('version', 'local')
