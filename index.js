import express from 'express'
const app = express()
const PORT = 3005
import { createTaskTable, createUsersTable } from './dbconfig.js'
app.listen(PORT, () => {
    console.log("running server")
    createUsersTable()
    createTaskTable()
})