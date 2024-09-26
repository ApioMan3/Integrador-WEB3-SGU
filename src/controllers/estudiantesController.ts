import express, { NextFunction } from 'express';
import { Request, Response } from "express";
import { check, validationResult } from 'express-validator';
import { AppDataSource } from '../db/conexion';
import { Estudiante } from '../models/estudianteModel';

export const insertar = async (req: Request, res: Response): Promise<void> => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.render('crearEstudiantes', {
            pagina: 'Crear Estudiante',
            errores: errores.array()
        });
    }

    const { dni, nombre, apellido, email } = req.body;

    try {
        await AppDataSource.transaction(async (transactionalEntityManager) => {
            const estudianteRepository = transactionalEntityManager.getRepository(Estudiante);
            const existeEstudiante = await estudianteRepository.findOne({
                where: [
                    { dni },
                    { email }
                ]
            });

            if (existeEstudiante) {
                return res.render('crearEstudiantes', {
                    pagina: 'Crear Estudiante',
                    errores: [{ msg: 'El estudiante ya existe.' }]
                });
            }

            const nuevoEstudiante = estudianteRepository.create({ dni, nombre, apellido, email });
            await estudianteRepository.save(nuevoEstudiante);
        });

        const estudiantes = await AppDataSource.getRepository(Estudiante).find();
        res.render('listarEstudiantes', {
            pagina: 'Lista de Estudiantes',
            estudiantes
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
        const estudianteRepository = AppDataSource.getRepository(Estudiante);
        const estudiante = await estudianteRepository.findOne({ where: { id: parseInt(id) } });

        if (!estudiante) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
        }

        await estudianteRepository.remove(estudiante);
        res.json({ mensaje: 'Estudiante eliminado' });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ mensaje: err.message });
        }
    }
};


export const modificar = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    try {
      const estudianteRepository = AppDataSource.getRepository(Estudiante);
      const estudiante: Estudiante | null = await estudianteRepository.findOneBy({
        id: parseInt(req.params.id),
      });
      if (!estudiante) {
        return res.status(404).json("Estudiante no encontrado");
      }
      estudianteRepository.merge(estudiante, req.body);
      await estudianteRepository.save(estudiante);
      

      return res.redirect("/estudiantes/listarEstudiantes");
    } catch (error: any) {
      return res.status(500).json({
        message: "Error en catch al modificar el estudiante",
        error: error.message,
      });
    }
  };


export const consultar = async (req: Request, res: Response) => {
    try {
        const estudianteRepository = AppDataSource.getRepository(Estudiante);
        const estudiantes = await estudianteRepository.find();
        res.render('listarEstudiantes', {
            pagina: 'Lista de Estudiantes',
            estudiantes
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
};
