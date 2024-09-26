import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from "typeorm";
import { Curso } from "./cursoModel";

@Entity('estudiantes')
export class Estudiante {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    dni: string;

    @Column()
    nombre: string;

    @Column()
    apellido: string;

    @Column({ unique: true })
    email: string;

    @CreateDateColumn({ name: 'createAt' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updateAt' })
    updatedAt: Date;

    @ManyToMany(() => Curso, curso => curso.estudiantes)
    cursos: Curso[];
}
