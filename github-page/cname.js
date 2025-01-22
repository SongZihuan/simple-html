import fs from "fs"

const domain = 'homepage.song-zh.com'

fs.writeFile('./docs/CNAME', domain, () => {})
