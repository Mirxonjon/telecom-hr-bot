import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()
const read = dir => JSON.parse(fs.readFileSync(path.join(process.cwd(), 'model', dir)))

const write = (dir, data) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(path.join(process.cwd(), 'model', dir), JSON.stringify(data, null, 4), err => {
			if (err) reject(err)

			resolve("Ok")
		})
	})
}

export {
	read,
	write
}