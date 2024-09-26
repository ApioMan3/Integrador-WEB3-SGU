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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conexion_1 = require("../db/conexion");
const estudianteModel_1 = require("../models/estudianteModel");
const estudiantesController_1 = require("../controllers/estudiantesController");
const router = express_1.default.Router();
router.get('/listarEstudiantes', estudiantesController_1.consultar);
router.get('/crearEstudiantes', (req, res) => {
    res.render('crearEstudiantes', {
        pagina: 'Crear Estudiante',
    });
});
router.post('/', estudiantesController_1.insertar);
router.get('/modificaEstudiante/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const estudianteRepository = conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante);
    const estudiante = yield estudianteRepository.findOne({ where: { id: parseInt(id) } });
    if (!estudiante) {
        return res.status(404).send('Estudiante no encontrado');
    }
    res.render('modificarEstudiante', {
        pagina: 'Modificar Estudiante',
        estudiante
    });
}));
router.post('/:id', estudiantesController_1.modificar);
router.delete('/:id', estudiantesController_1.borrar);
exports.default = router;
