import express from "express";
import { AppDataSource } from '../db/conexion';
import { Estudiante } from '../models/estudianteModel';
import { Curso } from '../models/cursoModel';
import { consultarInscripciones, modificarInscripcion, actualizarInscripcion, inscribir, calificar, cancelarInscripcion, listarInscripcionesPorEstudiante,listarInscripcionesPorCurso } from '../controllers/inscripcionController';


const router=express.Router();
router.get('/', consultarInscripciones);
router.get("/porEstudiante/:id", listarInscripcionesPorEstudiante);
router.get("/porCurso/:id", listarInscripcionesPorCurso);

router.post('/',inscribir);

router.get('/crearInscripcion', async (req, res) => {
    try {
        const estudiantes = await AppDataSource.getRepository(Estudiante).find();
        const cursos = await AppDataSource.getRepository(Curso).find();
        res.render('crearInscripcion', {
            pagina: 'Crear Inscripción',
            estudiantes,
            cursos 
        });
    } catch (error) {
        console.error("Error al obtener los estudiantes o cursos:", error);
        res.status(500).send("Error al obtener los estudiantes o cursos");
    }
});




router.get('/listarInscripciones',consultarInscripciones);

router.get('/:curso_id/:estudiante_id/modificar', modificarInscripcion); // Ruta para mostrar el formulario de modificación
router.put('/:curso_id/:estudiante_id', actualizarInscripcion); // Ruta para actualizar la inscripción

router.post('/', inscribir);
router.post('/:curso_id/:estudiante_id/calificar', calificar);
router.delete('/:curso_id/:estudiante_id', cancelarInscripcion);


export default router;