import { Request,Response, NextFunction } from "express";
import { Curso } from "../models/cursoModel";
import { Profesor } from "../models/profesorModel";
import { AppDataSource } from "../db/conexion";
import { check, validationResult } from "express-validator";
import { CursoEstudiante } from '../models/inscripcionModel';


export const insertar = async (req: Request, res: Response): Promise<void> => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
     res.status(400).json({ errores: errores.array() });
  }
  
  const { nombre, descripcion, profesor_id } = req.body;
  try {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const cursoRepository = transactionalEntityManager.getRepository(Curso);
      const profesorRepository = transactionalEntityManager.getRepository(Profesor);
      const profesor = await profesorRepository.findOneBy({ id: profesor_id });
      if (!profesor) {
        throw new Error('El profesor especificado no existe.');
      }

      const existeCurso = await cursoRepository.findOne({
        where: { nombre }
      });

      if (existeCurso) {
        throw new Error('El curso ya existe.');
      }

      const nuevoCurso = cursoRepository.create({ nombre, descripcion, profesor });
      await cursoRepository.save(nuevoCurso);
    });

    const cursos = await AppDataSource.getRepository(Curso).find();
    res.redirect('/cursos/listarCursos');
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ mensaje: err.message });
    } else {
      res.status(500).json({ mensaje: 'Error desconocido' });
    }
  }
};
 

         


  export const borrar = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {

        await AppDataSource.transaction(async transactionalEntityManager => {
            const inscripcionRepository = transactionalEntityManager.getRepository(CursoEstudiante);
            const estudianteRepository = transactionalEntityManager.getRepository(Curso);

            const cursosRelacionados = await inscripcionRepository.count({ where: { curso: { id: Number(id) } } });
            if (cursosRelacionados > 0) {
                throw new Error('Curso asociado a estudiantes, no se puede eliminar');
            }
            const deleteResult = await estudianteRepository.delete(id);

            if (deleteResult.affected === 1) {
                return res.json({ mensaje: 'Curso eliminado' }); 
            } else {
                throw new Error('Curso no encontrado');
            }
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ mensaje: err.message });
        } else {
            res.status(400).json({ mensaje: 'Error' });
        }
    }
  };  
             
      

  export const modificar = async (req: Request, res: Response) => {
    try {
        const cursoRepository = AppDataSource.getRepository(Curso);
        const profesorRepository = AppDataSource.getRepository(Profesor);
        

        const curso = await cursoRepository.findOne({ where: { id: parseInt(req.params.id) }, relations: ['profesor'] });
        
        if (!curso) {
            return res.status(404).send('Curso no encontrado');
        }

        const profesores = await profesorRepository.find();


        res.render('modificarCurso', {
            pagina: 'Modificar Curso',
            curso,
            profesores
        });
    } catch (error) {
        console.error('Error al modificar el curso:', error);
        res.status(500).send('Error al modificar el curso');
    }
};

export const actualizarCurso = async (req: Request, res: Response) => {
  try {
      const { nombre, descripcion, profesor_id } = req.body;

      if (!nombre || !descripcion || !profesor_id) {
          return res.status(400).send('Todos los campos son obligatorios.');
      }

      const cursoRepository = AppDataSource.getRepository(Curso);
      const profesorRepository = AppDataSource.getRepository(Profesor);


      const curso = await cursoRepository.findOneBy({ id: parseInt(req.params.id) });
      if (!curso) {
          return res.status(404).send('Curso no encontrado');
      }


      const profesor = await profesorRepository.findOneBy({ id: parseInt(profesor_id) });
      if (!profesor) {
          return res.status(404).send('Profesor no encontrado');
      }


      curso.nombre = nombre;
      curso.descripcion = descripcion;
      curso.profesor = profesor;


      await cursoRepository.save(curso);


      res.redirect('/cursos/listarCursos');
  } catch (error) {
      console.error('Error al actualizar el curso:', error); 
      res.status(500).send('Error al actualizar el curso: ' + error);
  }
};


 

      export const consultarCursos = async (req: Request, res: Response): Promise<void> => {
        try {
          const cursoRepository = AppDataSource.getRepository(Curso);
          const cursos = await cursoRepository.find({ relations: ['profesor'] });
          res.render('listarCursos', {
            pagina: 'Lista de Cursos',
            cursos
          });
        } catch (err: unknown) {
          if (err instanceof Error) {
            res.status(500).send(err.message);
          } else {
            res.status(500).send('Error desconocido');
          }
        }
      };

    export const buscarCursos = async (req:Request,res:Response):Promise<Curso[] |null |undefined>=>{
        try{
          const cursoRepository = AppDataSource.getRepository(Curso);
          const cursos = await cursoRepository.find();
            if(cursos){
                return cursos;
            } else {
                return null;
            }
        }catch(err:unknown){
          if (err instanceof Error) {
            res.status(400).json({ mensaje: err.message });
        } else {
            res.status(400).json({ mensaje: 'Error' });
        }
        }
    }

     

    export const consultarUno= async (req:Request,res:Response) =>{

    try {
      const cursoRepository = AppDataSource.getRepository(Curso);
      const cursos = await cursoRepository.find({ relations: ['profesor'] });
      res.render('modificarCurso', {
        pagina: 'Modificar Curso',
        cursos,
    });
      
    } catch (err) {
      if(err instanceof Error){
      res.status(500).send(err.message);
    }}
    }
