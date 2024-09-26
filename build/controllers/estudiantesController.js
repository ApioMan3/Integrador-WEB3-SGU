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
exports.consultar = exports.modificar = exports.borrar = exports.insertar = void 0;
const express_validator_1 = require("express-validator");
const conexion_1 = require("../db/conexion");
const estudianteModel_1 = require("../models/estudianteModel");
const insertar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errores = (0, express_validator_1.validationResult)(req);
    if (!errores.isEmpty()) {
        return res.render('crearEstudiantes', {
            pagina: 'Crear Estudiante',
            errores: errores.array()
        });
    }
    const { dni, nombre, apellido, email } = req.body;
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const estudianteRepository = transactionalEntityManager.getRepository(estudianteModel_1.Estudiante);
            const existeEstudiante = yield estudianteRepository.findOne({
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
            yield estudianteRepository.save(nuevoEstudiante);
        }));
        const estudiantes = yield conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante).find();
        res.render('listarEstudiantes', {
            pagina: 'Lista de Estudiantes',
            estudiantes
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
        const estudianteRepository = conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante);
        const estudiante = yield estudianteRepository.findOne({ where: { id: parseInt(id) } });
        if (!estudiante) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
        }
        yield estudianteRepository.remove(estudiante);
        res.json({ mensaje: 'Estudiante eliminado' });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ mensaje: err.message });
        }
    }
});
exports.borrar = borrar;
const modificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudianteRepository = conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante);
        const estudiante = yield estudianteRepository.findOneBy({
            id: parseInt(req.params.id),
        });
        if (!estudiante) {
            return res.status(404).json("Estudiante no encontrado");
        }
        estudianteRepository.merge(estudiante, req.body);
        yield estudianteRepository.save(estudiante);
        return res.redirect("/estudiantes/listarEstudiantes");
    }
    catch (error) {
        return res.status(500).json({
            message: "Error en catch al modificar el estudiante",
            error: error.message,
        });
    }
});
exports.modificar = modificar;
const consultar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudianteRepository = conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante);
        const estudiantes = yield estudianteRepository.find();
        res.render('listarEstudiantes', {
            pagina: 'Lista de Estudiantes',
            estudiantes
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.consultar = consultar;
