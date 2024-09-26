import { Request, Response } from "express";
import { validationResult } from 'express-validator';
import { AppDataSource } from '../db/conexion';
import { Profesor } from '../models/profesorModel';

export const insertar = async (req: Request, res: Response): Promise<void> => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.render('crearProfesores', {
            pagina: 'Crear Profesor',
            errores: errores.array()
        });
    }

    const { dni, nombre, apellido, email, profesion, telefono } = req.body;

    try {
        await AppDataSource.transaction(async (transactionalEntityManager) => {
            const profesorRepository = transactionalEntityManager.getRepository(Profesor);
            const existeProfesor = await profesorRepository.findOne({
                where: [
                    { dni },
                    { email }
                ]
            });

            if (existeProfesor) {
                return res.render('crearProfesores', {
                    pagina: 'Crear Profesor',
                    errores: [{ msg: 'El profesor ya existe.' }]
                });
            }

            const nuevoProfesor = profesorRepository.create({ dni, nombre, apellido, email, profesion, telefono });
            await profesorRepository.save(nuevoProfesor);
        });

        const profesores = await AppDataSource.getRepository(Profesor).find();
        res.render('listarProfesores', {
            pagina: 'Lista de Profesores',
            profesores
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ mensaje: err.message });
        }
    }
};

export const borrar = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const profesorRepository = AppDataSource.getRepository(Profesor);
        const profesor = await profesorRepository.findOne({ where: { id: parseInt(id) } });

        if (!profesor) {
            return res.status(404).json({ mensaje: 'Profesor no encontrado' });
        }

        await profesorRepository.remove(profesor);
        res.json({ mensaje: 'Profesor eliminado' });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ mensaje: err.message });
        }
    }
};

export const modificar = async (req: Request, res: Response): Promise<void> => {
    const { dni, nombre, apellido, email, profesion, telefono } = req.body;
    const profesorRepository = AppDataSource.getRepository(Profesor);

    try {
        const elProfesor = await profesorRepository.findOneBy({ id: parseInt(req.params.id) });
        if (elProfesor) {
            profesorRepository.merge(elProfesor, req.body);
            const resultado = await profesorRepository.save(elProfesor);
            return res.redirect('/profesores/listarProfesores');
        } else {
            res.status(400).json({ mensaje: 'No se ha encontrado el profesor' });
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
};

export const consultar = async (req: Request, res: Response) => {
    try {
        const profesorRepository = AppDataSource.getRepository(Profesor);
        const profesores = await profesorRepository.find();
        res.render('listarProfesores', {
            pagina: 'Lista de Profesores',
            profesores
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
};

export const consultarUno = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const profesorRepository = AppDataSource.getRepository(Profesor);
        const profesor = await profesorRepository.findOne({ where: { id: parseInt(id) } });

        if (!profesor) {
            return res.status(404).send('Profesor no encontrado');
        }

        res.render('modificarProfesor', {
            pagina: 'Modificar Profesor',
            profesor
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
};
