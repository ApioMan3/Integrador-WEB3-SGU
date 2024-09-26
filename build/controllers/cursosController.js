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
exports.consultarUno = exports.buscarCursos = exports.consultarCursos = exports.actualizarCurso = exports.modificar = exports.borrar = exports.insertar = void 0;
const cursoModel_1 = require("../models/cursoModel");
const profesorModel_1 = require("../models/profesorModel");
const conexion_1 = require("../db/conexion");
const express_validator_1 = require("express-validator");
const inscripcionModel_1 = require("../models/inscripcionModel");
const insertar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errores = (0, express_validator_1.validationResult)(req);
    if (!errores.isEmpty()) {
        res.status(400).json({ errores: errores.array() });
    }
    const { nombre, descripcion, profesor_id } = req.body;
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const cursoRepository = transactionalEntityManager.getRepository(cursoModel_1.Curso);
            const profesorRepository = transactionalEntityManager.getRepository(profesorModel_1.Profesor);
            const profesor = yield profesorRepository.findOneBy({ id: profesor_id });
            if (!profesor) {
                throw new Error('El profesor especificado no existe.');
            }
            const existeCurso = yield cursoRepository.findOne({
                where: { nombre }
            });
            if (existeCurso) {
                throw new Error('El curso ya existe.');
            }
            const nuevoCurso = cursoRepository.create({ nombre, descripcion, profesor });
            yield cursoRepository.save(nuevoCurso);
        }));
        const cursos = yield conexion_1.AppDataSource.getRepository(cursoModel_1.Curso).find();
        res.redirect('/cursos/listarCursos');
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ mensaje: err.message });
        }
        else {
            res.status(500).json({ mensaje: 'Error desconocido' });
        }
    }
});
exports.insertar = insertar;
const borrar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const inscripcionRepository = transactionalEntityManager.getRepository(inscripcionModel_1.CursoEstudiante);
            const estudianteRepository = transactionalEntityManager.getRepository(cursoModel_1.Curso);
            const cursosRelacionados = yield inscripcionRepository.count({ where: { curso: { id: Number(id) } } });
            if (cursosRelacionados > 0) {
                throw new Error('Curso asociado a estudiantes, no se puede eliminar');
            }
            const deleteResult = yield estudianteRepository.delete(id);
            if (deleteResult.affected === 1) {
                return res.json({ mensaje: 'Curso eliminado' });
            }
            else {
                throw new Error('Curso no encontrado');
            }
        }));
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ mensaje: err.message });
        }
        else {
            res.status(400).json({ mensaje: 'Error' });
        }
    }
});
exports.borrar = borrar;
const modificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cursoRepository = conexion_1.AppDataSource.getRepository(cursoModel_1.Curso);
        const profesorRepository = conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor);
        const curso = yield cursoRepository.findOne({ where: { id: parseInt(req.params.id) }, relations: ['profesor'] });
        if (!curso) {
            return res.status(404).send('Curso no encontrado');
        }
        const profesores = yield profesorRepository.find();
        res.render('modificarCurso', {
            pagina: 'Modificar Curso',
            curso,
            profesores
        });
    }
    catch (error) {
        console.error('Error al modificar el curso:', error);
        res.status(500).send('Error al modificar el curso');
    }
});
exports.modificar = modificar;
const actualizarCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, descripcion, profesor_id } = req.body;
        if (!nombre || !descripcion || !profesor_id) {
            return res.status(400).send('Todos los campos son obligatorios.');
        }
        const cursoRepository = conexion_1.AppDataSource.getRepository(cursoModel_1.Curso);
        const profesorRepository = conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor);
        const curso = yield cursoRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!curso) {
            return res.status(404).send('Curso no encontrado');
        }
        const profesor = yield profesorRepository.findOneBy({ id: parseInt(profesor_id) });
        if (!profesor) {
            return res.status(404).send('Profesor no encontrado');
        }
        curso.nombre = nombre;
        curso.descripcion = descripcion;
        curso.profesor = profesor;
        yield cursoRepository.save(curso);
        res.redirect('/cursos/listarCursos');
    }
    catch (error) {
        console.error('Error al actualizar el curso:', error);
        res.status(500).send('Error al actualizar el curso: ' + error);
    }
});
exports.actualizarCurso = actualizarCurso;
const consultarCursos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cursoRepository = conexion_1.AppDataSource.getRepository(cursoModel_1.Curso);
        const cursos = yield cursoRepository.find({ relations: ['profesor'] });
        res.render('listarCursos', {
            pagina: 'Lista de Cursos',
            cursos
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
        else {
            res.status(500).send('Error desconocido');
        }
    }
});
exports.consultarCursos = consultarCursos;
const buscarCursos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cursoRepository = conexion_1.AppDataSource.getRepository(cursoModel_1.Curso);
        const cursos = yield cursoRepository.find();
        if (cursos) {
            return cursos;
        }
        else {
            return null;
        }
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ mensaje: err.message });
        }
        else {
            res.status(400).json({ mensaje: 'Error' });
        }
    }
});
exports.buscarCursos = buscarCursos;
const consultarUno = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cursoRepository = conexion_1.AppDataSource.getRepository(cursoModel_1.Curso);
        const cursos = yield cursoRepository.find({ relations: ['profesor'] });
        res.render('modificarCurso', {
            pagina: 'Modificar Curso',
            cursos,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.consultarUno = consultarUno;
