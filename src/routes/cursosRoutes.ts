import express from "express";
import { AppDataSource } from '../db/conexion';
const router = express.Router();
import { Profesor } from '../models/profesorModel';
import { Curso } from '../models/cursoModel';
import { consultarCursos, insertar, borrar, modificar, actualizarCurso,consultarUno} from '../controllers/cursosController';



router.get('/listarCursos', consultarCursos);
router.get('/crearCurso', async (req, res) => {
    try {
        const profesores = await AppDataSource.getRepository(Profesor).find();
        res.render('crearCursos', {
            pagina: 'Crear Curso',
            profesores 
        });
    } catch (error) {
        console.error("Error al obtener los profesores:", error);
        res.status(500).send("Error al obtener los profesores");
    }
});

router.get('/modificarCurso/:id', modificar); 
router.post('/modificarCurso/:id', actualizarCurso);
router.post('/', insertar);
router.delete('/:id', borrar);


export default router;