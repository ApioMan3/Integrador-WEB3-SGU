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
const router = express_1.default.Router();
const profesorModel_1 = require("../models/profesorModel");
const cursosController_1 = require("../controllers/cursosController");
router.get('/listarCursos', cursosController_1.consultarCursos);
router.get('/crearCurso', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesores = yield conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor).find();
        res.render('crearCursos', {
            pagina: 'Crear Curso',
            profesores
        });
    }
    catch (error) {
        console.error("Error al obtener los profesores:", error);
        res.status(500).send("Error al obtener los profesores");
    }
}));
router.get('/modificarCurso/:id', cursosController_1.modificar);
router.post('/modificarCurso/:id', cursosController_1.actualizarCurso);
router.post('/', cursosController_1.insertar);
router.delete('/:id', cursosController_1.borrar);
exports.default = router;
