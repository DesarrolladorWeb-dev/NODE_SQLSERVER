import sql from 'mssql'

const dbSettings = {
    user: 'sa',
    password : '12345678',
    server : 'localhost',
    database : 'webstore',
    options : {
        encrypt : false,
        trustServerCertificate : true,
    }

}
export const getConnection = async () => {
    try {
        // pool: la conexioon que podremos reutilizar en muchos archivos
        const pool = await sql.connect(dbSettings)

        return pool
        
    } catch (error) {
        console.log(error)
    }
}