const fs = require('fs')

const domain = 'homepage.song-zh.com'

fs.writeFile('./docs/CNAME', domain, () => {})
