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
exports.actualizarInscripcion = exports.modificarInscripcion = exports.calificar = exports.cancelarInscripcion = exports.inscribir = exports.listarInscripcionesPorCurso = exports.listarInscripcionesPorEstudiante = exports.consultarInscripciones = void 0;
const inscripcionModel_1 = require("../models/inscripcionModel");
const cursoModel_1 = require("../models/cursoModel");
const profesorModel_1 = require("../models/profesorModel");
const estudianteModel_1 = require("../models/estudianteModel");
const conexion_1 = require("../db/conexion");
const consultarInscripciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inscripcionesRepository = conexion_1.AppDataSource.getRepository(inscripcionModel_1.CursoEstudiante);
        const inscripciones = yield inscripcionesRepository.find({ relations: ['estudiante', "curso"] });
        res.render('listarInscripciones', {
            pagina: 'Lista de Inscripciones',
            inscripciones
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
exports.consultarInscripciones = consultarInscripciones;
const listarInscripcionesPorEstudiante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const estudianteRepository = conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante);
        const inscripcionRepository = conexion_1.AppDataSource.getRepository(inscripcionModel_1.CursoEstudiante);
        const estudiante = yield estudianteRepository.findOne({ where: { id: parseInt(id) } });
        if (!estudiante) {
            res.status(404).json({ mensaje: "Estudiante no encontrado" });
            return;
        }
        const inscripciones = yield inscripcionRepository.find({
            where: { estudiante: { id: parseInt(id) } },
            relations: ["curso"],
        });
        res.render("listarInscripcionesPorEstudiante", {
            pagina: `Inscripciones de ${estudiante.nombre} ${estudiante.apellido}`,
            inscripciones,
            estudiante,
        });
    }
    catch (err) {
        console.error("Error al listar inscripciones por estudiante:", err);
        res.status(500).send("Error al listar inscripciones");
    }
});
exports.listarInscripcionesPorEstudiante = listarInscripcionesPorEstudiante;
const listarInscripcionesPorCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const cursoRepository = conexion_1.AppDataSource.getRepository(cursoModel_1.Curso);
        const inscripcionRepository = conexion_1.AppDataSource.getRepository(inscripcionModel_1.CursoEstudiante);
        const curso = yield cursoRepository.findOne({ where: { id: parseInt(id) } });
        if (!curso) {
            res.status(404).json({ mensaje: "Curso no encontrado" });
            return;
        }
        const inscripciones = yield inscripcionRepository.find({
            where: { curso: { id: parseInt(id) } },
            relations: ["estudiante"],
        });
        res.render("listarInscripcionesPorCurso", {
            pagina: `Inscripciones en el curso ${curso.nombre}`,
            inscripciones,
            curso,
        });
    }
    catch (err) {
        console.error("Error al listar inscripciones por curso:", err);
        res.status(500).send("Error al listar inscripciones");
    }
});
exports.listarInscripcionesPorCurso = listarInscripcionesPorCurso;
const inscribir = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { estudiante_id, curso_id, fecha } = req.body;
    try {
        const estudiante = yield conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante).findOne({ where: { id: estudiante_id } });
        const curso = yield conexion_1.AppDataSource.getRepository(cursoModel_1.Curso).findOne({ where: { id: curso_id } });
        if (!estudiante || !curso) {
            res.status(400).json({ mensaje: 'Estudiante o curso no encontrado.' });
            return;
        }
        const inscripcion = new inscripcionModel_1.CursoEstudiante();
        inscripcion.estudiante = estudiante;
        inscripcion.curso = curso;
        inscripcion.fecha = fecha;
        yield conexion_1.AppDataSource.getRepository(inscripcionModel_1.CursoEstudiante).save(inscripcion);
        res.redirect('/inscripciones/listarInscripciones');
    }
    catch (err) {
        console.error('Error al inscribir al estudiante:', err);
        res.status(500).send('Error al inscribir al estudiante');
    }
});
exports.inscribir = inscribir;
const cancelarInscripcion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { curso_id, estudiante_id } = req.params;
    try {
        const inscripcionRepository = conexion_1.AppDataSource.getRepository(inscripcionModel_1.CursoEstudiante);
        const inscripcion = yield inscripcionRepository.findOne({
            where: {
                curso: { id: parseInt(curso_id) },
                estudiante: { id: parseInt(estudiante_id) }
            },
            relations: ['curso', 'estudiante']
        });
        if (!inscripcion) {
            res.status(404).json({ mensaje: 'Inscripción no encontrada.' });
            return;
        }
        yield inscripcionRepository.remove(inscripcion);
        res.json({ mensaje: 'Inscripción eliminada' });
    }
    catch (error) {
        console.error('Error al eliminar la inscripción:', error);
        res.status(500).json({ mensaje: 'Error al eliminar la inscripción' });
    }
});
exports.cancelarInscripcion = cancelarInscripcion;
const calificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, descripcion, profesor_id } = req.body;
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
        res.status(500).send('Error al actualizar el curso');
    }
});
exports.calificar = calificar;
const modificarInscripcion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { curso_id, estudiante_id } = req.params;
    try {
        const inscripcionRepository = conexion_1.AppDataSource.getRepository(inscripcionModel_1.CursoEstudiante);
        const inscripcion = yield inscripcionRepository.findOne({
            where: {
                curso: { id: parseInt(curso_id) },
                estudiante: { id: parseInt(estudiante_id) }
            },
            relations: ['curso', 'estudiante']
        });
        if (!inscripcion) {
            res.status(404).json({ mensaje: 'Inscripción no encontrada.' });
            return;
        }
        res.render('modificarInscripcion', {
            pagina: 'Modificar Inscripción',
            inscripcion
        });
    }
    catch (error) {
        console.error('Error al obtener la inscripción:', error);
        res.status(500).send('Error al obtener la inscripción.');
    }
});
exports.modificarInscripcion = modificarInscripcion;
const actualizarInscripcion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { curso_id, estudiante_id } = req.params;
    const { nota, fecha } = req.body;
    try {
        const inscripcionRepository = conexion_1.AppDataSource.getRepository(inscripcionModel_1.CursoEstudiante);
        const inscripcion = yield inscripcionRepository.findOne({
            where: {
                curso: { id: parseInt(curso_id) },
                estudiante: { id: parseInt(estudiante_id) }
            },
            relations: ['curso', 'estudiante']
        });
        if (!inscripcion) {
            res.status(404).json({ mensaje: 'Inscripción no encontrada.' });
            return;
        }
        inscripcion.nota = nota || inscripcion.nota;
        inscripcion.fecha = fecha || inscripcion.fecha;
        yield inscripcionRepository.save(inscripcion);
        res.redirect('/inscripciones/listarInscripciones');
    }
    catch (error) {
        console.error('Error al actualizar la inscripción:', error);
        res.status(500).send('Error al actualizar la inscripción.');
    }
});
exports.actualizarInscripcion = actualizarInscripcion;
