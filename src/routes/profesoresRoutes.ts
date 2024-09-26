import express from "express";
import { AppDataSource } from '../db/conexion';
import { Profesor } from '../models/profesorModel';
import { consultar, insertar, borrar, modificar, consultarUno } from '../controllers/profesoresController';

const router = express.Router();

router.get('/listarProfesores', consultar);

router.get('/crearProfesores', (req, res) => {
    res.render('crearProfesores', {
        pagina: 'Crear Profesor',
    });
});

router.post('/', insertar);

router.get('/modificaProfesor/:id', async (req, res) => {
    const { id } = req.params;
    const profesorRepository = AppDataSource.getRepository(Profesor);
    const profesor = await profesorRepository.findOne({ where: { id: parseInt(id) } });

    if (!profesor) {
        return res.status(404).send('Estudiante no encontrado');
    }

    res.render('modificarProfesor', {
        pagina: 'Modificar Profesor',
        profesor
    });
});
router.post('/:id', modificar);

router.delete('/:id', borrar);

export default router;
