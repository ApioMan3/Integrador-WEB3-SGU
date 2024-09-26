import { DataSource } from "typeorm";
import { createConnection } from "mysql2/promise";
import {Estudiante} from "../models/estudianteModel";
import {Curso} from "../models/cursoModel";
import {Profesor} from "../models/profesorModel";
import { CursoEstudiante} from "../models/inscripcionModel";

async function createDatabaseIfNotExists(){
    const connection = await createConnection({
        host:"localhost",
        port:3306,
        user:"root",
        password:"",
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS universidad`);
    await connection.end();
}

export const AppDataSource = new DataSource({
type:"mysql",
host:"localhost",
username:"root",
password:"",
database:"universidad",
entities:[Estudiante, Curso, Profesor, CursoEstudiante],
synchronize: false,
logging:true
});

export async function inicializeDatabase(){
    await createDatabaseIfNotExists();
    await AppDataSource.initialize();
}