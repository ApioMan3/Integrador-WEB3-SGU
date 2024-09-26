import express from "express";
import { AppDataSource } from '../db/conexion';
import { Estudiante } from '../models/estudianteModel';
import { consultar, insertar, borrar, modificar } from '../controllers/estudiantesController';

const router = express.Router();


router.get('/listarEstudiantes', consultar);

router.get('/crearEstudiantes', (req, res) => {
    res.render('crearEstudiantes', {
        pagina: 'Crear Estudiante',
    });
});

router.post('/', insertar);

router.get('/modificaEstudiante/:id', async (req, res) => {
    const { id } = req.params;
    const estudianteRepository = AppDataSource.getRepository(Estudiante);
    const estudiante = await estudianteRepository.findOne({ where: { id: parseInt(id) } });

    if (!estudiante) {
        return res.status(404).send('Estudiante no encontrado');
    }

    res.render('modificarEstudiante', {
        pagina: 'Modificar Estudiante',
        estudiante
    });
});

router.post('/:id', modificar);

router.delete('/:id', borrar);

export default router;
