"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultarUno = exports.consultar = exports.modificar = exports.borrar = exports.insertar = void 0;
const express_validator_1 = require("express-validator");
const conexion_1 = require("../db/conexion");
const profesorModel_1 = require("../models/profesorModel");
const insertar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errores = (0, express_validator_1.validationResult)(req);
    if (!errores.isEmpty()) {
        return res.render('crearProfesores', {
            pagina: 'Crear Profesor',
            errores: errores.array()
        });
    }
    const { dni, nombre, apellido, email, profesion, telefono } = req.body;
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const profesorRepository = transactionalEntityManager.getRepository(profesorModel_1.Profesor);
            const existeProfesor = yield profesorRepository.findOne({
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
            yield profesorRepository.save(nuevoProfesor);
        }));
        const profesores = yield conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor).find();
        res.render('listarProfesores', {
            pagina: 'Lista de Profesores',
            profesores
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ mensaje: err.message });
        }
    }
});
exports.insertar = insertar;
const borrar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const profesorRepository = conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor);
        const profesor = yield profesorRepository.findOne({ where: { id: parseInt(id) } });
        if (!profesor) {
            return res.status(404).json({ mensaje: 'Profesor no encontrado' });
        }
        yield profesorRepository.remove(profesor);
        res.json({ mensaje: 'Profesor eliminado' });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ mensaje: err.message });
        }
    }
});
exports.borrar = borrar;
const modificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { dni, nombre, apellido, email, profesion, telefono } = req.body;
    const profesorRepository = conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor);
    try {
        const elProfesor = yield profesorRepository.findOneBy({ id: parseInt(req.params.id) });
        if (elProfesor) {
            profesorRepository.merge(elProfesor, req.body);
            const resultado = yield profesorRepository.save(elProfesor);
            return res.redirect('/profesores/listarProfesores');
        }
        else {
            res.status(400).json({ mensaje: 'No se ha encontrado el profesor' });
        }
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.modificar = modificar;
const consultar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesorRepository = conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor);
        const profesores = yield profesorRepository.find();
        res.render('listarProfesores', {
            pagina: 'Lista de Profesores',
            profesores
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.consultar = consultar;
const consultarUno = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const profesorRepository = conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor);
        const profesor = yield profesorRepository.findOne({ where: { id: parseInt(id) } });
        if (!profesor) {
            return res.status(404).send('Profesor no encontrado');
        }
        res.render('modificarProfesor', {
            pagina: 'Modificar Profesor',
            profesor
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.consultarUno = consultarUno;
