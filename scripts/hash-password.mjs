import bcrypt from "bcryptjs"

const password = process.argv[2] || "admin123"
const hash = bcrypt.hashSync(password, 10)

console.log(`Password: ${password}`)
console.log(`Bcrypt Hash: ${hash}`)
console.log(`For .env.local: ADMIN_PASSWORD_HASH=${hash.replace(/\$/g, "\\$")}`)
