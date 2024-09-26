import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Profesor } from "./profesorModel";
import { Estudiante } from "./estudianteModel";

@Entity('cursos')
export class Curso {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @CreateDateColumn({ name: 'createAt' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updateAt' })
    updatedAt: Date;

    @ManyToOne(() => Profesor, profesor => profesor.cursos)
    @JoinColumn({ name: 'profesor_id' })
    profesor: Profesor;

    @ManyToMany(() => Estudiante, estudiante => estudiante.cursos)
    @JoinTable({
        name: 'cursos_estudiantes',
        joinColumn: { name: 'curso_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'estudiante_id', referencedColumnName: 'id' }
    })
    estudiantes: Estudiante[];
}
