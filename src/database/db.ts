import mysql, { RowDataPacket } from 'mysql2/promise';
import { config } from '../config';
import { logger } from 'src/utils/logger';

const pool = mysql.createPool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    waitForConnections: config.database.waitForConnections,
    connectionLimit: config.database.connectionLimit,
    queueLimit: config.database.queueLimit
});

export const queryDB = async <T>(query: string, values: any[] = []): Promise<T[]> => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute<T[] & RowDataPacket[]>(query, values);
        return rows;
    }
    catch (error: any) {
        logger.error(`Error executing query: ${error.message}`);
        throw new Error(error);
    } finally {
        connection.release();
    }
};

export default pool;
